import type { APIRoute } from 'astro';
import { getEventPages } from '../../../lib/data';
import { SITE } from '../../../lib/site';
import { buildIcs } from '../../../components/ics';
import { RESERVED_SLUGS } from '../../../components/helpers';

export async function getStaticPaths() {
  const pages = await getEventPages();
  return pages.filter((p) => !RESERVED_SLUGS.includes(p.key)).map((p) => ({ params: { slug: p.key }, props: { key: p.key } }));
}

export const GET: APIRoute = async ({ props }) => {
  // Per gli eventi che si ripetono, il file è quello dell'edizione in evidenza.
  const event = (await getEventPages()).find((p) => p.key === props.key)!.event;
  return new Response(buildIcs(event, SITE.url), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${props.key}.ics"` },
  });
};
