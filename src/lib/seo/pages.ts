// Registro delle pagine del sito per sitemap, immagini OG e llms.txt.
// Replica le rotte di src/pages/ usando le stesse funzioni di data.ts: se si aggiunge una rotta, va aggiunta qui
// (la verifica `dist/` ↔ registro è nello script di controllo del report).
import {
  getAllEvents, getArticles, getCompanies, getPastEvents, getPrompts, getUpcomingEvents, latestDate,
} from '../data';
import { LIST_PAGE_SIZE, PAGINATE_OVER, RESERVED_SLUGS } from '../../components/helpers';
import { PROVINCE_SLUGS, PROVINCES } from '../provinces';
import { PROMPT_SECTORS, PROMPT_SECTOR_SLUGS } from '../taxonomies';
import type { SitemapSegment } from './config';
import { formatRange } from './dates';
import { normalizePath } from './url';

export type PageKind =
  | 'home' | 'hub' | 'province' | 'list-page' | 'company' | 'event' | 'article' | 'prompt-sector' | 'prompt' | 'static';

export interface OgContent {
  /** Riga in piccolo sopra il titolo (sezione). */
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export interface SitePage {
  path: string;
  kind: PageKind;
  segment: SitemapSegment;
  /** false per le pagine noindex anche in production (ricerca, 404): niente sitemap. */
  indexable: boolean;
  /** Data reale dai dati; assente per le pagine senza una data di contenuto. */
  lastmod?: Date;
  og: OgContent;
}

const cleanName = (s: string) => s.replace(/\[[^\]]*\]\s*/g, '').trim();
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

let cache: Promise<SitePage[]> | undefined;
export const getSitePages = (): Promise<SitePage[]> => (cache ??= build());

/** Solo i path (ordine stabile). */
export const allPagePaths = async (): Promise<string[]> => (await getSitePages()).map((p) => p.path);

async function build(): Promise<SitePage[]> {
  const [companies, allEvents, upcoming, past, articles, prompts] = await Promise.all([
    getCompanies(), getAllEvents(), getUpcomingEvents(), getPastEvents(), getArticles(), getPrompts(),
  ]);
  const pages: SitePage[] = [];
  const add = (p: Omit<SitePage, 'path'> & { path: string }) => pages.push({ ...p, path: normalizePath(p.path) });

  const cDate = (list: typeof companies) => latestDate(list.map((c) => c.data.last_verified));
  const eDate = (list: typeof allEvents) => latestDate(list.map((e) => e.data.last_verified));
  const globalLast = latestDate([
    cDate(companies), eDate(allEvents),
    latestDate(articles.map((a) => a.data.updated_at)), latestDate(prompts.map((p) => p.data.tested_at)),
  ]);

  // Home
  add({ path: '/', kind: 'home', segment: 'pagine', indexable: true, lastmod: globalLast,
    og: { eyebrow: 'Progetto indipendente', title: "L'intelligenza artificiale in Sicilia", subtitle: 'Aziende, eventi, guide e prompt per le imprese' } });

  // Aziende
  add({ path: '/aziende/', kind: 'hub', segment: 'pagine', indexable: true, lastmod: cDate(companies),
    og: { eyebrow: 'Aziende', title: 'Aziende e startup AI in Sicilia', subtitle: `${companies.length} schede verificate, con mappa` } });
  if (companies.length > PAGINATE_OVER) {
    const total = Math.ceil(companies.length / LIST_PAGE_SIZE);
    for (let n = 2; n <= total; n++) {
      add({ path: `/aziende/pagina/${n}/`, kind: 'list-page', segment: 'pagine', indexable: true, lastmod: cDate(companies),
        og: { eyebrow: 'Aziende', title: `Aziende e startup AI in Sicilia, pagina ${n}` } });
    }
  }
  for (const p of PROVINCE_SLUGS) {
    const inProv = companies.filter((c) => c.data.province === p);
    add({ path: `/aziende/provincia/${p}/`, kind: 'province', segment: 'pagine', indexable: true, lastmod: cDate(inProv),
      og: { eyebrow: 'Aziende', title: `Aziende AI in provincia di ${PROVINCES[p].name}`, subtitle: `${inProv.length} schede verificate` } });
  }
  for (const c of companies.filter((x) => !RESERVED_SLUGS.includes(x.id))) {
    add({ path: `/aziende/${c.id}/`, kind: 'company', segment: 'aziende', indexable: true, lastmod: c.data.last_verified,
      og: { eyebrow: `Azienda · ${PROVINCES[c.data.province].name}`, title: cleanName(c.data.name), subtitle: `${cap(c.data.type)} a ${c.data.city}` } });
  }

  // Eventi
  add({ path: '/eventi/', kind: 'hub', segment: 'pagine', indexable: true, lastmod: eDate(upcoming),
    og: { eyebrow: 'Eventi', title: 'Eventi AI in Sicilia', subtitle: 'Calendario per provincia, con mappa' } });
  for (const p of PROVINCE_SLUGS) {
    const inProv = upcoming.filter((e) => e.data.province === p);
    add({ path: `/eventi/provincia/${p}/`, kind: 'province', segment: 'pagine', indexable: true, lastmod: eDate(inProv),
      og: { eyebrow: 'Eventi', title: `Eventi AI in provincia di ${PROVINCES[p].name}`, subtitle: 'Date, luoghi e iscrizioni' } });
  }
  add({ path: '/eventi/archivio/', kind: 'hub', segment: 'pagine', indexable: true, lastmod: eDate(past),
    og: { eyebrow: 'Eventi', title: 'Archivio degli eventi AI in Sicilia', subtitle: 'Gli eventi già svolti' } });
  if (past.length > PAGINATE_OVER) {
    const total = Math.ceil(past.length / LIST_PAGE_SIZE);
    for (let n = 2; n <= total; n++) {
      add({ path: `/eventi/archivio/pagina/${n}/`, kind: 'list-page', segment: 'pagine', indexable: true, lastmod: eDate(past),
        og: { eyebrow: 'Eventi', title: `Archivio degli eventi AI in Sicilia, pagina ${n}` } });
    }
  }
  for (const e of allEvents.filter((x) => !RESERVED_SLUGS.includes(x.id))) {
    add({ path: `/eventi/${e.id}/`, kind: 'event', segment: 'eventi', indexable: true, lastmod: e.data.last_verified,
      og: { eyebrow: `Evento · ${PROVINCES[e.data.province].name}`, title: e.data.title, subtitle: `${formatRange(e.data.start_date, e.data.end_date)} · ${e.data.format === 'online' ? 'online' : e.data.city}` } });
  }

  // Impara
  add({ path: '/impara/', kind: 'hub', segment: 'pagine', indexable: true, lastmod: latestDate(articles.map((a) => a.data.updated_at)),
    og: { eyebrow: 'Impara', title: "Impara l'AI: guide per le imprese siciliane", subtitle: 'Casi d’uso concreti, limiti e cosa fare subito' } });
  for (const a of articles.filter((x) => !RESERVED_SLUGS.includes(x.id))) {
    add({ path: `/impara/${a.id}/`, kind: 'article', segment: 'articoli', indexable: true, lastmod: a.data.updated_at,
      og: { eyebrow: 'Guida', title: a.data.title, subtitle: `${cap(a.data.level)} · ${a.data.reading_time} min di lettura` } });
  }

  // Prompt
  add({ path: '/prompt/', kind: 'hub', segment: 'pagine', indexable: true, lastmod: latestDate(prompts.map((p) => p.data.tested_at)),
    og: { eyebrow: 'Prompt', title: 'Prompt AI per settore, pronti da copiare', subtitle: `${prompts.length} prompt testati` } });
  for (const s of PROMPT_SECTOR_SLUGS) {
    const inSector = prompts.filter((p) => p.data.sector === s);
    add({ path: `/prompt/${s}/`, kind: 'prompt-sector', segment: 'pagine', indexable: true, lastmod: latestDate(inSector.map((p) => p.data.tested_at)),
      og: { eyebrow: 'Prompt', title: `Prompt AI per ${PROMPT_SECTORS[s].toLowerCase()}`, subtitle: `${inSector.length} prompt da copiare` } });
  }
  for (const p of prompts) {
    add({ path: `/prompt/${p.data.sector}/${p.id}/`, kind: 'prompt', segment: 'prompt', indexable: true, lastmod: p.data.tested_at,
      og: { eyebrow: `Prompt · ${PROMPT_SECTORS[p.data.sector]}`, title: p.data.title, subtitle: cap(p.data.use_case) } });
  }

  // Pagine istituzionali e di servizio
  const staticPage = (path: string, title: string, subtitle: string, extra: Partial<SitePage> = {}) =>
    add({ path, kind: 'static', segment: 'pagine', indexable: true, og: { eyebrow: 'AI Sicilia', title, subtitle }, ...extra });
  staticPage('/chi-siamo/', 'Chi siamo: Elvio Leonardi e AI Sicilia', 'Consulente SEO e GEO a Palermo');
  staticPage('/metodologia/', 'Come verifichiamo i dati', 'Fonti, criteri e date di verifica', { lastmod: latestDate([cDate(companies), eDate(allEvents)]) });
  staticPage('/segnala/', "Segnala un'azienda o un evento", 'Controlliamo le fonti prima di pubblicare');
  staticPage('/rimozione/', 'Modifica o rimozione di una scheda', 'Pubblichiamo solo dati aziendali');
  staticPage('/contatti/', 'Contatti', 'Scrivi ad AI Sicilia');
  staticPage('/privacy/', 'Informativa privacy', 'Nessun cookie, nessuno strumento di analisi');
  staticPage('/note-legali/', 'Note legali', 'Natura del progetto e responsabilità');
  staticPage('/cerca/', 'Cerca nel sito', 'Aziende, eventi, guide e prompt', { indexable: false });
  add({ path: '/404/', kind: 'static', segment: 'pagine', indexable: false, og: { eyebrow: 'AI Sicilia', title: 'Pagina non trovata', subtitle: 'Prova con la ricerca' } });

  return pages;
}
