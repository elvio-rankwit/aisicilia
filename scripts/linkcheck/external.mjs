#!/usr/bin/env node
// Controllo dei link esterni dell'output di build (dist/).
//   node scripts/linkcheck/external.mjs [--dist dist] [--out .cache/linkcheck] [--internal-file f.txt]
//        [--timeout 15000] [--delay 1000] [--concurrency 8] [--limit N] [--site-host aisicilia.it]
// - HEAD, con ripiego su GET; timeout per richiesta; un nuovo tentativo per 5xx e timeout.
// - Al massimo 1 richiesta al secondo per dominio (--delay); domini diversi in parallelo.
// - 401/403/429/999 (siti che bloccano i bot) sono riportati a parte e non contano come errori.
// - Scrive report.json e report.md in --out. Codice di uscita: 0 nessun errore, 1 link da correggere, 2 guasto dello script.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { parse } from 'node-html-parser';

const argv = process.argv.slice(2);
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const ROOT = new URL('../../', import.meta.url).pathname;
const DIST = resolve(ROOT, opt('dist', 'dist'));
const OUT = resolve(ROOT, opt('out', '.cache/linkcheck'));
const TIMEOUT = Number(opt('timeout', 15000));
const DELAY = Number(opt('delay', 1000));
const CONCURRENCY = Number(opt('concurrency', 8));
const LIMIT = Number(opt('limit', 0));
const SITE_HOST = opt('site-host', new URL(process.env.PUBLIC_SITE_URL || 'https://aisicilia.it').hostname).replace(/^www\./, '');
const INTERNAL_FILE = opt('internal-file', '');
const UA = 'aisicilia-linkcheck/1.0 (+https://aisicilia.it/contatti/; verifica periodica dei link pubblicati)';
const BLOCKED = new Set([401, 403, 429, 999]);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    return d.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

// 1. Raccolta: URL esterno -> pagine in cui compare.
function collect() {
  if (!existsSync(DIST)) throw new Error(`${DIST} assente: esegui prima npm run build`);
  const found = new Map();
  const pages = walk(DIST);
  for (const file of pages) {
    const page = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '');
    const doc = parse(readFileSync(file, 'utf8'));
    for (const a of doc.querySelectorAll('a[href]')) {
      let u;
      try { u = new URL(a.getAttribute('href')); } catch { continue; }
      if (u.protocol !== 'http:' && u.protocol !== 'https:') continue;
      if (u.hostname.replace(/^www\./, '') === SITE_HOST) continue;
      u.hash = '';
      const key = u.href;
      if (!found.has(key)) found.set(key, new Set());
      found.get(key).add(page);
    }
  }
  return { found, pageCount: pages.length };
}

// 2. Richiesta singola con timeout.
async function request(url, method) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
    });
    try { await res.body?.cancel(); } catch { /* corpo non letto: va bene */ }
    return { status: res.status };
  } catch (e) {
    return { error: e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message || 'errore di rete') };
  } finally {
    clearTimeout(timer);
  }
}

const isFail = (r) => r.error || r.status >= 400;
const isRetryable = (r) => r.error === 'timeout' || r.error === 'ECONNRESET' || r.status >= 500;

// 3. Controllo di un URL: HEAD, ripiego GET, un nuovo tentativo. `wait` rispetta il ritmo per dominio.
async function check(url, wait) {
  let r = await request(url, 'HEAD');
  await wait();
  if (isFail(r)) { r = await request(url, 'GET'); await wait(); }
  if (isFail(r) && isRetryable(r)) {
    await sleep(5000);
    r = await request(url, 'GET');
    await wait();
  }
  if (!isFail(r)) return { kind: 'ok' };
  if (r.status && BLOCKED.has(r.status)) return { kind: 'blocked', detail: String(r.status) };
  return { kind: 'error', detail: r.status ? String(r.status) : r.error };
}

async function main() {
  const { found, pageCount } = collect();
  let urls = [...found.keys()].sort();
  if (LIMIT) urls = urls.slice(0, LIMIT);

  const byHost = new Map();
  for (const url of urls) {
    const host = new URL(url).host;
    if (!byHost.has(host)) byHost.set(host, []);
    byHost.get(host).push(url);
  }

  const errors = [];
  const blocked = [];
  let ok = 0;
  const hosts = [...byHost.keys()];
  const worker = async () => {
    for (let host; (host = hosts.shift()); ) {
      const wait = () => sleep(DELAY);
      for (const url of byHost.get(host)) {
        const res = await check(url, wait);
        const entry = { url, detail: res.detail, pages: [...found.get(url)].sort() };
        if (res.kind === 'ok') ok += 1;
        else if (res.kind === 'blocked') blocked.push(entry);
        else errors.push(entry);
        if (res.kind !== 'ok') console.log(`${res.kind === 'error' ? 'ERRORE ' : 'BLOCCATO'} ${res.detail}  ${url}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, hosts.length || 1) }, worker));

  errors.sort((a, b) => a.url.localeCompare(b.url));
  blocked.sort((a, b) => a.url.localeCompare(b.url));

  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Rome' }).format(new Date());
  const internal = INTERNAL_FILE && existsSync(INTERNAL_FILE)
    ? readFileSync(INTERNAL_FILE, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)
    : [];

  const table = (rows) => [
    '| URL | Esito | Pagine |',
    '| --- | --- | --- |',
    ...rows.map((r) => {
      const shown = r.pages.slice(0, 5).map((p) => `\`${p}\``).join(', ') + (r.pages.length > 5 ? ` e altre ${r.pages.length - 5}` : '');
      return `| ${r.url.replace(/\|/g, '%7C')} | ${r.detail} | ${shown} |`;
    }),
  ];
  const md = [
    `# Link rotti — controllo del ${date}`,
    '',
    `Controllati ${urls.length} URL esterni presenti in ${pageCount} pagine: ${ok} raggiungibili, ${errors.length} da correggere, ${blocked.length} non verificabili.`,
    '',
    ...(internal.length ? ['## Link interni rotti', '', ...internal.map((l) => `- ${l}`), ''] : []),
    ...(errors.length ? ['## Link esterni da correggere', '', ...table(errors), ''] : []),
    ...(blocked.length
      ? ['## Siti che bloccano i controlli automatici', '', 'Risposte 401, 403, 429 o 999: non è detto che il link sia rotto. Da aprire a mano ogni tanto.', '', ...table(blocked), '']
      : []),
    'Le correzioni passano da una Pull Request ai record in `src/content/` o ai testi. Questa issue è aggiornata a ogni esecuzione del workflow `linkcheck`.',
    '',
  ].join('\n');

  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'report.md'), md);
  writeFileSync(join(OUT, 'report.json'), JSON.stringify({ date, checked: urls.length, pages: pageCount, ok, errors, blocked, internal }, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
  console.log(`\n${urls.length} URL: ${ok} ok, ${errors.length} errori, ${blocked.length} bloccati. Report in ${OUT}`);
  process.exit(errors.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
