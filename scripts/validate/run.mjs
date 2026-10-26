#!/usr/bin/env node
// npm run validate — controlli automatici del progetto.
//   node scripts/validate/run.mjs            contenuti + (se esiste dist/) output della build
//   node scripts/validate/run.mjs --content  solo contenuti sorgente
//   node scripts/validate/run.mjs --dist     solo output della build
// Esce con codice 1 se c'è almeno un errore. Gli avvisi non bloccano.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, basename, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execSync } from 'node:child_process';
import { parse as parseYaml } from 'yaml';
import { parse as parseHtml } from 'node-html-parser';
import { BLACKLIST, WARNLIST } from './blacklist.mjs';

const ROOT = new URL('../../', import.meta.url).pathname;
const args = new Set(process.argv.slice(2));
const doContent = !args.has('--dist');
const doDist = !args.has('--content') && existsSync(join(ROOT, 'dist'));
const SITE_MODE = process.env.PUBLIC_SITE_MODE === 'production' ? 'production' : 'beta';

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const rel = (p) => relative(ROOT, p);

function walk(dir, exts) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p, exts);
    return !exts || exts.includes(extname(d.name)) ? [p] : [];
  });
}

function readRecord(file) {
  const raw = readFileSync(file, 'utf8');
  if (file.endsWith('.json')) return { data: JSON.parse(raw), body: '' };
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('frontmatter mancante');
  return { data: parseYaml(m[1]), body: m[2] };
}

function checkCopy(where, text, { strict = true } = {}) {
  for (const [re, hint] of BLACKLIST) {
    const m = text.match(re);
    if (m) (strict ? err : warn)(where, `lista nera copy: "${m[0]}" (${hint})`);
  }
  for (const [re, hint] of WARNLIST) {
    const m = text.match(re);
    if (m) warn(where, `copy da controllare: "${m[0].trim()}" (${hint})`);
  }
}

// ---------------------------------------------------------------- contenuti
function validateContent() {
  // 1. Schemi Zod: astro sync fallisce se un record non è valido.
  try {
    execSync('npx astro sync', { cwd: ROOT, stdio: 'pipe', env: { ...process.env, USE_FIXTURES: '0' } });
  } catch (e) {
    err('astro sync', (e.stdout?.toString() + e.stderr?.toString()).split('\n').filter((l) => /error|invalid|expected/i.test(l)).slice(0, 20).join('\n') || 'schema non valido');
  }

  const today = new Date().toISOString().slice(0, 10);
  const collections = ['companies', 'events', 'articles', 'prompts'];
  const all = {};
  for (const c of collections) {
    const files = walk(join(ROOT, 'src/content', c), ['.json', '.md']);
    all[c] = [];
    const slugs = new Map();
    for (const f of files) {
      const where = rel(f);
      let rec;
      try { rec = readRecord(f); } catch (e) { err(where, `file non leggibile: ${e.message}`); continue; }
      const { data, body } = rec;
      all[c].push({ file: f, data, body });
      if (data.slug !== basename(f, extname(f))) err(where, `nome file diverso dallo slug "${data.slug}"`);
      if (slugs.has(data.slug)) err(where, `slug duplicato (anche in ${slugs.get(data.slug)})`);
      slugs.set(data.slug, where);
      const raw = JSON.stringify(data) + body;
      if (/esempio-|\[FITTIZIO\]|\.example\b/.test(raw)) err(where, 'contiene dati fittizi (fixture) nei contenuti reali');
      if (/\b[\w.+-]+@[\w-]+\.[\w.]+\b/.test(raw) && c !== 'prompts') err(where, 'contiene un indirizzo email: niente dati di contatto personali');
      // Gli URL contengono spesso ID numerici: si escludono dal controllo sui numeri di telefono.
      if (/(\+39[\s.]?)?\b3\d{2}[\s.]?\d{6,7}\b/.test(raw.replace(/https?:\/\/[^\s"')]+/g, ''))) err(where, 'sembra contenere un numero di cellulare');
      for (const k of ['last_verified', 'published_at', 'updated_at', 'tested_at']) {
        if (data[k] && String(data[k]).slice(0, 10) > today) err(where, `${k} nel futuro`);
      }
      // Testo pubblico per la lista nera
      const publicText = [data.name, data.title, data.description, data.answer, data.goal, data.how_to_use,
        data.expected_output_description, data.limits_and_warnings,
        ...(data.faq ?? []).flatMap((q) => [q.question, q.answer]), body].filter(Boolean).join('\n');
      checkCopy(where, publicText);
    }
  }

  for (const { file, data } of all.companies) {
    const where = rel(file);
    if (data.verification_status !== 'verified') warn(where, 'record non verified: non sarà pubblicato (spostalo in data/_pending/)');
    if (data.geo_precision === 'indirizzo' && !data.address) err(where, 'geo_precision "indirizzo" senza address');
  }
  // Serie (D-039): la pagina /eventi/<series>/ non deve collidere con lo slug di un altro evento o con una rotta fissa.
  const eventSlugs = new Set(all.events.map((e) => e.data.slug));
  const seriesNames = new Map();
  for (const { file, data } of all.events) {
    if (data.verification_status !== 'verified') warn(rel(file), 'evento non verified: non sarà pubblicato');
    if (!data.series) continue;
    if (eventSlugs.has(data.series)) err(rel(file), `series "${data.series}" uguale allo slug di un evento`);
    if (['provincia', 'pagina', 'archivio', 'prossimi'].includes(data.series)) err(rel(file), `series "${data.series}" è una rotta riservata`);
    const name = seriesNames.get(data.series);
    if (name && name !== data.series_name) err(rel(file), `series_name diverso dalle altre edizioni ("${name}")`);
    seriesNames.set(data.series, data.series_name);
  }
  for (const { file, data, body } of all.articles) {
    const where = rel(file);
    const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    if (words < 1600 || words > 2600) err(where, `lunghezza ${words} parole (richieste 1.600–2.600, guide v2)`);
    if (!/class="in-breve"/.test(body)) err(where, 'manca il box "In breve" (guide v2)');
    if ((data.faq ?? []).length < 6) err(where, 'FAQ: servono 6–8 domande (guide v2)');
    if (/—/.test(body)) err(where, 'trattino lungo nel testo (vietato dalla skill copywriter-umano)');
    if (!/class="in-pratica"/.test(body)) err(where, 'manca il box "In pratica"');
    if (!/\]\(\/prompt\//.test(body)) err(where, 'manca un link interno alla prompt library');
    if (!/\]\(\/(aziende|eventi)\//.test(body)) warn(where, 'nessun link interno a directory aziende o eventi');
    if (/^# /m.test(body)) err(where, 'H1 nel corpo: il titolo è già H1');
    if (/^#### /m.test(body) && !/^### /m.test(body)) err(where, 'salto di livello nei titoli');
    const ymyl = /ai-act|gdpr|incentiv|finanziament|bandi/.test(data.slug);
    if (ymyl && data.needs_human_review !== true && !data.reviewed_at) err(where, 'contenuto YMYL: needs_human_review deve essere true finché non approvato');
    for (const p of data.related_prompts ?? []) {
      if (!all.prompts.some((x) => x.data.slug === p)) err(where, `related_prompts: prompt "${p}" inesistente`);
    }
  }
  const perSector = {};
  for (const { file, data } of all.prompts) {
    const where = rel(file);
    perSector[data.sector] = (perSector[data.sector] ?? 0) + 1;
    const used = new Set([...(data.prompt_text ?? '').matchAll(/\{([a-z0-9_]+)\}/g)].map((m) => m[1]));
    const declared = new Set((data.variables ?? []).map((v) => v.name));
    for (const v of used) if (!declared.has(v)) err(where, `variabile {${v}} usata ma non descritta`);
    for (const v of declared) if (!used.has(v)) err(where, `variabile "${v}" descritta ma non usata nel prompt`);
  }
  if (all.prompts.length) {
    for (const [s, n] of Object.entries(perSector)) if (n !== 6) warn(`prompts/${s}`, `${n} prompt (attesi 6)`);
  }
  const pending = walk(join(ROOT, 'data/_pending'), ['.json']).length;
  console.log(`Contenuti: ${all.companies.length} aziende, ${all.events.length} eventi, ${all.articles.length} articoli, ${all.prompts.length} prompt, ${pending} record in _pending`);

  // Microcopy nei componenti e nelle pagine (solo testo visibile, controllo indicativo)
  for (const f of walk(join(ROOT, 'src'), ['.astro', '.tsx'])) {
    const text = readFileSync(f, 'utf8').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
    checkCopy(rel(f), text, { strict: true });
  }
}

// ---------------------------------------------------------------- build
function validateDist() {
  const DIST = join(ROOT, 'dist');
  const pages = walk(DIST, ['.html']).filter((f) => !f.includes('/pagefind/'));
  const titles = new Map();
  const descs = new Map();
  const linkedFrom = new Map();
  const exists = (path) => {
    const clean = decodeURIComponent(path.split('#')[0].split('?')[0]);
    if (!clean) return true;
    const p = join(DIST, clean);
    return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
  };
  const urlOf = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');

  for (const f of pages) {
    const url = urlOf(f);
    const where = `dist${url}`;
    const html = readFileSync(f, 'utf8');
    const doc = parseHtml(html);
    const is404 = url === '/404.html';

    const h1 = doc.querySelectorAll('h1');
    if (h1.length !== 1) err(where, `${h1.length} H1 (deve essercene uno)`);
    let prev = 1;
    for (const h of doc.querySelectorAll('main h2, main h3, main h4, main h5')) {
      const lvl = Number(h.tagName[1]);
      if (lvl > prev + 1) err(where, `salto di titolo H${prev} → H${lvl} ("${h.text.trim().slice(0, 40)}")`);
      prev = lvl;
    }

    const title = doc.querySelector('title')?.text.trim() ?? '';
    const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    if (!title) err(where, 'title mancante');
    else if (title.length > 60) err(where, `title di ${title.length} caratteri (max 60): "${title}"`);
    if (!desc) err(where, 'meta description mancante');
    else if (desc.length > 155) err(where, `meta description di ${desc.length} caratteri (max 155)`);
    if (!is404) {
      if (titles.has(title)) err(where, `title duplicato con ${titles.get(title)}`);
      if (descs.has(desc)) err(where, `meta description duplicata con ${descs.get(desc)}`);
      titles.set(title, where);
      descs.set(desc, where);
    }

    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    if (!is404) {
      if (!/^https:\/\//.test(canonical)) err(where, 'canonical assente o non assoluto');
      else if (canonical !== canonical.toLowerCase() || !canonical.endsWith('/') || canonical.includes('?')) err(where, `canonical non normalizzato: ${canonical}`);
    }
    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
    if (SITE_MODE === 'beta' && !/noindex/.test(robots)) err(where, 'in beta manca noindex');

    const ld = doc.querySelectorAll('script[type="application/ld+json"]');
    if (!is404) {
      if (ld.length !== 1) err(where, `${ld.length} blocchi JSON-LD (deve essere uno, con @graph)`);
      for (const s of ld) {
        try {
          const j = JSON.parse(s.text);
          if (!Array.isArray(j['@graph'])) err(where, 'JSON-LD senza @graph');
          const ids = (j['@graph'] ?? []).map((n) => n['@id']).filter(Boolean);
          const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
          if (dup.length) err(where, `@id duplicati nel grafo: ${[...new Set(dup)].join(', ')}`);
        } catch (e) { err(where, `JSON-LD non valido: ${e.message}`); }
      }
    }

    for (const img of doc.querySelectorAll('img')) {
      if (!img.hasAttribute('alt')) err(where, `img senza alt: ${img.getAttribute('src')}`);
      if (!img.getAttribute('width') || !img.getAttribute('height')) err(where, `img senza width/height: ${img.getAttribute('src')}`);
    }

    for (const a of doc.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(href)) continue;
      if (!href.startsWith('/')) { warn(where, `link relativo: ${href}`); continue; }
      if (!exists(href)) err(where, `link interno rotto: ${href}`);
      const target = href.split('#')[0].split('?')[0];
      if (target !== url) {
        if (!linkedFrom.has(target)) linkedFrom.set(target, new Set());
        linkedFrom.get(target).add(url);
      }
      const t = a.text.trim().toLowerCase();
      if (/^(clicca qui|qui|leggi di più|scopri di più|link)$/.test(t)) err(where, `anchor non descrittivo: "${a.text.trim()}"`);
    }

    // Budget: JS e CSS iniziali (gzip). Esclusi i chunk caricati solo su interazione (import dinamici).
    let js = 0, css = 0;
    for (const s of doc.querySelectorAll('script')) {
      const src = s.getAttribute('src');
      if (src && src.startsWith('/')) js += gz(join(DIST, src));
      else if (!src && s.getAttribute('type') !== 'application/ld+json') js += gzipSync(s.text).length;
    }
    for (const l of doc.querySelectorAll('link[rel="stylesheet"]')) css += gz(join(DIST, l.getAttribute('href')));
    for (const s of doc.querySelectorAll('style')) css += gzipSync(s.text).length;
    if (js > 30 * 1024) err(where, `JS iniziale ${(js / 1024).toFixed(1)} KB gzip (budget 30)`);
    if (css > 20 * 1024) err(where, `CSS ${(css / 1024).toFixed(1)} KB gzip (budget 20)`);

    const text = doc.querySelector('main')?.text ?? '';
    checkCopy(where, text, { strict: false });
    if (/\[DA COMPLETARE/.test(text) && !url.startsWith('/chi-siamo/') && !url.startsWith('/contatti/') && !url.startsWith('/note-legali/') && !url.startsWith('/privacy/') && !url.startsWith('/metodologia/') && !url.startsWith('/rimozione/') && !url.startsWith('/segnala/'))
      warn(where, 'segnaposto [DA COMPLETARE] fuori dalle pagine istituzionali');
  }

  for (const f of pages) {
    const url = urlOf(f);
    if (url === '/' || url === '/404.html') continue;
    if (!linkedFrom.has(url)) err(`dist${url}`, 'pagina orfana (nessun link interno in entrata)');
  }

  const robotsTxt = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
  if (!robotsTxt) err('dist/robots.txt', 'mancante');
  else if (SITE_MODE === 'beta' && !/Disallow:\s*\/\s*$/m.test(robotsTxt)) err('dist/robots.txt', 'in beta deve contenere Disallow: /');
  for (const f of ['llms.txt', 'llms-full.txt', '_headers']) if (!existsSync(join(DIST, f))) err(`dist/${f}`, 'mancante');
  console.log(`Build: ${pages.length} pagine HTML controllate (modalità ${SITE_MODE})`);
}

function gz(p) {
  try { return gzipSync(readFileSync(p)).length; } catch { return 0; }
}

if (doContent) validateContent();
if (doDist) validateDist();
else if (!args.has('--content')) console.log('dist/ assente: salto i controlli sulla build (esegui npm run build).');

for (const w of warnings) console.log(`AVVISO  ${w}`);
for (const e of errors) console.log(`ERRORE  ${e}`);
console.log(`\n${errors.length} errori, ${warnings.length} avvisi`);
process.exit(errors.length ? 1 : 0);
