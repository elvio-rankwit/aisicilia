// QA punto 9: applica la lista nera (scripts/validate/blacklist.mjs) al testo visibile di ogni pagina di una build,
// a llms*.txt, ai feed RSS e ai sorgenti degli articoli. Uso: node docs/qa/blacklist-dist.mjs <dist-dir>
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import { BLACKLIST, WARNLIST } from '../../scripts/validate/blacklist.mjs';
const dist = process.argv[2];
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === 'pagefind' ? [] : walk(join(d, e.name))) : [join(d, e.name)]));
const hits = new Map(); const warns = new Map();
const scan = (file, text) => {
  for (const [re, why] of BLACKLIST) { const m = text.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')); if (m) hits.set(`${file} | ${why} | ${re}`, [...new Set(m)].slice(0, 3)); }
  for (const [re, why] of WARNLIST) { const m = text.match(new RegExp(re.source, re.flags.replace('g', '') + 'g')); if (m) warns.set(`${file} | ${why}`, m.length); }
};
for (const f of walk(dist)) {
  const rel = f.slice(dist.length);
  if (f.endsWith('.html')) {
    const root = parse(readFileSync(f, 'utf8'));
    root.querySelectorAll('script,style,noscript').forEach((n) => n.remove());
    const metas = root.querySelectorAll('meta[name=description],meta[property="og:description"],title').map((n) => n.getAttribute('content') || n.text).join(' \n ');
    scan(rel, root.textContent + ' \n ' + metas);
  } else if (/\.(txt|xml)$/.test(f) && !/sitemap/.test(f)) scan(rel, readFileSync(f, 'utf8'));
}
console.log('HITS', hits.size); for (const [k, v] of hits) console.log(k, JSON.stringify(v));
console.log('WARN', warns.size); for (const [k, v] of warns) console.log(k, v);
