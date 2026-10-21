// Accesso ai dati pubblicabili. Le pagine usano SOLO queste funzioni, mai getCollection diretto:
// qui stanno le regole editoriali (solo record verificati, YMYL nascosti, eventi passati in archivio).
import { getCollection, type CollectionEntry } from 'astro:content';
import { PROVINCE_SLUGS, type ProvinceSlug } from './provinces';
import { PROMPT_SECTOR_SLUGS, type PromptSector } from './taxonomies';

export type Company = CollectionEntry<'companies'>;
export type Event = CollectionEntry<'events'>;
export type Article = CollectionEntry<'articles'>;
export type Prompt = CollectionEntry<'prompts'>;

const collator = new Intl.Collator('it', { sensitivity: 'base' });

/** "Oggi" in Europe/Rome alla data di build, a mezzanotte UTC (stesso formato delle date dei dati). */
export function today(): Date {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date());
  return new Date(`${iso}T00:00:00Z`);
}

export async function getCompanies(): Promise<Company[]> {
  const all = await getCollection('companies', (c) => c.data.verification_status === 'verified');
  return all.sort((a, b) => collator.compare(a.data.name, b.data.name));
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

/** Archivio: dal più recente al più vecchio. */
export async function getPastEvents(): Promise<Event[]> {
  return (await getAllEvents()).filter((e) => isPast(e)).reverse();
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
