// Generatore delle immagini Open Graph (D-016, design v4): satori (layout → SVG) + resvg (SVG → PNG) + sharp (PNG a palette).
// Fondo bianco, titolo in Unbounded 800 con una parola chiave su blocco arancia inclinato, sezione e dominio in Figtree (OFL, .woff in src/assets/fonts/).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { OG } from './config';
import { clipWords } from './text';
import type { OgContent } from './pages';
import { PROVINCE_PATHS, VIEWBOX, VIEWBOX_H, VIEWBOX_W } from '../../components/map/provinces-paths';

const root = process.cwd();

// Palette v4 (stessi valori di tokens.css): inchiostro, blu mare, arancia. Niente gradienti.
const C = { bg: '#FFFFFF', ink: '#101418', muted: '#3B4650', blue: '#0B5FA5', orange: '#F07A1A' };

type OgFont = { name: string; data: Buffer; weight: 500 | 600 | 800; style: 'normal' };
let fontCache: OgFont[] | undefined;
const font = (file: string) => readFileSync(join(root, 'src/assets/fonts', file));
function fonts(): OgFont[] {
  return (fontCache ??= [
    { name: 'Unbounded', data: font('unbounded-latin-800-normal.woff'), weight: 800, style: 'normal' },
    { name: 'Figtree', data: font('figtree-latin-500-normal.woff'), weight: 500, style: 'normal' },
    { name: 'Figtree', data: font('figtree-latin-600-normal.woff'), weight: 600, style: 'normal' },
  ]);
}

const dataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

// Sicilia stilizzata: le nove province come un'unica sagoma blu, confini bianchi.
const SICILY = dataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}"><g fill="#0B5FA5" stroke="#fff" stroke-width="1.6" stroke-linejoin="round">${Object.values(PROVINCE_PATHS)
    .map((p) => `<path d="${p.d}"/>`)
    .join('')}</g></svg>`,
);

// Marchio del logo, come nell'header del sito.
const MARK = dataUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><rect x="1" y="1" width="32" height="32" rx="9" fill="#0B5FA5" stroke="#101418" stroke-width="1.5"/><path d="M7 22l7-11 4 5.5 2.5-3.5L27 22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="18" cy="16.5" r="3" fill="#F07A1A" stroke="#101418" stroke-width="1.2"/></svg>',
);

const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) => ({ type, props: { ...extra, style, children } });

/** Corpo del titolo in px, in base alla lunghezza (satori non riduce da solo; Unbounded è largo). */
const titleSize = (len: number) => (len <= 22 ? 78 : len <= 36 ? 66 : len <= 54 ? 54 : len <= 76 ? 46 : 38);

/** Parola da evidenziare: "AI" se c'è, altrimenti la più lunga tra le prime parole del titolo. */
function keywordIndex(words: string[]): number {
  const ai = words.findIndex((w) => /(^|['’])(AI|IA)\b/.test(w));
  if (ai >= 0) return ai;
  let best = -1;
  let len = 4;
  words.slice(0, 5).forEach((w, i) => {
    const l = w.replace(/[^\p{L}\p{N}]/gu, '').length;
    if (l > len) {
      len = l;
      best = i;
    }
  });
  return best;
}

function titleNode(title: string, size: number) {
  const words = title.split(' ');
  const k = keywordIndex(words);
  const gap = Math.round(size * 0.26);
  const items = words.map((w, i) =>
    i === k
      ? el('div', {
          display: 'flex', backgroundColor: C.orange, color: C.ink, padding: `0 ${Math.round(size * 0.12)}px ${Math.round(size * 0.04)}px`,
          marginRight: gap, marginTop: Math.round(size * 0.04), borderRadius: Math.round(size * 0.14), transform: 'rotate(-3deg)',
          border: `${Math.max(2, Math.round(size * 0.04))}px solid ${C.ink}`, boxShadow: `${Math.round(size * 0.07)}px ${Math.round(size * 0.07)}px 0 ${C.ink}`,
        }, w)
      : el('div', { display: 'flex', marginRight: gap }, w),
  );
  return el('div', { display: 'flex', flexWrap: 'wrap', fontFamily: 'Unbounded', fontWeight: 800, fontSize: size, lineHeight: 1.3, letterSpacing: -1, marginTop: 28, maxWidth: 1056 }, items);
}

export async function renderOg(content: OgContent): Promise<Buffer> {
  const title = clipWords(content.title, 100);
  const tree = el('div', {
    position: 'relative', width: OG.width, height: OG.height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '48px 72px 44px', boxSizing: 'border-box', overflow: 'hidden', backgroundColor: C.bg, color: C.ink, fontFamily: 'Figtree',
  }, [
    // Intestazione: logo a sinistra, Sicilia stilizzata a destra.
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 96 }, [
      el('div', { display: 'flex', alignItems: 'center', fontFamily: 'Unbounded', fontWeight: 800, fontSize: 32, letterSpacing: -0.5 }, [
        el('img', { width: 52, height: 52, marginRight: 16 }, undefined, { src: MARK, width: 52, height: 52 }),
        el('div', { display: 'flex' }, 'AI'),
        el('div', { display: 'flex', color: C.blue, marginLeft: 12 }, 'Sicilia'),
      ]),
      el('img', { width: Math.round((96 * VIEWBOX_W) / VIEWBOX_H), height: 96 }, undefined, { src: SICILY, width: Math.round((96 * VIEWBOX_W) / VIEWBOX_H), height: 96 }),
    ]),
    // Sezione, titolo, sottotitolo.
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 600, color: C.blue, letterSpacing: 1.6 }, [
        el('div', { width: 14, height: 14, backgroundColor: C.orange, borderRadius: 3, transform: 'rotate(45deg)', marginRight: 20 }),
        content.eyebrow.toUpperCase(),
      ]),
      titleNode(title, titleSize(title.length)),
      content.subtitle
        ? el('div', { fontSize: 30, fontWeight: 500, lineHeight: 1.4, marginTop: 24, color: C.muted, maxWidth: 1000 }, clipWords(content.subtitle, 80))
        : el('div', { display: 'flex' }),
    ]),
    el('div', { display: 'flex', fontSize: 28, fontWeight: 600, color: C.ink }, 'aisicilia.it'),
    // Fascia blu in basso.
    el('div', { position: 'absolute', left: 0, bottom: 0, width: OG.width, height: 14, backgroundColor: C.blue }),
  ]);

  const svg = await satori(tree as never, { width: OG.width, height: OG.height, fonts: fonts() });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG.width } }).render().asPng();
  // PNG a palette: pochi colori (tinta unita + anti-aliasing del testo), il peso resta ben sotto 80 KB.
  return sharp(png).png({ palette: true, colours: 48, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer();
}
