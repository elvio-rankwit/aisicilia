// Costanti SEO/GEO del sito. Un solo posto per cose che cambiano per decisione, non per codice.
import { SITE } from '../site';

/** Il sito è solo in italiano (D-022). Struttura pronta, ma disattivata: nessun hreflang nelle pagine. */
export const HREFLANG_ENABLED = false;
export const LOCALES = [{ code: 'it', hreflang: 'it-IT', prefix: '' }] as const;
export const DEFAULT_LOCALE = LOCALES[0];

/** hreflang per un path: vuoto finché HREFLANG_ENABLED è false. Con più lingue andrà esteso con i path tradotti. */
export function hreflangLinks(path: string): { hreflang: string; href: string }[] {
  if (!HREFLANG_ENABLED) return [];
  const links = LOCALES.map((l) => ({ hreflang: l.hreflang, href: SITE.url + l.prefix + path }));
  return [...links, { hreflang: 'x-default', href: SITE.url + DEFAULT_LOCALE.prefix + path }];
}

/**
 * Crawler AI a cui robots.txt (in production) dà un consenso esplicito.
 * Per bloccarne uno basta spostarlo in AI_BOTS_BLOCKED (decisione dell'utente, vedi D-002).
 */
export const AI_BOTS_ALLOWED = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot',
  'PerplexityBot', 'Google-Extended', 'Applebot-Extended',
] as const;
export const AI_BOTS_BLOCKED: readonly string[] = [];

/** Immagine Open Graph. */
export const OG = { width: 1200, height: 630, maxBytes: 80 * 1024 } as const;

/** Feed RSS esposti e annunciati con <link rel="alternate">. */
export const FEEDS = [
  { path: '/rss/articoli.xml', title: 'AI Sicilia: guide e articoli' },
  { path: '/rss/eventi.xml', title: 'AI Sicilia: prossimi eventi sull’AI in Sicilia' },
  { path: '/rss/bandi.xml', title: 'AI Sicilia: bandi e finanziamenti per l’AI' },
] as const;

/** Nome del file sitemap (senza .xml) per ogni segmento. */
export const SITEMAP_SEGMENTS = ['pagine', 'aziende', 'eventi', 'bandi', 'articoli', 'prompt'] as const;
export type SitemapSegment = (typeof SITEMAP_SEGMENTS)[number];

export const SITEMAP_INDEX_PATH = '/sitemap-index.xml';
