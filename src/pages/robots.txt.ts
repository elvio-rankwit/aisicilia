// robots.txt. Beta: tutto vietato. Production: tutto consentito, con consenso esplicito ai crawler AI (config.ts).
import type { APIRoute } from 'astro';
import { IS_BETA, SITE } from '../lib/site';
import { AI_BOTS_ALLOWED, AI_BOTS_BLOCKED, SITEMAP_INDEX_PATH } from '../lib/seo/config';

export const GET: APIRoute = () => {
  const lines: string[] = [];
  if (IS_BETA) {
    lines.push('# Beta non indicizzata: nessun crawler autorizzato (D-002).', 'User-agent: *', 'Disallow: /');
  } else {
    lines.push('# Crawler AI e motori di ricerca: consenso esplicito.');
    for (const bot of AI_BOTS_ALLOWED) lines.push(`User-agent: ${bot}`);
    lines.push('Allow: /', '');
    if (AI_BOTS_BLOCKED.length) {
      for (const bot of AI_BOTS_BLOCKED) lines.push(`User-agent: ${bot}`);
      lines.push('Disallow: /', '');
    }
    lines.push('User-agent: *', 'Allow: /', '', `Sitemap: ${SITE.url}${SITEMAP_INDEX_PATH}`);
  }
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
