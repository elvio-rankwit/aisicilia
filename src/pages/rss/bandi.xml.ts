// Feed RSS 2.0 dei bandi aperti e in apertura (D-042), dal più recente per aggiornamento (ultima verifica o approvazione).
// Lo stato nella description è quello del giorno di build; senza bandi pubblicati il feed è valido e vuoto.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getOpenGrants, grantPath } from '../../lib/data';
import { SITE } from '../../lib/site';
import { FEEDS } from '../../lib/seo/config';
import { grantTitle, grantUpdated } from '../../lib/seo/grants';
import { meta } from '../../lib/seo/meta';

export const GET: APIRoute = async () => {
  const grants = (await getOpenGrants()).sort((a, b) => grantUpdated(b).getTime() - grantUpdated(a).getTime() || a.id.localeCompare(b.id));
  const last = grants.map((g) => grantUpdated(g).getTime()).reduce((a, b) => Math.max(a, b), 0);
  const self = FEEDS.find((f) => f.path === '/rss/bandi.xml')!;
  return rss({
    title: self.title,
    description: "I bandi e i finanziamenti aperti o in apertura per i progetti di intelligenza artificiale delle imprese siciliane, con ente, scadenza e link alla scheda.",
    site: SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      '<language>it-it</language>',
      last ? `<lastBuildDate>${new Date(last).toUTCString()}</lastBuildDate>` : '',
      `<atom:link href="${SITE.url}${self.path}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: grants.map((g) => ({
      title: grantTitle(g),
      link: grantPath(g),
      // La description meta inizia già con ente e stato (scade il…, apre il…).
      description: meta.grant(g).description,
      pubDate: grantUpdated(g),
      categories: [g.data.issuer_type, ...g.data.aid_types],
    })),
  });
};
