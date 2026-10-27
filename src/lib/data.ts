// Accesso ai dati pubblicabili. Le pagine usano SOLO queste funzioni, mai getCollection diretto:
// qui stanno le regole editoriali (solo record verificati, YMYL nascosti, eventi passati in archivio).
import { getCollection, type CollectionEntry } from 'astro:content';
import { PROVINCE_SLUGS, type ProvinceSlug } from './provinces';
import { GRANT_STATUSES, PROMPT_SECTOR_SLUGS, type PromptSector } from './taxonomies';

export type Company = CollectionEntry<'companies'>;
export type Event = CollectionEntry<'events'>;
export type Article = CollectionEntry<'articles'>;
export type Prompt = CollectionEntry<'prompts'>;
export type Grant = CollectionEntry<'grants'>;
export type GrantStatus = (typeof GRANT_STATUSES)[number];

const collator = new Intl.Collator('it', { sensitivity: 'base' });

/** "Oggi" in Europe/Rome alla data di build, a mezzanotte UTC (stesso formato delle date dei dati). */
export function today(): Date {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
  return new Date(`${iso}T00:00:00Z`);
}

export async function getCompanies(): Promise<Company[]> {
  const all = await getCollection('companies', (c) => c.data.verification_status === 'verified');
  // Prima le schede in evidenza (D-025), poi ordine alfabetico.
  return all.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || collator.compare(a.data.name, b.data.name));
}

export async function getAllEvents(): Promise<Event[]> {
  const all = await getCollection('events', (e) => e.data.verification_status === 'verified');
  return all.sort((a, b) => a.data.start_date.getTime() - b.data.start_date.getTime());
}

/** Un evento è concluso quando la sua ultima giornata è precedente a oggi. */
export function isPast(e: Event, ref = today()): boolean {
  const last = e.data.end_date ?? e.data.start_date;
  return last.getTime() < ref.getTime();
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return (await getAllEvents()).filter((e) => !isPast(e));
}

/** Finestra della pagina /eventi/prossimi/. */
export const NEXT_DAYS = 30;

/** Eventi in corso o che iniziano entro `days` giorni da oggi. */
export async function getNextEvents(days = NEXT_DAYS): Promise<Event[]> {
  const limit = today().getTime() + days * 86_400_000;
  return (await getUpcomingEvents()).filter((e) => e.data.start_date.getTime() <= limit);
}

/** Archivio: dal più recente al più vecchio. */
export async function getPastEvents(): Promise<Event[]> {
  return (await getAllEvents()).filter((e) => isPast(e)).reverse();
}

/** Gli eventi che si ripetono hanno una pagina stabile per tutte le edizioni (D-039): /eventi/<series>/. */
export const eventKey = (e: Event): string => e.data.series ?? e.id;
export const eventPath = (e: Event): string => `/eventi/${eventKey(e)}/`;

export interface EventPage {
  key: string;
  /** Edizione in evidenza: la prossima in programma, altrimenti l'ultima svolta. */
  event: Event;
  /** Tutte le edizioni pubblicate, dalla più recente. */
  editions: Event[];
}

export async function getEventPages(): Promise<EventPage[]> {
  const groups = new Map<string, Event[]>();
  for (const e of await getAllEvents()) groups.set(eventKey(e), [...(groups.get(eventKey(e)) ?? []), e]);
  return [...groups.entries()].map(([key, list]) => ({
    key,
    event: list.find((e) => !isPast(e)) ?? list[list.length - 1],
    editions: [...list].reverse(),
  }));
}

/** Articoli visibili: quelli YMYL (needs_human_review: true) restano fuori finché non approvati. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles', (a) => !a.data.needs_human_review);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPrompts(): Promise<Prompt[]> {
  const all = await getCollection('prompts');
  return all.sort(
    (a, b) =>
      PROMPT_SECTOR_SLUGS.indexOf(a.data.sector) - PROMPT_SECTOR_SLUGS.indexOf(b.data.sector) ||
      collator.compare(a.data.title, b.data.title),
  );
}

export async function getPromptsBySector(sector: PromptSector): Promise<Prompt[]> {
  return (await getPrompts()).filter((p) => p.data.sector === sector);
}

// ------------------------------------------------------------------ bandi (D-042)
/** Bandi pubblicabili: verificati e approvati dall'utente (YMYL). */
export async function getAllGrants(): Promise<Grant[]> {
  return getCollection('grants', (g) => g.data.verification_status === 'verified' && !g.data.needs_human_review);
}

/** Stato alla data di build: il giorno della scadenza il bando è ancora aperto. */
export function grantStatus(g: Grant, ref = today()): GrantStatus {
  const d = g.data;
  if (d.closed_early || (d.deadline && d.deadline.getTime() < ref.getTime())) return 'chiuso';
  if (d.opens_at && d.opens_at.getTime() > ref.getTime()) return 'in apertura';
  return 'aperto';
}

/** Giorni alla scadenza (0 = scade oggi); undefined per gli sportelli senza scadenza. */
export function daysLeft(g: Grant, ref = today()): number | undefined {
  return g.data.deadline ? Math.round((g.data.deadline.getTime() - ref.getTime()) / 86_400_000) : undefined;
}

export const grantPath = (g: Grant): string => `/bandi/${g.id}/`;

/** Aperti e in apertura: prima chi scade prima, in fondo gli sportelli senza scadenza. */
export async function getOpenGrants(): Promise<Grant[]> {
  const far = Number.MAX_SAFE_INTEGER;
  return (await getAllGrants())
    .filter((g) => grantStatus(g) !== 'chiuso')
    .sort((a, b) => (a.data.deadline?.getTime() ?? far) - (b.data.deadline?.getTime() ?? far) || collator.compare(a.data.title, b.data.title));
}

/** Chiusi: dal più recente. */
export async function getClosedGrants(): Promise<Grant[]> {
  return (await getAllGrants())
    .filter((g) => grantStatus(g) === 'chiuso')
    .sort((a, b) => (b.data.deadline?.getTime() ?? 0) - (a.data.deadline?.getTime() ?? 0));
}

export function groupByProvince<T extends { data: { province: ProvinceSlug } }>(items: T[]) {
  const out = Object.fromEntries(PROVINCE_SLUGS.map((p) => [p, [] as T[]])) as Record<ProvinceSlug, T[]>;
  for (const item of items) out[item.data.province].push(item);
  return out;
}

/** Data più recente tra quelle passate: usata per "aggiornato il" e lastmod. */
export function latestDate(dates: (Date | undefined)[]): Date | undefined {
  return dates.filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0];
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
