#!/usr/bin/env node
// Prescreening delle startup innovative siciliane: per ogni impresa con sito, scarica SOLO la home
// (rispettando robots.txt, una richiesta per dominio, timeout breve) e conta i termini legati all'AI.
// Non pubblica nulla: produce data/registro/prescreen.json, una lista di candidati che i ricercatori
// verificano a mano con le regole di docs/specs/directory-researcher.md.
//   node scripts/research/registro-prescreen.mjs [--concurrency 4]
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url);
const SRC = new URL('data/registro/startup-innovative-sicilia-2026-10-19.csv', ROOT);
const OUT = new URL('data/registro/prescreen.json', ROOT);
const UA = 'aisicilia.it-beta/0.1 (verifica directory AI Sicilia; https://github.com/elvio-rankwit/aisicilia)';
const CONCURRENCY = Number(process.argv[process.argv.indexOf('--concurrency') + 1]) || 4;

// Termini forti (AI dichiarata) e deboli (contesto dati/automazione).
const STRONG = [
  /intelligenza artificiale/gi, /artificial intelligence/gi, /machine learning/gi, /deep learning/gi,
  /computer vision/gi, /visione artificiale/gi, /reti neurali|neural network/gi, /\bNLP\b|natural language processing|elaborazione del linguaggio/gi,
  /\bLLM\b|large language model|AI generativa|generative AI|IA generativa/gi, /\bA\.?I\.?(?=[\s\-.,:;)])|\bIA\b/g,
];
const WEAK = [/algoritm/gi, /predittiv|predictive/gi, /data science|big data|analytics/gi, /chatbot|assistente virtuale/gi, /robotic|robotica/gi, /automazione intelligente/gi];

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = lines.map((l) => {
    const out = []; let cur = ''; let q = false;
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (q) { if (ch === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
      else if (ch === '"') q = true; else if (ch === ',') { out.push(cur); cur = ''; } else cur += ch;
    }
    out.push(cur); return out;
  });
  const [h, ...data] = rows;
  return data.map((r) => Object.fromEntries(h.map((k, i) => [k, r[i] ?? ''])));
}

const normUrl = (s) => {
  const t = s.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  return t && t.includes('.') ? `https://${t.toLowerCase()}/` : null;
};

async function get(url, ms = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,*/*;q=0.5' }, redirect: 'follow', signal: ctrl.signal });
    const reader = r.body?.getReader();
    let size = 0; const chunks = [];
    if (reader) for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; chunks.push(value); if (size > 600_000) { ctrl.abort(); break; } }
    return { status: r.status, url: r.url, text: Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8') };
  } finally { clearTimeout(t); }
}

function robotsAllowsRoot(txt) {
  // Interpretazione prudente: gruppo "*" con "Disallow: /" → non visitiamo.
  let applies = false; let blocked = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = /^(user-agent|disallow|allow)\s*:\s*(.*)$/i.exec(line);
    if (!m) continue;
    const [, k, v] = m;
    if (/user-agent/i.test(k)) applies = v.trim() === '*' || /aisicilia/i.test(v);
    else if (applies && /disallow/i.test(k) && v.trim() === '/') blocked = true;
  }
  return !blocked;
}

const visible = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ');

async function screen(row) {
  const site = normUrl(row['sito internet'] || '');
  const base = { denominazione: row.denominazione, comune: row.comune, pv: row.pv, ateco: row['ateco 2007'], attivita: row['attività'], sito: site };
  if (!site) return { ...base, esito: 'senza sito' };
  try {
    const rob = await get(new URL('/robots.txt', site).href, 8000).catch(() => null);
    if (rob && rob.status === 200 && !robotsAllowsRoot(rob.text)) return { ...base, esito: 'robots.txt vieta' };
    const r = await get(site);
    if (r.status >= 400) return { ...base, esito: `HTTP ${r.status}` };
    const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(r.text)?.[1] ?? '').trim().slice(0, 120);
    const desc = (/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i.exec(r.text)?.[1] ?? '').slice(0, 200);
    const text = visible(r.text);
    const strong = STRONG.reduce((n, re) => n + (text.match(re)?.length ?? 0), 0);
    const weak = WEAK.reduce((n, re) => n + (text.match(re)?.length ?? 0), 0);
    return { ...base, esito: 'ok', url_finale: r.url, title, description: desc, ai_forte: strong, ai_debole: weak, punteggio: strong * 3 + weak };
  } catch (e) {
    return { ...base, esito: `errore: ${e.name === 'AbortError' ? 'timeout' : e.message.slice(0, 60)}` };
  }
}

const rows = parseCsv(readFileSync(SRC, 'utf8'));
const results = [];
let i = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < rows.length) {
    const row = rows[i++];
    results.push(await screen(row));
    if (results.length % 50 === 0) console.error(`${results.length}/${rows.length}`);
  }
}));
results.sort((a, b) => (b.punteggio ?? -1) - (a.punteggio ?? -1));
writeFileSync(OUT, JSON.stringify({ generato: new Date().toISOString(), totale: rows.length, risultati: results }, null, 1) + '\n');
const cand = results.filter((r) => (r.ai_forte ?? 0) >= 2);
console.log(`Fatto: ${results.length} imprese, ${results.filter((r) => r.esito === 'ok').length} siti letti, ${cand.length} candidati con almeno 2 menzioni AI forti.`);
