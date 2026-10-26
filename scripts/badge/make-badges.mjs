// Genera i badge "Presente su AI Sicilia" (D-041) in public/badge/: SVG con il testo già in tracciati,
// così si vedono uguali su qualsiasi sito, senza font né script esterni. Si rilancia solo se cambia il disegno:
//   node scripts/badge/make-badges.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const font = (f) => readFileSync(join(root, 'src/assets/fonts', f));
const fonts = [
  { name: 'Unbounded', data: font('unbounded-latin-800-normal.woff'), weight: 800, style: 'normal' },
  { name: 'Figtree', data: font('figtree-latin-600-normal.woff'), weight: 600, style: 'normal' },
];

// Stesso marchio dell'header (Header.astro).
const mark = (stroke) =>
  `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34"><rect x="1" y="1" width="32" height="32" rx="9" fill="#0B5FA5" stroke="${stroke}" stroke-width="1.5"/><path d="M7 22l7-11 4 5.5 2.5-3.5L27 22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="18" cy="16.5" r="3" fill="#F07A1A" stroke="#101418" stroke-width="1.2"/></svg>`).toString('base64')}`;

const W = 196, H = 64, SH = 4; // ombra piena come nel design v4
const THEMES = {
  chiaro: { bg: '#FFFFFF', ink: '#101418', muted: '#4A5560', brand: '#0B5FA5', border: '#101418', shadow: '#101418' },
  scuro: { bg: '#0F1418', ink: '#E9ECEF', muted: '#AEB7C0', brand: '#7DB8EA', border: '#E9ECEF', shadow: '#E9ECEF' },
};

const el = (type, style, children) => ({ type, props: { style, children } });

for (const [name, t] of Object.entries(THEMES)) {
  const tree = el('div', { width: W, height: H, display: 'flex', position: 'relative' }, [
    el('div', { position: 'absolute', left: SH, top: SH, width: W - SH, height: H - SH, background: t.shadow, borderRadius: 12 }),
    el('div', {
      // satori non usa border-box: bordo (2+2) e padding (14+14) si sottraggono a mano.
      position: 'absolute', left: 0, top: 0, width: W - SH - 32, height: H - SH - 4, display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 14px', background: t.bg, border: `2px solid ${t.border}`, borderRadius: 12,
    }, [
      { type: 'img', props: { src: mark(t.border), width: 34, height: 34 } },
      el('div', { display: 'flex', flexDirection: 'column', gap: 3 }, [
        el('div', { display: 'flex', fontFamily: 'Figtree', fontWeight: 600, fontSize: 11, letterSpacing: 1.2, color: t.muted }, 'PRESENTE SU'),
        el('div', { display: 'flex', fontFamily: 'Unbounded', fontWeight: 800, fontSize: 18, letterSpacing: -0.7, color: t.ink }, [
          el('span', {}, 'AI'), el('span', { marginLeft: 6, color: t.brand }, 'Sicilia'),
        ]),
      ]),
    ]),
  ]);
  const svg = await satori(tree, { width: W, height: H, fonts });
  const out = join(root, 'public/badge', `presente-su-ai-sicilia-${name}.svg`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, svg.replace('<svg ', '<svg role="img" aria-label="Presente su AI Sicilia" '));
  console.log(out.replace(root + '/', ''), `${(svg.length / 1024).toFixed(1)} KB`);
}
