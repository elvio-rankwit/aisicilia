// llms-full.txt: estratto testuale delle sezioni chiave (metodologia, aziende, eventi, guide), generato dai dati.
import type { APIRoute } from 'astro';
import { buildLlmsFull } from '../lib/seo/llms';

export const GET: APIRoute = async () =>
  new Response(await buildLlmsFull(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
