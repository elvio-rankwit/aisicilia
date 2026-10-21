// Linking interno (brief §9.4): funzioni pure usate dai template per i blocchi "correlati".
import type { Article, Company, Event, Prompt } from './data';
import type { ProvinceSlug } from './provinces';
import type { PromptSector } from './taxonomies';

const overlap = (a: readonly string[], b: readonly string[]) => a.filter((x) => b.includes(x)).length;

/** Altre aziende: stessa provincia, poi stesso ambito AI. */
export function relatedCompanies(c: Company, all: Company[], n = 4): Company[] {
  return all
    .filter((x) => x.id !== c.id)
    .map((x) => ({ x, s: (x.data.province === c.data.province ? 10 : 0) + overlap(x.data.ai_areas, c.data.ai_areas) * 2 + overlap(x.data.sectors_served, c.data.sectors_served) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ x }) => x);
}

/** Altri eventi: stessa provincia o stessi temi, preferendo quelli futuri passati in `pool`. */
export function relatedEvents(e: Event, pool: Event[], n = 3): Event[] {
  return pool
    .filter((x) => x.id !== e.id)
    .map((x) => ({ x, s: (x.data.province === e.data.province ? 10 : 0) + overlap(x.data.topics, e.data.topics) * 2 + overlap(x.data.audience, e.data.audience) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ x }) => x);
}

/** Prompt correlati a un articolo: prima quelli dichiarati, poi stessi settori. */
export function promptsForArticle(a: Article, prompts: Prompt[], n = 4): Prompt[] {
  const declared = prompts.filter((p) => a.data.related_prompts.includes(p.id));
  const bySector = prompts.filter((p) => !declared.includes(p) && (a.data.sectors as string[]).includes(p.data.sector));
  return [...declared, ...bySector].slice(0, n);
}

/** Articoli pertinenti a un settore di prompt (o generali). */
export function articlesForSector(s: PromptSector, articles: Article[], n = 3): Article[] {
  const own = articles.filter((a) => (a.data.sectors as string[]).includes(s));
  const general = articles.filter((a) => !own.includes(a) && a.data.sectors.includes('tutti'));
  return [...own, ...general].slice(0, n);
}

/** Articolo successivo nell'ordine di lettura (ciclico). */
export function nextArticle(a: Article, articles: Article[]): Article | undefined {
  if (articles.length < 2) return undefined;
  const i = articles.findIndex((x) => x.id === a.id);
  return articles[(i + 1) % articles.length];
}

/** Settori di prompt più vicini al tessuto economico di una provincia, ricavati dai dati reali. */
export function sectorsForProvince(p: ProvinceSlug, companies: Company[], events: Event[]): PromptSector[] {
  const map: Record<string, PromptSector> = {
    'turismo e ospitalità': 'ospitalita', agroalimentare: 'agroalimentare-vino', agricoltura: 'agroalimentare-vino',
    'commercio e retail': 'commercio-retail', 'edilizia e immobiliare': 'edilizia-immobiliare',
    manifattura: 'artigianato-manifattura', 'legale e professioni': 'studi-professionali',
  };
  const counts = new Map<PromptSector, number>();
  for (const c of companies.filter((x) => x.data.province === p)) {
    for (const s of c.data.sectors_served) if (map[s]) counts.set(map[s], (counts.get(map[s]) ?? 0) + 1);
  }
  void events;
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
  const fallback: PromptSector[] = ['ospitalita', 'agroalimentare-vino', 'ristorazione'];
  return [...new Set([...ranked, ...fallback])].slice(0, 3);
}
