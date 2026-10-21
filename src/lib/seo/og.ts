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

function tokens() {
  let css = '';
  try { css = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8'); } catch { /* usa i valori di riserva */ }
  const get = (name: string, fallback: string) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`))?.[1] ?? fallback;
  return {
    bg: get('c-primary', '#0a5a74'),
    text: get('c-on-primary', '#ffffff'),
    accent: get('c-lemon', '#f2c94c'),
    soft: get('c-primary-soft', '#e1eff3'),
    surface: get('c-bg', '#faf7f2'),
  };
}

let fontCache: { name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[] | undefined;
function fonts() {
  return (fontCache ??= [
    { name: 'Atkinson', data: readFileSync(join(root, 'src/assets/fonts/atkinson-hyperlegible-latin-400-normal.woff')), weight: 400, style: 'normal' },
    { name: 'Atkinson', data: readFileSync(join(root, 'src/assets/fonts/atkinson-hyperlegible-latin-700-normal.woff')), weight: 700, style: 'normal' },
  ]);
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** Corpo del titolo in px, in base alla lunghezza (satori non riduce da solo). */
const titleSize = (len: number) => (len <= 32 ? 84 : len <= 56 ? 72 : len <= 80 ? 62 : len <= 110 ? 54 : 46);

const PROVINCE_DOTS = 9;

export async function renderOg(content: OgContent): Promise<Buffer> {
  const t = tokens();
  const title = clipWords(content.title, 120);
  const tree = el('div', {
    width: OG.width, height: OG.height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '64px 72px', backgroundColor: t.bg, color: t.text, fontFamily: 'Atkinson',
  }, [
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 700, color: t.accent, letterSpacing: 2, textTransform: 'uppercase' }, [
        el('div', { width: 56, height: 6, backgroundColor: t.accent, marginRight: 20, borderRadius: 3 }),
        content.eyebrow,
      ]),
      el('div', { fontSize: titleSize(title.length), fontWeight: 700, lineHeight: 1.12, marginTop: 36, maxWidth: 1040 }, title),
      content.subtitle
        ? el('div', { fontSize: 34, fontWeight: 400, lineHeight: 1.3, marginTop: 28, color: t.soft, maxWidth: 1000 }, clipWords(content.subtitle, 90))
        : el('div', { display: 'flex' }),
    ]),
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      el('div', { display: 'flex', alignItems: 'baseline' }, [
        el('div', { fontSize: 44, fontWeight: 700 }, 'AI Sicilia'),
        el('div', { fontSize: 30, fontWeight: 400, color: t.soft, marginLeft: 24 }, 'aisicilia.it'),
      ]),
      // Nove puntini: le nove province.
      el('div', { display: 'flex' }, Array.from({ length: PROVINCE_DOTS }, (_, i) =>
        el('div', { width: 18, height: 18, borderRadius: 9, marginLeft: 12, backgroundColor: t.accent, opacity: 0.35 + (i % 3) * 0.3 }))),
    ]),
  ]);

  const svg = await satori(tree as never, { width: OG.width, height: OG.height, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG.width } }).render().asPng();
  // PNG a palette: i colori sono pochi (tinta unita + anti-aliasing del testo), il peso resta ben sotto 80 KB.
  return sharp(png).png({ palette: true, colours: 48, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer();
}
