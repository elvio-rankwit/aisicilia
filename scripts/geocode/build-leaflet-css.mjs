#!/usr/bin/env node
// Genera src/components/map/leaflet-lite.css: il CSS di Leaflet senza le parti che non usiamo
// (selettore dei livelli, tooltip, IE vecchio, icona di default). Le tre immagini PNG del CSS originale
// verrebbero incorporate come base64 (circa 3 KB gzip in più) pur non servendo a niente.
//   node scripts/geocode/build-leaflet-css.mjs        (rilanciare se si aggiorna leaflet)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = readFileSync(join(ROOT, 'node_modules/leaflet/dist/leaflet.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const DROP = /control-layers|default-icon-path|\.lvml|oldie|tooltip/;

const out = [];
let depth = 0, start = 0;
for (let i = 0; i < src.length; i++) {
  const c = src[i];
  if (c === '{') depth++;
  else if (c === '}' && --depth === 0) {
    const block = src.slice(start, i + 1).trim(); start = i + 1;
    const selector = block.slice(0, block.indexOf('{'));
    if (!DROP.test(selector) && !/url\(images\//.test(block)) out.push(block);
  }
}
const css = out.join('\n').replace(/\s+/g, ' ');
const header = '/* GENERATO da scripts/geocode/build-leaflet-css.mjs a partire da leaflet/dist/leaflet.css (BSD-2-Clause, (c) Vladimir Agafonkin, Cloudmade). Non modificare. */\n';
writeFileSync(join(ROOT, 'src/components/map/leaflet-lite.css'), header + css + '\n');
console.log(`leaflet-lite.css: ${css.length} B (originale ${src.length} B)`);
