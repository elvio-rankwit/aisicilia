// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Unica variabile che governa beta/production. Vedi docs/DECISIONS.md (D-002).
const SITE_MODE = process.env.PUBLIC_SITE_MODE === 'production' ? 'production' : 'beta';
// Il dominio definitivo si cambia solo qui (o con PUBLIC_SITE_URL in Cloudflare).
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://aisicilia.it';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [preact()],
  image: {
    // Formati di output: AVIF + fallback WebP tramite <Picture formats={['avif','webp']} />
    responsiveStyles: true,
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://*.tile.openstreetmap.org https://tile.openstreetmap.org",
        "connect-src 'self'",
        "font-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self' https://tally.so https://formspree.io",
      ],
    },
  },
  vite: {
    define: { __SITE_MODE__: JSON.stringify(SITE_MODE) },
  },
});
