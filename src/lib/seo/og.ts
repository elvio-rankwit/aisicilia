// Generatore delle immagini Open Graph (D-016, design v3 D-034): satori (layout → SVG) + resvg (SVG → PNG) + sharp (PNG a palette).
// Fondo chiaro, titolo in Newsreader 600, sezione e dominio in Public Sans (OFL, file .woff in src/assets/fonts/).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { OG } from './config';
import { clipWords } from './text';
import type { OgContent } from './pages';

const root = process.cwd();

// Palette v3 (stessi valori di tokens.css): calce, antracite, blu maiolica; terracotta e ocra come dettagli.
const C = { bg: '#F8F6F1', text: '#2A2E33', muted: '#5D6369', primary: '#235C80', terracotta: '#A8532D', ochre: '#C79A45' };

type OgFont = { name: string; data: Buffer; weight: 500 | 600; style: 'normal' };
let fontCache: OgFont[] | undefined;
const font = (file: string) => readFileSync(join(root, 'src/assets/fonts', file));
function fonts(): OgFont[] {
  return (fontCache ??= [
    { name: 'Newsreader', data: font('newsreader-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'Public Sans', data: font('public-sans-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Public Sans', data: font('public-sans-latin-600-normal.woff'), weight: 600, style: 'normal' },
  ]);
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** Corpo del titolo in px, in base alla lunghezza (satori non riduce da solo). */
const titleSize = (len: number) => (len <= 32 ? 92 : len <= 56 ? 80 : len <= 80 ? 68 : len <= 110 ? 58 : 50);

export async function renderOg(content: OgContent): Promise<Buffer> {
  const title = clipWords(content.title, 120);
  const label = content.eyebrow.toUpperCase();
  const tree = el('div', {
    position: 'relative', width: OG.width, height: OG.height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '64px 80px 56px', boxSizing: 'border-box', overflow: 'hidden', backgroundColor: C.bg, color: C.text, fontFamily: 'Public Sans',
  }, [
    // Filetto ocra in alto: unico elemento decorativo, niente griglia.
    el('div', { position: 'absolute', left: 0, top: 0, width: OG.width, height: 10, backgroundColor: C.ochre }),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 600, color: C.primary, letterSpacing: 1.2 }, [
        el('div', { width: 14, height: 14, backgroundColor: C.terracotta, marginRight: 18 }),
        label,
      ]),
      el('div', { fontFamily: 'Newsreader', fontSize: titleSize(title.length), fontWeight: 600, lineHeight: 1.12, letterSpacing: -0.5, marginTop: 36, maxWidth: 1040 }, title),
      content.subtitle
        ? el('div', { fontSize: 28, fontWeight: 500, lineHeight: 1.4, marginTop: 28, color: C.muted, maxWidth: 1000 }, clipWords(content.subtitle, 80))
        : el('div', { display: 'flex' }),
    ]),
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
      el('div', { fontFamily: 'Newsreader', fontSize: 44, fontWeight: 600, color: C.text }, 'AI Sicilia'),
      el('div', { fontSize: 26, fontWeight: 500, color: C.muted }, 'aisicilia.it'),
    ]),
  ]);

  const svg = await satori(tree as never, { width: OG.width, height: OG.height, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG.width } }).render().asPng();
  // PNG a palette: pochi colori (tinta unita + anti-aliasing del testo), il peso resta ben sotto 80 KB.
  return sharp(png).png({ palette: true, colours: 48, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer();
}
