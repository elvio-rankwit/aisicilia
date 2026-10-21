// Generatore delle immagini Open Graph (D-016): satori (layout → SVG) + resvg (SVG → PNG) + sharp (PNG a palette).
// Colori letti da src/styles/tokens.css, font OFL (Atkinson Hyperlegible) incluso in src/assets/fonts/.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { OG } from './config';
import { clipWords } from './text';
import type { OgContent } from './pages';

const root = process.cwd();

// Design v2 (D-024): fondo pietra lavica, titolo bianco calce, sezione in ocra (leggibile su scuro), terracotta decorativa.
const V2 = { bg: '#1C2124', text: '#ECE7DC', muted: '#A9AFA9', ochre: '#C29A4E', terracotta: '#A4502A' };

function tokens() {
  let css = '';
  try { css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8'); } catch { /* usa i valori di riserva */ }
  // Si leggono i token solo se il design v2 è già applicato (esiste --c-lava), altrimenti valgono i valori v2 sopra.
  if (!css.includes('--c-lava')) return V2;
  const get = (name: string, fallback: string) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] ?? fallback;
  return {
    bg: get('c-lava', V2.bg),
    text: get('c-on-lava', V2.text),
    muted: get('c-on-lava-muted', V2.muted),
    ochre: get('c-ochre', V2.ochre),
    terracotta: get('c-accent', V2.terracotta),
  };
}

type OgFont = { name: string; data: Buffer; weight: 400 | 500 | 700; style: 'normal' };
let fontCache: OgFont[] | undefined;
const font = (file: string) => readFileSync(join(root, 'src/assets/fonts', file));
function fonts(): OgFont[] {
  return (fontCache ??= [
    { name: 'Familjen Grotesk', data: font('familjen-grotesk-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Familjen Grotesk', data: font('familjen-grotesk-latin-700-normal.woff'), weight: 700, style: 'normal' },
    { name: 'IBM Plex Mono', data: font('ibm-plex-mono-latin-500-normal.woff'), weight: 500, style: 'normal' },
  ]);
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** Corpo del titolo in px, in base alla lunghezza (satori non riduce da solo). */
const titleSize = (len: number) => (len <= 32 ? 88 : len <= 56 ? 76 : len <= 80 ? 64 : len <= 110 ? 54 : 46);

const GRID_STEP = 60;
/** Griglia cartografica sottile: linee da 1px, opacità bassa. */
function grid(color: string) {
  const line = (style: Record<string, unknown>) => el('div', { position: 'absolute', backgroundColor: color, opacity: 0.07, ...style });
  const lines: unknown[] = [];
  for (let x = GRID_STEP; x < OG.width; x += GRID_STEP) lines.push(line({ left: x, top: 0, width: 1, height: OG.height }));
  for (let y = GRID_STEP; y < OG.height; y += GRID_STEP) lines.push(line({ left: 0, top: y, width: OG.width, height: 1 }));
  return el('div', { position: 'absolute', left: 0, top: 0, width: OG.width, height: OG.height, display: 'flex' }, lines);
}

export async function renderOg(content: OgContent): Promise<Buffer> {
  const t = tokens();
  const title = clipWords(content.title, 120);
  const label = `AISICILIA.IT · ${content.eyebrow}`.toUpperCase();
  const tree = el('div', {
    position: 'relative', width: OG.width, height: OG.height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '64px 72px', boxSizing: 'border-box', overflow: 'hidden', backgroundColor: t.bg, color: t.text, fontFamily: 'Familjen Grotesk',
  }, [
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', alignItems: 'center', fontFamily: 'IBM Plex Mono', fontSize: 28, fontWeight: 500, color: t.ochre, letterSpacing: 1 }, [
        el('div', { width: 18, height: 18, backgroundColor: t.terracotta, marginRight: 20 }),
        label,
      ]),
      el('div', { fontSize: titleSize(title.length), fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, marginTop: 40, maxWidth: 1040 }, title),
      content.subtitle
        ? el('div', { fontFamily: 'IBM Plex Mono', fontSize: 28, fontWeight: 500, lineHeight: 1.35, marginTop: 32, color: t.muted, maxWidth: 1000 }, clipWords(content.subtitle, 80))
        : el('div', { display: 'flex' }),
    ]),
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      el('div', { fontSize: 44, fontWeight: 700, letterSpacing: -0.5 }, 'AI Sicilia'),
      // Coordinate dell'isola in mono, come etichetta di mappa.
      el('div', { fontFamily: 'IBM Plex Mono', fontSize: 24, fontWeight: 500, color: t.muted }, '37.6°N 14.1°E'),
    ]),
    grid(t.text),
  ]);

  const svg = await satori(tree as never, { width: OG.width, height: OG.height, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG.width } }).render().asPng();
  // PNG a palette: pochi colori (tinta unita + anti-aliasing del testo), il peso resta ben sotto 80 KB.
  return sharp(png).png({ palette: true, colours: 48, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer();
}
