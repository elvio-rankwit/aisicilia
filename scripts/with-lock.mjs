#!/usr/bin/env node
// Esegue un comando shell in mutua esclusione (lock su directory), così build e validazioni
// lanciate in parallelo da più agenti non si sovrascrivono .astro/ e dist/.
//   node scripts/with-lock.mjs "astro build && pagefind --site dist"
import { mkdirSync, rmSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const LOCK = new URL('../.cache/build.lock', import.meta.url).pathname;
const STALE_MS = 15 * 60 * 1000;
const cmd = process.argv.slice(2).join(' ');
mkdirSync(new URL('../.cache/', import.meta.url), { recursive: true });

let announced = false;
for (;;) {
  try { mkdirSync(LOCK); break; } catch {
    try { if (Date.now() - statSync(LOCK).mtimeMs > STALE_MS) { rmSync(LOCK, { recursive: true, force: true }); continue; } } catch {}
    if (!announced) { console.error('[lock] un altro processo sta compilando o validando: attendo…'); announced = true; }
    await sleep(2000);
  }
}
const release = () => rmSync(LOCK, { recursive: true, force: true });
process.on('SIGINT', () => { release(); process.exit(130); });
process.on('SIGTERM', () => { release(); process.exit(143); });
const r = spawnSync(cmd, { stdio: 'inherit', shell: true });
release();
process.exit(r.status ?? 1);
