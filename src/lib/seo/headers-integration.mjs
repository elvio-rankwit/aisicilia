// Integrazione Astro: dopo la build completa dist/_headers in base a PUBLIC_SITE_MODE (D-002).
// public/_headers contiene le regole comuni (valide in production); in beta si aggiunge X-Robots-Tag: noindex.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BETA_BLOCK = `
# Solo beta: rafforza il meta robots. Aggiunto in build da headers-integration.mjs, assente in production.
/*
  X-Robots-Tag: noindex, nofollow
`;

export default function seoHeaders(mode) {
  return {
    name: 'aisicilia-seo-headers',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const file = fileURLToPath(new URL('_headers', dir));
        let text = existsSync(file) ? readFileSync(file, 'utf8') : '';
        // In production non deve esistere nessun X-Robots-Tag.
        text = text.replace(/\n# Solo beta[\s\S]*?X-Robots-Tag:[^\n]*\n?/g, '\n');
        if (mode !== 'production') text = text.replace(/\n*$/, '\n') + BETA_BLOCK;
        writeFileSync(file, text);
      },
    },
  };
}
