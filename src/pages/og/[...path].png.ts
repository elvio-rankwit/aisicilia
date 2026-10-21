// Immagine Open Graph 1200×630 di ogni pagina (D-016), generata in build. `/og/<path>.png`, la home è `/og/index.png`.
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOg } from '../../lib/seo/og';
import { getSitePages } from '../../lib/seo/pages';
import { ogPath } from '../../lib/seo/url';

export const getStaticPaths = (async () => {
  const pages = await getSitePages();
  return pages.map((p) => ({
    params: { path: ogPath(p.path).replace(/^\/og\//, '').replace(/\.png$/, '') },
    props: { og: p.og },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props.og);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
