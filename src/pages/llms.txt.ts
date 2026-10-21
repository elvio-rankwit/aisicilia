// llms.txt (llmstxt.org): sintesi del progetto e link alle pagine chiave, generato dai dati in entrambe le modalità.
import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../lib/seo/llms';

export const GET: APIRoute = async () =>
  new Response(await buildLlmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
