// Title e meta description di ogni tipo di pagina. CONTRATTO di Fase 0:
// le pagine chiamano queste funzioni; il seo-geo-engineer riscrive i template (Fase 2)
// rispettando: title ≤ 60, description 70–155, unici, scritti come li scriverebbe una persona.
import type { Article, Company, Event, Prompt } from '../data';
import { PROVINCES, type ProvinceSlug } from '../provinces';
import { PROMPT_SECTORS, type PromptSector } from '../taxonomies';

export interface Meta { title: string; description: string }

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

export const meta = {
  home: (): Meta => ({
    title: "AI Sicilia: aziende, eventi e guide sull'AI in Sicilia",
    description: "Chi fa intelligenza artificiale in Sicilia, gli eventi in programma per provincia, guide pratiche e prompt pronti per le imprese dell'isola.",
  }),
  companiesIndex: (count: number): Meta => ({
    title: 'Aziende e startup AI in Sicilia: la mappa',
    description: `${count} aziende, startup e centri di ricerca siciliani che lavorano sull'intelligenza artificiale, con mappa, filtri per provincia e fonti verificate.`,
  }),
  companiesProvince: (p: ProvinceSlug, count: number): Meta => ({
    title: `Aziende AI in provincia di ${PROVINCES[p].name}`,
    description: `Le realtà che lavorano sull'intelligenza artificiale in provincia di ${PROVINCES[p].name}: ${count} schede verificate, mappa ed eventi in zona.`,
  }),
  company: (c: Company): Meta => ({
    title: clip(`${c.data.name}, ${c.data.type} AI a ${c.data.city}`, 60),
    description: clip(c.data.description, 155),
  }),
  eventsIndex: (count: number): Meta => ({
    title: 'Eventi AI in Sicilia: calendario per provincia',
    description: `${count} eventi in programma sull'intelligenza artificiale in Sicilia: meetup, convegni, workshop e webinar, con mappa e filtri.`,
  }),
  eventsProvince: (p: ProvinceSlug, count: number): Meta => ({
    title: `Eventi AI in provincia di ${PROVINCES[p].name}`,
    description: `Eventi sull'intelligenza artificiale in provincia di ${PROVINCES[p].name}: ${count} in programma, con date, luoghi e link per iscriversi.`,
  }),
  eventsArchive: (count: number): Meta => ({
    title: 'Archivio eventi AI in Sicilia',
    description: `${count} eventi sull'intelligenza artificiale già svolti in Sicilia, con date, organizzatori e luoghi.`,
  }),
  event: (e: Event): Meta => ({
    title: clip(e.data.title, 60),
    description: clip(e.data.description, 155),
  }),
  learnIndex: (): Meta => ({
    title: "Impara l'AI: guide pratiche per le imprese siciliane",
    description: "Guide sull'intelligenza artificiale per PMI, hotel, ristoranti, cantine e studi professionali: casi d'uso concreti, limiti e azioni da fare subito.",
  }),
  article: (a: Article): Meta => ({
    title: a.data.seo_title ?? clip(a.data.title, 60),
    description: a.data.description,
  }),
  promptsIndex: (count: number): Meta => ({
    title: 'Prompt AI per settore: pronti da copiare',
    description: `${count} prompt per ospitalità, ristorazione, agroalimentare, commercio, turismo, studi professionali, artigianato ed edilizia.`,
  }),
  promptSector: (s: PromptSector, count: number): Meta => ({
    title: `Prompt AI per ${PROMPT_SECTORS[s].toLowerCase()}`,
    description: `${count} prompt pronti da copiare per ${PROMPT_SECTORS[s].toLowerCase()}, con esempi, variabili da compilare e avvertenze.`,
  }),
  prompt: (p: Prompt): Meta => ({
    title: clip(p.data.title, 60),
    description: clip(p.data.goal, 155),
  }),
};
