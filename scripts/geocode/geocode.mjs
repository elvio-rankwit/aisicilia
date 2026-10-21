#!/usr/bin/env node
// Geocoding con Nominatim (OpenStreetMap), con cache su file. Max 1 richiesta al secondo.
// Le coordinate vanno SALVATE nei dati: il sito non fa mai geocoding a runtime.
//
//   node scripts/geocode/geocode.mjs "Via Esempio 1, 90100 Palermo"     → indirizzo
//   node scripts/geocode/geocode.mjs --city "Caltagirone"               → centro del comune
// Stampa JSON: {"lat":..,"lng":..,"display_name":"..","precision":"indirizzo|città"} o esce con 1.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const CACHE = new URL('./cache.json', import.meta.url);
const UA = 'aisicilia.it-beta/0.1 (portale AI Sicilia; https://github.com/elvio-rankwit/aisicilia)';
const LOCK = new URL('./.last-request', import.meta.url);
const SICILY = { minLat: 35.4, maxLat: 38.9, minLng: 11.9, maxLng: 15.7 };

const args = process.argv.slice(2);
const cityMode = args[0] === '--city';
const query = (cityMode ? args.slice(1) : args).join(' ').trim();
if (!query) { console.error('Uso: geocode.mjs [--city] "<indirizzo o comune>"'); process.exit(2); }

const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
const key = `${cityMode ? 'city' : 'addr'}:${query.toLowerCase()}`;
if (cache[key]) { console.log(JSON.stringify(cache[key])); process.exit(0); }

// Rate limit globale (anche tra processi): almeno 1100 ms tra due richieste.
const last = existsSync(LOCK) ? Number(readFileSync(LOCK, 'utf8')) : 0;
const wait = last + 1100 - Date.now();
if (wait > 0) await sleep(wait);
writeFileSync(LOCK, String(Date.now()));

const params = new URLSearchParams({ format: 'jsonv2', limit: '1', countrycodes: 'it', 'accept-language': 'it' });
if (cityMode) { params.set('city', query); params.set('state', 'Sicilia'); } else params.set('q', query);
const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { headers: { 'User-Agent': UA } });
if (!res.ok) { console.error(`Nominatim HTTP ${res.status}`); process.exit(1); }
const [hit] = await res.json();
if (!hit) { console.error('Nessun risultato'); process.exit(1); }
const out = {
  lat: Math.round(Number(hit.lat) * 1e5) / 1e5,
  lng: Math.round(Number(hit.lon) * 1e5) / 1e5,
  display_name: hit.display_name,
  precision: cityMode ? 'città' : 'indirizzo',
};
if (out.lat < SICILY.minLat || out.lat > SICILY.maxLat || out.lng < SICILY.minLng || out.lng > SICILY.maxLng) {
  console.error(`Risultato fuori dalla Sicilia: ${hit.display_name}`); process.exit(1);
}
// Rilettura prima della scrittura: più agenti possono usare lo script in parallelo.
const fresh = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};
fresh[key] = out;
writeFileSync(CACHE, JSON.stringify(fresh, null, 2) + '\n');
console.log(JSON.stringify(out));
