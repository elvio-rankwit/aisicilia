// Feed RSS 2.0 dei prossimi eventi. La data di pubblicazione di ogni voce è l'ultima verifica della scheda.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { eventPath, getUpcomingEvents } from '../../lib/data';
import { SITE } from '../../lib/site';
import { FEEDS } from '../../lib/seo/config';
import { meta } from '../../lib/seo/meta';

const STATUS_PREFIX = { programmato: '', annullato: 'Annullato: ', rinviato: 'Rinviato: ', 'spostato online': 'Spostato online: ' } as const;

export const GET: APIRoute = async () => {
  const events = await getUpcomingEvents();
  const last = events.map((e) => e.data.last_verified.getTime()).reduce((a, b) => Math.max(a, b), 0);
  return rss({
    title: FEEDS[1].title,
    description: "I prossimi eventi sull'intelligenza artificiale in Sicilia, in ordine di data, con luogo e link alla scheda.",
    site: SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      '<language>it-it</language>',
      last ? `<lastBuildDate>${new Date(last).toUTCString()}</lastBuildDate>` : '',
      `<atom:link href="${SITE.url}${FEEDS[1].path}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: events.map((e) => ({
      title: STATUS_PREFIX[e.data.status] + e.data.title,
      link: eventPath(e),
      // La description meta inizia già con data e luogo.
      description: meta.event(e).description,
      pubDate: e.data.last_verified,
      categories: e.data.topics,
    })),
  });
};
