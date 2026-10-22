// CONTRATTO DATI tra gli agenti. Ogni modifica va annotata in docs/DECISIONS.md.
// Astro 7 legge le collezioni da questo file (src/content.config.ts): il vecchio
// src/content/config.ts non è più supportato. I dati restano in src/content/<collezione>/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PROVINCE_SLUGS, SICILY_BBOX } from './lib/provinces';
import {
  AI_AREAS, COMPANY_TYPES, COMPATIBLE_TOOLS, EVENT_AUDIENCES, EVENT_FORMATS,
  EVENT_PRICES, EVENT_STATUSES, LEVELS, PROMPT_SECTOR_SLUGS, PROMPT_USE_CASES,
  SECTORS_SERVED,
} from './lib/taxonomies';

// In sviluppo USE_FIXTURES=1 carica i dati fittizi di src/fixtures/. La build di
// produzione non lo imposta mai e `npm run validate` controlla che non ci siano fixture.
const USE_FIXTURES = process.env.USE_FIXTURES === '1';
const base = (name: string) => (USE_FIXTURES ? `./src/fixtures/${name}` : `./src/content/${name}`);
// L'id di ogni record è il suo slug (il validatore controlla che coincida col nome file).
const bySlug = ({ data, entry }: { data: Record<string, unknown>; entry: string }) =>
  typeof data.slug === 'string' ? data.slug : entry.replace(/\.(json|ya?ml|md)$/, '');

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug: minuscolo, senza accenti, parole separate da -');
const province = z.enum(PROVINCE_SLUGS);
const isoDate = z.coerce.date();
const httpUrl = z.url({ protocol: /^https?$/ });
const lat = z.number().min(SICILY_BBOX.minLat).max(SICILY_BBOX.maxLat);
const lng = z.number().min(SICILY_BBOX.minLng).max(SICILY_BBOX.maxLng);
const verification = z.enum(['verified', 'pending']);

const companies = defineCollection({
  loader: glob({ pattern: '**/*.json', base: base('companies'), generateId: bySlug }),
  schema: z.object({
    name: z.string().min(2),
    slug,
    type: z.enum(COMPANY_TYPES),
    /** Riscritta con parole proprie, mai copiata dalla fonte. */
    description: z.string().min(300).max(600),
    ai_areas: z.array(z.enum(AI_AREAS)).min(1),
    sectors_served: z.array(z.enum(SECTORS_SERVED)).min(1),
    province,
    city: z.string().min(2),
    /** Solo indirizzo aziendale pubblico (sede legale o operativa) riportato dalla fonte. */
    address: z.string().optional(),
    lat,
    lng,
    /** "indirizzo" = geocodificato dall'indirizzo; "città" = centro del comune (address assente o non geocodificabile). */
    geo_precision: z.enum(['indirizzo', 'città']),
    website: httpUrl,
    founded_year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    /** true solo se presente nel registro ufficiale delle startup innovative (fonte in source_urls). */
    is_innovative_startup: z.boolean().optional(),
    /** Profili ufficiali verificati (es. pagina su sito universitario). Usati per sameAs. */
    same_as: z.array(httpUrl).default([]),
    source_urls: z.array(httpUrl).min(1),
    last_verified: isoDate,
    verification_status: verification,
    /** In evidenza: prima posizione negli elenchi (regionale e di provincia). Decisione editoriale dell'utente (D-025). */
    featured: z.boolean().default(false),
    /** Nota di trasparenza mostrata nella scheda e nella card (es. rapporto con l'autore del portale). */
    disclosure: z.string().min(20).max(240).optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.json', base: base('events'), generateId: bySlug }),
  schema: z
    .object({
      title: z.string().min(5),
      slug,
      description: z.string().min(200).max(900),
      start_date: isoDate,
      end_date: isoDate.optional(),
      /** HH:MM, ora locale (Europe/Rome). */
      start_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
      end_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
      format: z.enum(EVENT_FORMATS),
      venue_name: z.string().optional(),
      venue_address: z.string().optional(),
      /** Per gli eventi online: città dell'organizzatore siciliano. */
      city: z.string().min(2),
      province,
      lat: lat.optional(),
      lng: lng.optional(),
      organizer: z.string().min(2),
      organizer_url: httpUrl.optional(),
      event_url: httpUrl,
      price: z.enum(EVENT_PRICES),
      audience: z.array(z.enum(EVENT_AUDIENCES)).min(1),
      topics: z.array(z.string().min(2)).min(1),
      status: z.enum(EVENT_STATUSES).default('programmato'),
      source_url: httpUrl,
      last_verified: isoDate,
      verification_status: verification,
    })
    .refine((e) => !e.end_date || e.end_date >= e.start_date, { message: 'end_date precedente a start_date' })
    .refine((e) => e.format === 'online' || (e.lat !== undefined && e.lng !== undefined), {
      message: 'eventi in presenza o ibridi richiedono lat/lng',
    }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: base('articles'), generateId: bySlug }),
  schema: z.object({
    title: z.string().min(10).max(110),
    /** Title tag se il titolo supera 60 caratteri. */
    seo_title: z.string().max(60).optional(),
    slug,
    description: z.string().min(70).max(155),
    /** Paragrafo di risposta diretta (2-3 frasi) mostrato in apertura. */
    answer: z.string().min(120).max(550),
    sectors: z.array(z.enum([...PROMPT_SECTOR_SLUGS, 'tutti'])).min(1),
    level: z.enum(LEVELS),
    reading_time: z.number().int().min(1),
    /** Ordine di lettura consigliato (per "articolo successivo"). */
    order: z.number().int().min(1),
    published_at: isoDate,
    updated_at: isoDate,
    author: z.literal('elvio-leonardi'),
    sources: z.array(z.object({ url: httpUrl, title: z.string().min(3) })).min(1),
    /** true = contenuto YMYL: NON pubblicato finché l'utente non lo approva (e lo porta a false). */
    needs_human_review: z.boolean(),
    reviewed_at: isoDate.optional(),
    faq: z.array(z.object({ question: z.string().min(10), answer: z.string().min(40) })).min(3).max(8),
    related_prompts: z.array(z.string()).default([]),
  }),
});

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: base('prompts'), generateId: bySlug }),
  schema: z.object({
    title: z.string().min(8).max(90),
    slug,
    sector: z.enum(PROMPT_SECTOR_SLUGS),
    use_case: z.enum(PROMPT_USE_CASES),
    /** Una frase: cosa ottieni. */
    goal: z.string().min(30).max(240),
    /** Testo da copiare, con variabili {snake_case}. */
    prompt_text: z.string().min(150),
    variables: z
      .array(z.object({
        name: z.string().regex(/^[a-z0-9_]+$/),
        description: z.string().min(5),
        example: z.string().min(1),
      }))
      .min(1),
    how_to_use: z.string().min(80),
    example_input: z.string().min(40),
    expected_output_description: z.string().min(60),
    limits_and_warnings: z.string().min(60),
    compatible_tools: z.array(z.enum(COMPATIBLE_TOOLS)).min(1),
    level: z.enum(LEVELS),
    /** Data e sintesi del test fatto dal prompt-librarian su example_input. */
    tested_at: isoDate,
    test_notes: z.string().min(30),
  }),
});

export const collections = { companies, events, articles, prompts };
