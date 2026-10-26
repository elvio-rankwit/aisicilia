// Integrazione Astro: dopo la build completa dist/_headers in base a PUBLIC_SITE_MODE (D-002).
// public/_headers contiene le regole comuni (valide in production); in beta si aggiunge X-Robots-Tag: noindex.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Va dentro il blocco /* esistente: con due blocchi /* separati Cloudflare Pages applica solo l'ultimo.
const BETA_LINE = '  X-Robots-Tag: noindex, nofollow';
// In production il sito vive su aisicilia.it: le copie su *.pages.dev (progetto e anteprime) restano fuori dagli indici.
const PAGES_DEV = [
  'https://:project.pages.dev/*',
  '  X-Robots-Tag: noindex',
  '',
  'https://:version.:project.pages.dev/*',
  '  X-Robots-Tag: noindex',
  '',
].join('\n');

export default function seoHeaders(mode) {
  return {
    name: 'aisicilia-seo-headers',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const file = fileURLToPath(new URL('_headers', dir));
        let text = existsSync(file) ? readFileSync(file, 'utf8') : '';
        // In production nessun X-Robots-Tag su aisicilia.it, solo sugli host *.pages.dev.
        text = text.replace(/^\s*X-Robots-Tag:[^\n]*\n/gm, '');
        if (mode !== 'production') text = text.replace(/^\/\*\n/m, `/*\n${BETA_LINE}\n`);
        else text = `${text.trimEnd()}\n\n${PAGES_DEV}`;
        writeFileSync(file, text);
      },
    },
  };
}
