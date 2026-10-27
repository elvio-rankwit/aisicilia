import type { APIRoute } from 'astro';
import { getAllGrants, grantStatus } from '../../../lib/data';
import { SITE } from '../../../lib/site';
import { buildGrantIcs } from '../../../components/ics';
import { GRANT_RESERVED_SLUGS } from '../../../components/grants';

// Solo per i bandi non chiusi che hanno una scadenza: agli sportelli senza data non c'è nulla da mettere in calendario.
export async function getStaticPaths() {
  const grants = await getAllGrants();
  return grants
    .filter((g) => !GRANT_RESERVED_SLUGS.includes(g.id) && grantStatus(g) !== 'chiuso' && g.data.deadline)
    .map((g) => ({ params: { slug: g.id }, props: { id: g.id } }));
}

export const GET: APIRoute = async ({ props }) => {
  const grant = (await getAllGrants()).find((g) => g.id === props.id)!;
  return new Response(buildGrantIcs(grant, SITE.url), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${props.id}-scadenza.ics"` },
  });
};
