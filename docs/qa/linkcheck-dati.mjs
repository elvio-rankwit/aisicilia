#!/usr/bin/env node
// QA punto 3: controlla i link esterni presenti nei DATI (src/content) e nel corpo degli articoli,
// compresi gli articoli YMYL esclusi dalla build. Usa curl (rispetta HTTPS_PROXY e il bundle CA).
// Max 1 richiesta al secondo per dominio; domini diversi in parallelo.
// Uso: node docs/qa/linkcheck-dati.mjs [out.json]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
const run = promisify(execFile);
const ROOT = new URL('../../src/content/', import.meta.url).pathname;
const OUT = process.argv[2] || new URL('./linkcheck-dati.json', import.meta.url).pathname;
const UA = 'aisicilia-linkcheck/1.0 (+https://aisicilia.it/contatti/; verifica periodica dei link pubblicati)';
const found = new Map(); // url -> Set(origini)
const add = (u, where) => { if (!/^https?:\/\//.test(u)) return; u = u.replace(/[)\].,;]+$/, '').replace(/#.*$/, ''); (found.get(u) ?? found.set(u, new Set()).get(u)).add(where); };
for (const col of ['companies', 'events', 'prompts']) {
  for (const f of readdirSync(join(ROOT, col)).filter((f) => f.endsWith('.json'))) {
    const d = JSON.parse(readFileSync(join(ROOT, col, f), 'utf8'));
    const walk = (v, k) => { if (typeof v === 'string' && /^https?:\/\//.test(v)) add(v, `${col}/${f}#${k}`); else if (Array.isArray(v)) v.forEach((x) => walk(x, k)); else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, x]) => walk(x, kk)); };
    Object.entries(d).forEach(([k, v]) => walk(v, k));
  }
}
for (const f of readdirSync(join(ROOT, 'articles')).filter((f) => f.endsWith('.md'))) {
  const t = readFileSync(join(ROOT, 'articles', f), 'utf8');
  const [, fm, body] = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  for (const m of fm.matchAll(/url:\s*(https?:\/\/\S+)/g)) add(m[1], `articles/${f}#sources`);
  for (const m of body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) add(m[1], `articles/${f}#corpo`);
  for (const m of body.matchAll(/(?<![(\[])\bhttps?:\/\/[^\s)<>\]]+/g)) add(m[0], `articles/${f}#corpo-nudo`);
}
async function req(url, method) {
  const args = ['-s', '-o', '/dev/null', '-L', '-m', '20', '--max-redirs', '8', '-A', UA, '-w', '%{http_code}|%{url_effective}|%{num_redirects}', '-H', 'Accept: text/html,application/xhtml+xml,application/pdf,*/*;q=0.8'];
  if (method === 'HEAD') args.push('-I');
  args.push(url);
  try { const { stdout } = await run('curl', args, { timeout: 30000 }); const [code, eff, n] = stdout.split('|'); return { status: Number(code), final: eff, redirects: Number(n) }; }
  catch (e) { return { status: 0, error: e.code === 28 || /timed out/.test(e.message) ? 'timeout' : `curl exit ${e.code}` }; }
}
const byHost = new Map();
for (const u of found.keys()) { const h = new URL(u).host; (byHost.get(h) ?? byHost.set(h, []).get(h)).push(u); }
const results = [];
const hosts = [...byHost.keys()];
const worker = async () => {
  for (let h; (h = hosts.shift()); ) {
    for (const url of byHost.get(h)) {
      let r = await req(url, 'HEAD'); await sleep(1000);
      if (r.status === 0 || r.status >= 400) { r = await req(url, 'GET'); await sleep(1000); }
      if (r.status === 0 || r.status >= 500) { await sleep(4000); r = await req(url, 'GET'); await sleep(1000); }
      results.push({ url, ...r, where: [...found.get(url)] });
    }
  }
};
await Promise.all(Array.from({ length: 12 }, worker));
results.sort((a, b) => a.url.localeCompare(b.url));
writeFileSync(OUT, JSON.stringify(results, null, 1));
const cls = (r) => (r.status >= 200 && r.status < 300 ? 'ok' : [401, 403, 429, 999].includes(r.status) ? 'bloccato' : 'rotto');
const tally = {}; results.forEach((r) => { const c = cls(r); tally[c] = (tally[c] || 0) + 1; });
console.log(results.length, 'URL', JSON.stringify(tally));
