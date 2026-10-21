// Feed RSS 2.0 degli articoli pubblicati (quelli YMYL in revisione sono esclusi da getArticles).
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getArticles } from '../../lib/data';
import { SITE } from '../../lib/site';
import { PROMPT_SECTORS } from '../../lib/taxonomies';
import { FEEDS } from '../../lib/seo/config';

export const GET: APIRoute = async () => {
  const articles = (await getArticles()).sort((a, b) => b.data.published_at.getTime() - a.data.published_at.getTime());
  const last = articles.map((a) => a.data.updated_at.getTime()).reduce((a, b) => Math.max(a, b), 0);
  return rss({
    title: FEEDS[0].title,
    description: "Guide pratiche sull'intelligenza artificiale per le imprese siciliane: casi d'uso concreti, limiti e cosa fare subito.",
    site: SITE.url,
    xmlns: { atom: 'http://www.w3.org/2005/Atom', dc: 'http://purl.org/dc/elements/1.1/' },
    customData: [
      '<language>it-it</language>',
      last ? `<lastBuildDate>${new Date(last).toUTCString()}</lastBuildDate>` : '',
      `<atom:link href="${SITE.url}${FEEDS[0].path}" rel="self" type="application/rss+xml" />`,
    ].join(''),
    items: articles.map((a) => ({
      title: a.data.title,
      link: `/impara/${a.id}/`,
      description: a.data.description,
      pubDate: a.data.published_at,
      categories: a.data.sectors.filter((s) => s !== 'tutti').map((s) => PROMPT_SECTORS[s as keyof typeof PROMPT_SECTORS]),
      customData: `<dc:creator>${SITE.author.name}</dc:creator>`,
    })),
  });
};
