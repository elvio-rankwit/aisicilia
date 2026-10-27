// CONTRATTO DATI tra gli agenti. Ogni modifica va annotata in docs/DECISIONS.md.
// Astro 7 legge le collezioni da questo file (src/content.config.ts): il vecchio
// src/content/config.ts non è più supportato. I dati restano in src/content/<collezione>/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { PROVINCE_SLUGS, SICILY_BBOX } from './lib/provinces';
import {
  AI_AREAS, COMPANY_TYPES, COMPATIBLE_TOOLS, EVENT_AUDIENCES, EVENT_FORMATS,
  EVENT_PRICES, EVENT_STATUSES, GRANT_AI_FIT, GRANT_AID_TYPES, GRANT_BENEFICIARIES,
  GRANT_ISSUER_TYPES, GRANT_PROCEDURES, GRANT_SCOPES, LEVELS, PROMPT_SECTOR_SLUGS, PROMPT_USE_CASES,
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
    /** Data in cui l'azienda ha confermato i dati della scheda con il flusso /rivendica/ (D-041). */
    claimed_at: isoDate.optional(),
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
      /** Eventi che si ripetono (D-039): stesso `series` per tutte le edizioni, che condividono la pagina /eventi/<series>/. */
      series: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine((s) => !/-20\d\d(-\d\d)?$/.test(s), 'la serie non contiene anno o mese').optional(),
      /** Nome stabile della serie, senza anno: è l'H1 della pagina. */
      series_name: z.string().min(3).optional(),
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
    .refine((e) => !e.series === !e.series_name, { message: 'series e series_name vanno insieme' })
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

// Bandi e finanziamenti (D-042). YMYL: needs_human_review true finché l'utente non li approva.
// Lo stato (aperto / in apertura / chiuso) non si scrive: lo calcola `grantStatus` in src/lib/data.ts.
const grants = defineCollection({
  loader: glob({ pattern: '**/*.json', base: base('grants'), generateId: bySlug }),
  schema: z
    .object({
      /** Nome ufficiale del bando, come nell'avviso. */
      title: z.string().min(5).max(140),
      slug,
      /** Ente che emette il bando (es. "Camera di Commercio del Sud Est Sicilia", "Invitalia"). */
      issuer: z.string().min(2),
      issuer_type: z.enum(GRANT_ISSUER_TYPES),
      scope: z.enum(GRANT_SCOPES),
      /** Province ammesse se il bando vale solo per una parte della Sicilia. Vuoto = tutta la Sicilia. */
      provinces: z.array(province).default([]),
      /** Riscritta con parole proprie: cosa finanzia, a chi serve, in che modo. */
      description: z.string().min(300).max(900),
      ai_fit: z.enum(GRANT_AI_FIT),
      /** Perché il bando c'entra con l'AI, con il riferimento al testo (articolo o allegato). */
      ai_note: z.string().min(60).max(400),
      beneficiaries: z.array(z.enum(GRANT_BENEFICIARIES)).min(1),
      aid_types: z.array(z.enum(GRANT_AID_TYPES)).min(1),
      /** Testo breve dalla fonte, es. "300.000 euro". */
      budget: z.string().min(3).max(80).optional(),
      /** Es. "fino a 10.000 euro per impresa". */
      max_amount: z.string().min(3).max(120).optional(),
      /** Es. "50% delle spese ammissibili". */
      aid_intensity: z.string().min(3).max(160).optional(),
      procedure: z.enum(GRANT_PROCEDURES),
      /** Prima data utile per presentare la domanda. */
      opens_at: isoDate.optional(),
      /** Ultimo giorno utile. Assente solo per gli sportelli senza scadenza (serve deadline_note). */
      deadline: isoDate.optional(),
      /** HH:MM, ora italiana. */
      deadline_time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
      /** Es. "fino a esaurimento delle risorse", "prossimo cut-off: 7 gennaio 2027". */
      deadline_note: z.string().min(5).max(160).optional(),
      /** true se la fonte dice che lo sportello è chiuso o sospeso prima della scadenza (fondi esauriti). */
      closed_early: z.boolean().default(false),
      /** Pagina ufficiale del bando (ente che lo emette o gestore). */
      official_url: httpUrl,
      /** Testo del bando, allegati, FAQ ufficiali. */
      documents: z.array(z.object({ url: httpUrl, title: z.string().min(3) })).default([]),
      sources: z.array(z.object({ url: httpUrl, title: z.string().min(3) })).min(1),
      last_verified: isoDate,
      verification_status: verification,
      /** true = YMYL non ancora approvato: escluso dalla build. Per approvare: false + reviewed_at. */
      needs_human_review: z.boolean(),
      reviewed_at: isoDate.optional(),
    })
    .refine((g) => g.deadline || g.deadline_note, { message: 'senza deadline serve deadline_note' })
    .refine((g) => !g.opens_at || !g.deadline || g.deadline >= g.opens_at, { message: 'deadline precedente a opens_at' })
    .refine((g) => (g.scope === 'provinciale') === g.provinces.length > 0, { message: 'scope "provinciale" se e solo se provinces è compilato' }),
});

export const collections = { companies, events, articles, prompts, grants };
