#!/usr/bin/env node
// Controllo e geocoding in blocco di aziende ed eventi.
//
//   node scripts/geocode/batch.mjs                    segnala i record con coordinate mancanti o incoerenti
//   node scripts/geocode/batch.mjs --write            geocodifica i record segnalati e aggiorna i file
//   node scripts/geocode/batch.mjs --only=events      solo eventi (oppure --only=companies)
//
// Esce con 1 se in modalità di controllo trova problemi (utile in CI), con 0 altrimenti.
//
// Cosa controlla:
//  - lat/lng assenti o fuori dal riquadro della Sicilia (per gli eventi solo se in presenza o ibridi);
//  - aziende: `geo_precision` assente, non valida, oppure "indirizzo" senza `address` (incoerente);
//  - avvisi (non bloccanti): "città" con `address` presente (si può riprovare), coordinate fuori dalla
//    provincia dichiarata (con 2 km di tolleranza sulla costa semplificata).
// Con --write geocodifica `address` (aziende) o `venue_address` (eventi), con fallback al centro del comune.
// Modifica SOLO lat, lng e geo_precision (quest'ultimo solo nelle aziende, o negli eventi che già lo hanno):
// il testo del file resta identico altrove. Il rate limit (1 richiesta/secondo, cache) è gestito da geocode.mjs.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const CONTENT_ROOT = process.env.BATCH_CONTENT_ROOT || ROOT; // solo per i test: cartella con src/content/…
const GEOCODE = join(HERE, 'geocode.mjs');
const SICILY = { minLat: 35.4, maxLat: 38.9, minLng: 11.9, maxLng: 15.7 };
const PRECISIONS = new Set(['indirizzo', 'città']);

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const only = (args.find((a) => a.startsWith('--only=')) ?? '').slice(7);
const kinds = [
  { name: 'companies', dir: 'src/content/companies', addrKey: 'address', hasPrecision: true },
  { name: 'events', dir: 'src/content/events', addrKey: 'venue_address', hasPrecision: false },
].filter((k) => !only || k.name === only);

// ---------- province (per l'avviso di coerenza) ----------
const GEO = join(ROOT, 'public/geo/sicilia-province.min.geojson');
const provinceShapes = existsSync(GEO)
  ? Object.fromEntries(JSON.parse(readFileSync(GEO, 'utf8')).features.map((f) => [f.properties.slug, f.geometry.coordinates]))
  : null;
function inRing(ring, lng, lat) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function distToRing(ring, lng, lat) {
  let m = Infinity;
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[i + 1];
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    const t = L2 === 0 ? 0 : Math.max(0, Math.min(1, ((lng - ax) * dx + (lat - ay) * dy) / L2));
    m = Math.min(m, Math.hypot((lng - (ax + t * dx)) * 0.8, lat - (ay + t * dy)));
  }
  return m;
}
function inProvince(slug, lat, lng) {
  const polys = provinceShapes?.[slug];
  if (!polys) return true; // nessun dato: non segnalo
  const TOL = 0.02; // gradi, circa 2 km
  return polys.some((poly) => (inRing(poly[0], lng, lat) && !poly.slice(1).some((h) => inRing(h, lng, lat))) || distToRing(poly[0], lng, lat) < TOL);
}

// ---------- controlli ----------
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
function check(kind, rec) {
  const problems = [], notes = [];
  const needsCoords = kind.name === 'companies' || rec.format !== 'online';
  const hasCoords = isNum(rec.lat) && isNum(rec.lng);
  if (needsCoords && !hasCoords) problems.push('lat/lng mancanti');
  if (hasCoords && (rec.lat < SICILY.minLat || rec.lat > SICILY.maxLat || rec.lng < SICILY.minLng || rec.lng > SICILY.maxLng)) problems.push('coordinate fuori dalla Sicilia');
  if (kind.name === 'companies') {
    if (!PRECISIONS.has(rec.geo_precision)) problems.push(`geo_precision assente o non valido (${JSON.stringify(rec.geo_precision)})`);
    else if (rec.geo_precision === 'indirizzo' && !rec.address) problems.push('geo_precision "indirizzo" ma address assente');
    else if (rec.geo_precision === 'città' && rec.address) notes.push('geo_precision "città" ma address presente: si può riprovare con --write');
  } else if ('geo_precision' in rec && !PRECISIONS.has(rec.geo_precision)) problems.push(`geo_precision non valido (${JSON.stringify(rec.geo_precision)})`);
  if (hasCoords && rec.province && !problems.some((p) => p.includes('fuori')) && !inProvince(rec.province, rec.lat, rec.lng)) notes.push(`coordinate fuori dalla provincia dichiarata (${rec.province})`);
  return { problems, notes };
}

// ---------- geocoding (delega a geocode.mjs: cache e rate limit condivisi) ----------
function geocode(argv) {
  try {
    return JSON.parse(execFileSync('node', [GEOCODE, ...argv], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  } catch { return null; }
}
function resolve(kind, rec) {
  const addr = rec[kind.addrKey];
  if (addr) {
    const q = rec.city && !addr.toLowerCase().includes(rec.city.toLowerCase()) ? `${addr}, ${rec.city}` : addr;
    const hit = geocode([q]);
    if (hit) return hit;
  }
  return geocode(['--city', rec.city]);
}

// ---------- modifica chirurgica del testo JSON ----------
const NUM = String.raw`-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?`;
function setField(text, key, literal, afterKey) {
  const re = new RegExp(String.raw`("${key}"\s*:\s*)(?:${NUM}|null|"[^"]*")`);
  if (re.test(text)) return text.replace(re, (_, p) => `${p}${literal}`);
  // chiave assente: la inserisco dopo `afterKey` (o dopo "city")
  const line = new RegExp(String.raw`^([ \t]*)"${afterKey}"\s*:\s*(?:"(?:[^"\\]|\\.)*"|${NUM}|null)(,?)[ \t]*$`, 'm');
  const m = text.match(line);
  if (!m) return null;
  const [whole, indent, comma] = m;
  const prefix = comma ? whole : `${whole},`;
  return text.replace(whole, `${prefix}\n${indent}"${key}": ${literal}${comma ? ',' : ''}`);
}
function apply(text, hit, kind, rec) {
  let t = setField(text, 'lat', String(hit.lat), 'city');
  if (t) t = setField(t, 'lng', String(hit.lng), 'lat');
  if (t && (kind.hasPrecision || 'geo_precision' in rec)) t = setField(t, 'geo_precision', JSON.stringify(hit.precision), 'lng');
  return t;
}

// ---------- esecuzione ----------
let flagged = 0, fixed = 0, failed = 0, noted = 0, total = 0;
for (const kind of kinds) {
  const dir = join(CONTENT_ROOT, kind.dir);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const path = join(dir, file);
    const text = readFileSync(path, 'utf8');
    let rec;
    try { rec = JSON.parse(text); } catch (e) { console.log(`ERRORE  ${kind.name}/${file}: JSON non valido (${e.message})`); failed++; continue; }
    total++;
    const { problems, notes } = check(kind, rec);
    for (const n of notes) { console.log(`avviso  ${kind.name}/${file}: ${n}`); noted++; }
    if (!problems.length) continue;
    flagged++;
    console.log(`DA FARE ${kind.name}/${file}: ${problems.join('; ')}`);
    if (!WRITE) continue;
    if (!rec.city) { console.log('        salto: manca city'); failed++; continue; }
    const hit = resolve(kind, rec);
    if (!hit) { console.log('        geocoding non riuscito: lascio il file com\'è'); failed++; continue; }
    const next = apply(text, hit, kind, rec);
    let ok = false;
    if (next) {
      try {
        const a = JSON.parse(next);
        const strip = (o) => { const c = { ...o }; delete c.lat; delete c.lng; delete c.geo_precision; return JSON.stringify(c); };
        ok = strip(a) === strip(rec) && a.lat === hit.lat && a.lng === hit.lng;
      } catch { ok = false; }
    }
    if (!ok) { console.log('        non riesco a modificare il file senza toccare altri campi: lascio com\'è'); failed++; continue; }
    writeFileSync(path, next);
    fixed++;
    console.log(`        scritto: ${hit.lat}, ${hit.lng} (${hit.precision})`);
  }
}
console.log(`\n${total} record controllati: ${flagged} da sistemare, ${noted} avvisi${WRITE ? `, ${fixed} aggiornati, ${failed} falliti` : ''}.`);
if (!WRITE && flagged) console.log('Rilancia con --write per geocodificarli (1 richiesta al secondo).');
process.exit(WRITE ? (failed ? 1 : 0) : flagged ? 1 : 0);
