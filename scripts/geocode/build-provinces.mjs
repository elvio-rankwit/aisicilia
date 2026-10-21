#!/usr/bin/env node
// Costruisce i confini provinciali della Sicilia per il sito, a partire dai confini amministrativi ISTAT.
//
//   node scripts/geocode/build-provinces.mjs            (usa scripts/geocode/raw/, lo scarica se manca)
//   node scripts/geocode/build-provinces.mjs --eps 0.4  (tolleranza di semplificazione, unità SVG)
//
// Fonte: ISTAT, "Confini delle unità amministrative a fini statistici", unità territoriali sovracomunali
// (ProvCM), versione generalizzata al 01/01/2025, licenza CC BY 4.0.
//   https://www.istat.it/notizia/confini-delle-unita-amministrative-a-fini-statistici-al-1-gennaio-2018-2/
// Il file è in UTM 32N (WGS84): lo script legge lo shapefile e lo converte in latitudine/longitudine.
//
// Produce:
//   src/components/map/provinces-paths.ts   VIEWBOX, PROVINCE_PATHS, project(lat, lng)
//   src/components/map/province-bounds.ts   PROVINCE_BOUNDS, SICILY_BOUNDS (per fitBounds in Leaflet)
//   public/geo/sicilia-province.min.geojson contorni semplificati, 4 decimali
//
// La semplificazione (Douglas-Peucker) è fatta per tratti: i confini condivisi tra due province si
// semplificano una volta sola con gli stessi estremi, quindi non nascono sovrapposizioni né buchi.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const RAW = join(HERE, 'raw');
const ZIP_URL = 'https://www.istat.it/storage/cartografia/confini_amministrativi/generalizzati/2025/Limiti01012025_g.zip';
const ZIP = join(RAW, 'istat-2025-g.zip');
const SHP_DIR = join(RAW, 'ProvCM01012025_g');
const SHP = join(SHP_DIR, 'ProvCM01012025_g_WGS84.shp');
const DBF = join(SHP_DIR, 'ProvCM01012025_g_WGS84.dbf');

const argv = process.argv.slice(2);
const argVal = (name, def) => { const i = argv.indexOf(name); return i >= 0 ? Number(argv[i + 1]) : def; };
const EPS = argVal('--eps', 0.45);          // tolleranza sulle coste, in unità del viewBox
const EPS_ISLAND = argVal('--eps-island', 0.2);
const MIN_AREA = argVal('--min-area', 0.8); // sotto questa area (unità²) un anello viene scartato
const EPS_GEO = argVal('--eps-geo', 1.1);     // tolleranza del GeoJSON per Leaflet (più grossolana)
const MIN_AREA_GEO = argVal('--min-area-geo', 3);
const SVG_MIN_LAT = argVal('--svg-min-lat', 36.4); // a sud di questa latitudine (Pelagie) l'anteprima SVG non disegna: sarebbe 30% di spazio vuoto
const SCALE = 130;                           // unità SVG per grado di latitudine
const PAD = 4;

const SLUG_BY_SIGLA = {
  AG: 'agrigento', CL: 'caltanissetta', CT: 'catania', EN: 'enna', ME: 'messina',
  PA: 'palermo', RG: 'ragusa', SR: 'siracusa', TP: 'trapani',
};

// ---------- download ----------
if (!existsSync(SHP)) {
  mkdirSync(RAW, { recursive: true });
  if (!existsSync(ZIP)) {
    console.log(`Scarico ${ZIP_URL}`);
    const res = await fetch(ZIP_URL);
    if (!res.ok) throw new Error(`Download ISTAT fallito: HTTP ${res.status}`);
    writeFileSync(ZIP, Buffer.from(await res.arrayBuffer()));
  }
  execFileSync('unzip', ['-o', '-q', ZIP, 'ProvCM01012025_g/*', '-d', RAW]);
}

// ---------- lettura shapefile (poligoni) e dbf ----------
function readDbf(path) {
  const d = readFileSync(path);
  const n = d.readUInt32LE(4), headerLen = d.readUInt16LE(8), recLen = d.readUInt16LE(10);
  const fields = [];
  for (let p = 32; d[p] !== 0x0d; p += 32) fields.push({ name: d.subarray(p, p + 11).toString('latin1').replace(/\0.*$/, ''), len: d[p + 16] });
  const rows = [];
  for (let i = 0; i < n; i++) {
    let o = headerLen + i * recLen + 1; const row = {};
    for (const f of fields) { row[f.name] = d.subarray(o, o + f.len).toString('latin1').trim(); o += f.len; }
    rows.push(row);
  }
  return rows;
}

function readShp(path) {
  const b = readFileSync(path);
  const out = [];
  let p = 100;
  while (p + 8 <= b.length) {
    const len = b.readInt32BE(p + 4) * 2; p += 8;
    const type = b.readInt32LE(p);
    if (type === 0) { out.push([]); p += len; continue; }
    if (type !== 5 && type !== 15) throw new Error(`Tipo shape non gestito: ${type}`);
    const nParts = b.readInt32LE(p + 36), nPts = b.readInt32LE(p + 40);
    const parts = []; for (let i = 0; i < nParts; i++) parts.push(b.readInt32LE(p + 44 + i * 4));
    const ptsAt = p + 44 + nParts * 4;
    const rings = [];
    for (let i = 0; i < nParts; i++) {
      const from = parts[i], to = i + 1 < nParts ? parts[i + 1] : nPts;
      const ring = [];
      for (let k = from; k < to; k++) ring.push([b.readDoubleLE(ptsAt + k * 16), b.readDoubleLE(ptsAt + k * 16 + 8)]);
      rings.push(ring);
    }
    out.push(rings); p += len;
  }
  return out;
}

// ---------- UTM 32N (WGS84) -> lat/lng (serie di Krüger) ----------
const A = 6378137, F = 1 / 298.257223563, K0 = 0.9996, LON0 = (9 * Math.PI) / 180;
const N = F / (2 - F);
const A_ = (A / (1 + N)) * (1 + N ** 2 / 4 + N ** 4 / 64);
const BETA = [
  N / 2 - (2 / 3) * N ** 2 + (37 / 96) * N ** 3,
  N ** 2 / 48 + N ** 3 / 15,
  (17 / 480) * N ** 3,
];
const DELTA = [
  2 * N - (2 / 3) * N ** 2 - 2 * N ** 3,
  (7 / 3) * N ** 2 - (8 / 5) * N ** 3,
  (56 / 15) * N ** 3,
];
function utmToLatLng(E, Nn) {
  const xi = Nn / (K0 * A_), eta = (E - 500000) / (K0 * A_);
  let xiP = xi, etaP = eta;
  for (let j = 1; j <= 3; j++) {
    xiP -= BETA[j - 1] * Math.sin(2 * j * xi) * Math.cosh(2 * j * eta);
    etaP -= BETA[j - 1] * Math.cos(2 * j * xi) * Math.sinh(2 * j * eta);
  }
  const chi = Math.asin(Math.sin(xiP) / Math.cosh(etaP));
  let lat = chi;
  for (let j = 1; j <= 3; j++) lat += DELTA[j - 1] * Math.sin(2 * j * chi);
  const lng = LON0 + Math.atan2(Math.sinh(etaP), Math.cos(xiP));
  return [(lat * 180) / Math.PI, (lng * 180) / Math.PI];
}

// ---------- selezione della Sicilia ----------
const dbf = readDbf(DBF);
const shapes = readShp(SHP);
if (dbf.length !== shapes.length) throw new Error('dbf e shp non allineati');
const provs = [];
dbf.forEach((r, i) => {
  if (r.COD_REG !== '19') return;
  const slug = SLUG_BY_SIGLA[r.SIGLA];
  if (!slug) throw new Error(`Sigla sconosciuta: ${r.SIGLA}`);
  provs.push({ slug, name: r.DEN_UTS, rings: shapes[i] });
});
if (provs.length !== 9) throw new Error(`Attese 9 unità per la regione 19, trovate ${provs.length}`);

// Mappa vertice (coordinate UTM originali) -> province che lo contengono.
const owners = new Map();
provs.forEach((pr, pi) => pr.rings.forEach((ring) => ring.forEach(([x, y]) => {
  const k = `${x},${y}`; let s = owners.get(k); if (!s) owners.set(k, (s = new Set())); s.add(pi);
})));

// Anelli: tolgo il vertice di chiusura, converto in lat/lng e proietto.
const lats = [], lngs = [];
for (const pr of provs) {
  pr.rings = pr.rings.map((ring) => {
    const pts = ring.slice(0, -1).map(([x, y]) => {
      const [lat, lng] = utmToLatLng(x, y);
      return { lat, lng, key: [...owners.get(`${x},${y}`)].sort().join('-') };
    });
    pts.south = pts.every((v) => v.lat < SVG_MIN_LAT);
    if (!pts.south) for (const v of pts) { lats.push(v.lat); lngs.push(v.lng); }
    return pts;
  });
}
const LAT_MAX = Math.max(...lats), LAT_MIN = Math.min(...lats);
const LNG_MIN = Math.min(...lngs), LNG_MAX = Math.max(...lngs);
const COS = Math.cos((((LAT_MAX + LAT_MIN) / 2) * Math.PI) / 180);
const proj = (lat, lng) => [(lng - LNG_MIN) * COS * SCALE + PAD, (LAT_MAX - lat) * SCALE + PAD];
const W = Math.round(((LNG_MAX - LNG_MIN) * COS * SCALE + 2 * PAD) * 10) / 10;
const H = Math.round(((LAT_MAX - LAT_MIN) * SCALE + 2 * PAD) * 10) / 10;

for (const pr of provs) for (const ring of pr.rings) for (const v of ring) [v.x, v.y] = proj(v.lat, v.lng);

// ---------- geometria ----------
const signedArea = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p.x * q.y - q.x * p.y; } return a / 2; };

function dp(pts, eps) { // pts: array aperto con estremi fissi; restituisce i punti tenuti
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, z] = stack.pop(); let best = -1, bi = -1;
    const A1 = pts[a], B1 = pts[z]; const dx = B1.x - A1.x, dy = B1.y - A1.y, L2 = dx * dx + dy * dy;
    for (let i = a + 1; i < z; i++) {
      const p = pts[i]; let d;
      if (L2 === 0) d = Math.hypot(p.x - A1.x, p.y - A1.y);
      else { const t = Math.max(0, Math.min(1, ((p.x - A1.x) * dx + (p.y - A1.y) * dy) / L2)); d = Math.hypot(p.x - (A1.x + t * dx), p.y - (A1.y + t * dy)); }
      if (d > best) { best = d; bi = i; }
    }
    if (best > eps) { keep[bi] = 1; stack.push([a, bi], [bi, z]); }
  }
  return pts.filter((_, i) => keep[i]);
}

function simplifyRing(ring, eps) {
  const n = ring.length;
  const brk = [];
  for (let i = 0; i < n; i++) if (ring[i].key !== ring[(i + n - 1) % n].key || ring[i].key !== ring[(i + 1) % n].key) brk.push(i);
  if (brk.length === 0) { // anello senza confini condivisi: ancoro il vertice 0 e il più lontano
    let far = 0, fd = -1;
    for (let i = 1; i < n; i++) { const d = Math.hypot(ring[i].x - ring[0].x, ring[i].y - ring[0].y); if (d > fd) { fd = d; far = i; } }
    const h1 = dp(ring.slice(0, far + 1), eps);
    const h2 = dp([...ring.slice(far), ring[0]], eps);
    return [...h1.slice(0, -1), ...h2.slice(0, -1)];
  }
  const out = [];
  for (let b = 0; b < brk.length; b++) {
    const from = brk[b], to = brk[(b + 1) % brk.length];
    const arc = [];
    for (let i = from; ; i = (i + 1) % n) { arc.push(ring[i]); if (i === to && arc.length > 1) break; if (arc.length > n + 1) break; }
    const s = dp(arc, eps);
    out.push(...s.slice(0, -1));
  }
  return out;
}

function simplifyAll(eps, epsIsland, minArea, skipSouth) {
  const result = [];
  for (const pr of provs) {
    const rings = pr.rings.map((r) => ({ pts: r, area: signedArea(r) }));
    const biggest = Math.max(...rings.map((r) => Math.abs(r.area)));
    const outerSign = Math.sign(rings.find((r) => Math.abs(r.area) === biggest).area);
    const kept = [];
    let dropped = 0;
    for (const r of rings) {
      if (skipSouth && r.pts.south) { dropped++; continue; }
      const isHole = Math.sign(r.area) !== outerSign;
      const isMain = Math.abs(r.area) === biggest;
      const simp = simplifyRing(r.pts, isMain ? eps : epsIsland);
      const a = Math.abs(signedArea(simp));
      if (simp.length < 3 || a < minArea) { dropped++; continue; }
      kept.push({ pts: simp, hole: isHole, main: isMain, area: a });
    }
    result.push({ slug: pr.slug, name: pr.name, rings: kept, dropped });
  }
  return result.sort((a, b) => a.slug.localeCompare(b.slug));
}
const result = simplifyAll(EPS, EPS_ISLAND, MIN_AREA, true);
const resultGeo = simplifyAll(EPS_GEO, EPS_GEO / 2, MIN_AREA_GEO, false);

// ---------- etichette: punto più interno dell'anello principale (ricerca a griglia) ----------
function insideRing(pts, x, y) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a.y > y) !== (b.y > y) && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}
function distToRing(pts, x, y) {
  let m = Infinity;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]; const dx = b.x - a.x, dy = b.y - a.y, L2 = dx * dx + dy * dy;
    const t = L2 === 0 ? 0 : Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / L2));
    m = Math.min(m, Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy)));
  }
  return m;
}
function labelPoint(pts) {
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  let best = { d: -1, x: 0, y: 0 };
  for (let x = Math.min(...xs); x <= Math.max(...xs); x += 1) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 1) {
    if (!insideRing(pts, x, y)) continue; const d = distToRing(pts, x, y);
    if (d > best.d) best = { d, x, y };
  }
  return best;
}

// ---------- serializzazione ----------
const r1 = (v) => Math.round(v * 10) / 10;
const fmt = (v) => { let s = r1(v).toFixed(1); if (s.endsWith('.0')) s = s.slice(0, -2); if (s.startsWith('0.')) s = s.slice(1); else if (s.startsWith('-0.')) s = '-' + s.slice(2); return s === '-0' ? '0' : s; };
function ringPath(pts) {
  const q = pts.map((p) => [r1(p.x), r1(p.y)]);
  let d = `M${fmt(q[0][0])} ${fmt(q[0][1])}l`;
  let prev = null, prevX = q[0][0], prevY = q[0][1];
  for (let i = 1; i < q.length; i++) {
    const dx = q[i][0] - prevX, dy = q[i][1] - prevY; prevX = q[i][0]; prevY = q[i][1];
    if (dx === 0 && dy === 0) continue;
    const a = fmt(dx), b = fmt(dy);
    const piece = (prev === null ? '' : (a.startsWith('-') ? '' : ' ')) + a + (b.startsWith('-') ? '' : ' ') + b;
    d += piece; prev = piece;
  }
  return d + 'z';
}

const paths = {}; const geo = { type: 'FeatureCollection', features: [] }; const bounds = {};
let allB = null;
const expand = (b, v) => b ? [[Math.min(b[0][0], v.lat), Math.min(b[0][1], v.lng)], [Math.max(b[1][0], v.lat), Math.max(b[1][1], v.lng)]] : [[v.lat, v.lng], [v.lat, v.lng]];
for (const pr of result) {
  const main = pr.rings.find((r) => r.main);
  const lp = labelPoint(main.pts);
  paths[pr.slug] = { d: pr.rings.map((r) => ringPath(r.pts)).join(''), labelX: r1(lp.x), labelY: r1(lp.y) };
  let b = null; for (const v of main.pts) b = expand(b, v);
  const rd = (n) => Math.round(n * 1e4) / 1e4;
  bounds[pr.slug] = [[rd(b[0][0]), rd(b[0][1])], [rd(b[1][0]), rd(b[1][1])]];
  for (const v of main.pts) allB = expand(allB, v);
}
for (const pr of resultGeo) {
  // GeoJSON: un poligono per ogni anello esterno, con i buchi che gli appartengono (qui: ordine di area).
  const outers = pr.rings.filter((r) => !r.hole), holes = pr.rings.filter((r) => r.hole);
  const toLL = (pts, cw) => { const c = pts.map((v) => [Math.round(v.lng * 1e4) / 1e4, Math.round(v.lat * 1e4) / 1e4]); c.push(c[0]); return cw ? c : c.reverse(); };
  const polys = outers.map((o) => {
    // GeoJSON (RFC 7946): esterno antiorario, buchi orari. In coordinate (lng,lat) y verso l'alto.
    const ll = toLL(o.pts, true);
    const area = ll.reduce((s, p, i) => i ? s + (ll[i - 1][0] * p[1] - p[0] * ll[i - 1][1]) : s, 0) / 2;
    const ext = area > 0 ? ll : ll.reverse();
    const inside = holes.filter((h) => insideRing(o.pts, h.pts[0].x, h.pts[0].y)).map((h) => {
      const hl = toLL(h.pts, true);
      const ha = hl.reduce((s, p, i) => i ? s + (hl[i - 1][0] * p[1] - p[0] * hl[i - 1][1]) : s, 0) / 2;
      return ha < 0 ? hl : hl.reverse();
    });
    return [ext, ...inside];
  });
  geo.features.push({ type: 'Feature', properties: { slug: pr.slug, name: pr.name }, geometry: { type: 'MultiPolygon', coordinates: polys } });
}
const sicilyB = (() => { const rd = (n) => Math.round(n * 1e4) / 1e4; return [[rd(allB[0][0]), rd(allB[0][1])], [rd(allB[1][0]), rd(allB[1][1])]]; })();

const header = '// FILE GENERATO da scripts/geocode/build-provinces.mjs: non modificare a mano.\n// Fonte: ISTAT, confini amministrativi generalizzati al 01/01/2025, licenza CC BY 4.0.\n';
const mapDir = join(ROOT, 'src/components/map');
mkdirSync(mapDir, { recursive: true });
mkdirSync(join(ROOT, 'public/geo'), { recursive: true });

const pathsTs = `${header}import type { ProvinceSlug } from '../../lib/provinces';

export const VIEWBOX = '0 0 ${W} ${H}';
export const VIEWBOX_W = ${W};
export const VIEWBOX_H = ${H};

export const PROVINCE_PATHS: Record<ProvinceSlug, { d: string; labelX: number; labelY: number }> = ${JSON.stringify(paths, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'")};

const LAT_MAX = ${LAT_MAX.toFixed(5)};
const LNG_MIN = ${LNG_MIN.toFixed(5)};
const COS_LAT = ${COS.toFixed(6)};
const SCALE = ${SCALE};
const PAD = ${PAD};

/** Proietta una coordinata nello stesso piano dei path (equirettangolare con coseno della latitudine media). */
export function project(lat: number, lng: number): [x: number, y: number] {
  return [
    Math.round(((lng - LNG_MIN) * COS_LAT * SCALE + PAD) * 10) / 10,
    Math.round(((LAT_MAX - lat) * SCALE + PAD) * 10) / 10,
  ];
}
`;
writeFileSync(join(mapDir, 'provinces-paths.ts'), pathsTs);

const boundsTs = `${header}import type { ProvinceSlug } from '../../lib/provinces';

/** Riquadri [[sud, ovest], [nord, est]] della parte principale di ogni provincia (isole minori escluse). */
export const PROVINCE_BOUNDS: Record<ProvinceSlug, [[number, number], [number, number]]> = ${JSON.stringify(bounds).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'")};

/** Riquadro della Sicilia (isola principale, isole minori escluse). */
export const SICILY_BOUNDS: [[number, number], [number, number]] = ${JSON.stringify(sicilyB)};
`;
writeFileSync(join(mapDir, 'province-bounds.ts'), boundsTs);

const geoStr = JSON.stringify(geo);
writeFileSync(join(ROOT, 'public/geo/sicilia-province.min.geojson'), geoStr);

// ---------- rapporto ----------
const svgSample = Object.values(paths).map((p) => `<path d="${p.d}"/>`).join('');
console.log(`viewBox 0 0 ${W} ${H}  (eps ${EPS}, isole ${EPS_ISLAND}, area minima ${MIN_AREA})`);
for (const pr of result) console.log(`${pr.slug.padEnd(14)} anelli tenuti ${String(pr.rings.length).padStart(2)}  scartati ${pr.dropped}  vertici ${pr.rings.reduce((s, r) => s + r.pts.length, 0)}`);
console.log(`path SVG: ${svgSample.length} B (gzip ${gzipSync(svgSample).length} B)`);
console.log(`GeoJSON: ${geoStr.length} B (gzip ${gzipSync(geoStr).length} B)`);
