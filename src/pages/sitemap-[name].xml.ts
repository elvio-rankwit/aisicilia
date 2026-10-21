// Sitemap segmentate + indice (`/sitemap-index.xml`, `/sitemap-pagine.xml`, `/sitemap-aziende.xml`…).
// Si generano solo in production: in beta getStaticPaths è vuoto, quindi i file non esistono nel dist.
import type { APIRoute, GetStaticPaths } from 'astro';
import { IS_BETA, SITE } from '../lib/site';
import { SITEMAP_SEGMENTS } from '../lib/seo/config';
import { ymd } from '../lib/seo/dates';
import { getSitePages } from '../lib/seo/pages';
import { abs } from '../lib/seo/url';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const header = '<?xml version="1.0" encoding="UTF-8"?>\n';

async function indexable() {
  return (await getSitePages()).filter((p) => p.indexable);
}

export const getStaticPaths = (async () => {
  if (IS_BETA) return [];
  const pages = await indexable();
  const names = SITEMAP_SEGMENTS.filter((s) => pages.some((p) => p.segment === s));
  return [...names, 'index'].map((name) => ({ params: { name } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const pages = await indexable();
  let body: string;
  if (params.name === 'index') {
    const items = SITEMAP_SEGMENTS.flatMap((seg) => {
      const inSeg = pages.filter((p) => p.segment === seg);
      if (!inSeg.length) return [];
      const last = inSeg.map((p) => p.lastmod?.getTime() ?? 0).reduce((a, b) => Math.max(a, b), 0);
      return [`  <sitemap><loc>${SITE.url}/sitemap-${seg}.xml</loc>${last ? `<lastmod>${ymd(new Date(last))}</lastmod>` : ''}</sitemap>`];
    });
    body = `${header}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</sitemapindex>\n`;
  } else {
    const items = pages
      .filter((p) => p.segment === params.name)
      .map((p) => `  <url><loc>${esc(abs(p.path))}</loc>${p.lastmod ? `<lastmod>${ymd(p.lastmod)}</lastmod>` : ''}</url>`);
    body = `${header}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</urlset>\n`;
  }
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
