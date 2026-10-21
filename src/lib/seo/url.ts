// URL canonici e assoluti. Regola: minuscolo, slash finale (tranne i file), niente parametri né hash.
import { SITE } from '../site';

export function normalizePath(path: string): string {
  let p = path.split('#')[0].split('?')[0].trim();
  if (!p.startsWith('/')) p = '/' + p;
  p = p.toLowerCase();
  if (!/\.[a-z0-9]+$/.test(p) && !p.endsWith('/')) p += '/';
  return p;
}

/** URL assoluto di un path del sito. */
export const abs = (path: string): string => SITE.url + normalizePath(path);

/** Path dell'immagine OG di una pagina: `/` → `/og/index.png`, `/aziende/x/` → `/og/aziende/x.png`. */
export function ogPath(path: string): string {
  const p = normalizePath(path).replace(/^\/|\/$/g, '');
  return `/og/${p || 'index'}.png`;
}
export const ogUrl = (path: string): string => SITE.url + ogPath(path);
