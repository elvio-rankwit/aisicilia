import type { APIRoute } from 'astro';
import { getAllEvents } from '../../../lib/data';
import { SITE } from '../../../lib/site';
import { buildIcs } from '../../../components/ics';
import { RESERVED_SLUGS } from '../../../components/helpers';

export async function getStaticPaths() {
  const events = await getAllEvents();
  return events.filter((e) => !RESERVED_SLUGS.includes(e.id)).map((e) => ({ params: { slug: e.id }, props: { id: e.id } }));
}

export const GET: APIRoute = async ({ props }) => {
  const event = (await getAllEvents()).find((e) => e.id === props.id)!;
  return new Response(buildIcs(event, SITE.url), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${event.id}.ics"` },
  });
};
