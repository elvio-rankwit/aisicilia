// Title e meta description di ogni tipo di pagina. CONTRATTO: le pagine chiamano queste funzioni.
// Vincoli (li controlla `npm run validate`): title ≤ 60, description 70–155, entrambi unici nel sito,
// entità principale all'inizio, tono da persona (niente "Scopri…", niente elenchi di keyword).
// Casi limite gestiti: nomi lunghi (parentesi, virgole), 0 o 1 record, troncamento su parola o su frase.
import type { Article, Company, Event, Grant, Prompt } from '../data';
import { PROVINCES, type ProvinceSlug } from '../provinces';
import { PROMPT_SECTORS, type PromptSector } from '../taxonomies';
import { formatRange } from './dates';
import { grantAid, grantAudience, grantIssuer, grantTitle, grantWhen } from './grants';
import { baseName, clipWords, fitTitle, lowerFirst, padTo, shortName, summarize, trimAtBoundary } from './text';

export interface Meta { title: string; description: string }

export const META_LIMITS = { titleMax: 60, descMin: 70, descMax: 155 } as const;
const { titleMax: T, descMax: D } = META_LIMITS;

/** Etichetta della tipologia di azienda dentro una frase ("startup AI a Catania"). */
const TYPE_LABEL: Record<string, string> = {
  startup: 'startup',
  azienda: 'azienda',
  'spin-off universitario': 'spin-off universitario',
  'centro di ricerca': 'centro di ricerca',
  'incubatore/acceleratore': 'incubatore',
  'community/associazione': 'community',
};

const sectorLabel = (s: PromptSector) => PROMPT_SECTORS[s].toLowerCase();
/** "1 scheda verificata" / "17 schede verificate". */
const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const meta = {
  home: (): Meta => ({
    title: "AI Sicilia: aziende, eventi e guide sull'AI in Sicilia",
    description:
      "AI Sicilia raccoglie aziende ed eventi sull'intelligenza artificiale in Sicilia, con guide pratiche e prompt pronti da copiare per le imprese dell'isola.",
  }),

  companiesIndex: (n: number): Meta => ({
    title: 'Aziende e startup AI in Sicilia: mappa e directory',
    description:
      n === 0
        ? "La directory delle aziende AI in Sicilia è in costruzione: le prime schede, con mappa e fonti verificate, arrivano a breve."
        : `La directory delle aziende AI in Sicilia: ${count(n, 'scheda verificata', 'schede verificate')}, con mappa, filtri per provincia e le fonti di ogni dato.`,
  }),

  companiesProvince: (p: ProvinceSlug, n: number): Meta => {
    const name = PROVINCES[p].name;
    return {
      title: fitTitle([`Aziende AI in provincia di ${name}: mappa e schede`, `Aziende AI in provincia di ${name}`]),
      description:
        n === 0
          ? `Per ora nessuna azienda AI verificata in provincia di ${name}. Ne conosci una? Segnalala: controlliamo le fonti prima di pubblicarla.`
          : `${n === 1 ? '1 realtà verificata che lavora' : `${n} realtà verificate che lavorano`} con l'intelligenza artificiale in provincia di ${name}: ambiti AI, settori serviti, mappa e fonti.`,
    };
  },

  company: (c: Company): Meta => {
    const d = c.data;
    const name = d.name.replace(/\[[^\]]*\]\s*/g, '').trim();
    const base = baseName(name);
    const short = shortName(name);
    const label = TYPE_LABEL[d.type] ?? d.type;
    const title = fitTitle([
      `${name}: ${label} AI a ${d.city}`,
      `${name}: ${label} a ${d.city}`,
      `${base}: ${label} a ${d.city}`,
      `${short}: ${label} AI a ${d.city}`,
      `${short}: ${label} a ${d.city}`,
      `${base}, ${d.city}`,
      short,
    ], T);
    // L'entità sta all'inizio: se il testo non parte già dal nome, lo si premette.
    const startsWithName = d.description.toLowerCase().startsWith(short.toLowerCase());
    const prefix = startsWithName ? '' : `${short}: `;
    const body = summarize(d.description, D - prefix.length);
    const description = prefix + (startsWithName ? body : lowerFirst(body));
    return {
      title,
      description: padTo(description, [`Scheda con fonti e data dell'ultima verifica.`]),
    };
  },

  eventsIndex: (n: number): Meta => ({
    title: 'Eventi AI in Sicilia: calendario per provincia',
    description:
      n === 0
        ? "Nessun evento sull'AI in programma in Sicilia per ora. Qui trovi l'archivio di quelli passati e il modulo per segnalarne uno nuovo."
        : `${count(n, 'evento', 'eventi')} sull'intelligenza artificiale in programma in Sicilia, tra meetup, convegni, workshop e webinar, con date, luoghi e mappa.`,
  }),

  eventsProvince: (p: ProvinceSlug, n: number): Meta => {
    const name = PROVINCES[p].name;
    return {
      title: fitTitle([`Eventi AI in provincia di ${name}: date e luoghi`, `Eventi AI in provincia di ${name}`]),
      description:
        n === 0
          ? `Nessun evento sull'AI in programma in provincia di ${name} per ora. Ne conosci uno? Segnalalo, lo controlliamo e lo aggiungiamo.`
          : `${n === 1 ? '1 evento' : `${n} eventi`} sull'intelligenza artificiale in programma in provincia di ${name}, con date, luoghi e il link per iscriversi.`,
    };
  },

  eventsArchive: (n: number): Meta => ({
    title: 'Archivio degli eventi AI già svolti in Sicilia',
    description:
      n === 0
        ? "L'archivio degli eventi sull'AI in Sicilia è vuoto per ora: gli eventi conclusi vi finiscono dopo l'ultimo giorno."
        : `L'archivio degli eventi sull'AI in Sicilia: ${count(n, 'evento già svolto', 'eventi già svolti')}, con data, luogo, organizzatore e fonte.`,
  }),

  eventsNext: (n: number): Meta => ({
    title: 'Eventi AI in Sicilia nei prossimi 30 giorni',
    description:
      n === 0
        ? "Nei prossimi 30 giorni non ci sono eventi sull'AI in Sicilia nel calendario. Qui trovi i primi in programma dopo e come segnalarne uno."
        : `${count(n, 'evento', 'eventi')} sull'intelligenza artificiale in Sicilia nei prossimi 30 giorni, settimana per settimana, con prezzo, luogo e link per iscriversi.`,
  }),

  event: (e: Event): Meta => {
    const d = e.data;
    const title = fitTitle([d.title, trimAtBoundary(d.title, T)], T);
    const where =
      d.format === 'online' ? 'online' : d.format === 'ibrido' ? `${d.city} e online` : d.venue_name && d.venue_name.length <= 40 ? `${d.venue_name}, ${d.city}` : d.city;
    const status = d.status === 'annullato' ? 'Annullato. ' : d.status === 'rinviato' ? 'Rinviato. ' : d.status === 'spostato online' ? 'Spostato online. ' : '';
    const prefix = `${status}${formatRange(d.start_date, d.end_date)}, ${where}. `;
    return {
      title,
      description: padTo(prefix + summarize(d.description, D - prefix.length), [`Scheda con fonte e data di verifica.`]),
    };
  },

  // Bandi (D-042). Lo stato nelle description (scade, aperto, chiuso) è quello del giorno di build: la ricostruzione notturna lo aggiorna.
  grantsIndex: (n: number): Meta => ({
    title: 'Bandi AI per le imprese siciliane: aperti e in arrivo',
    description:
      n === 0
        ? "Per ora nessun bando sull'AI aperto alle imprese siciliane. Quando ce n'è uno compare qui, con scadenza e fonte ufficiale; si aggiorna ogni notte."
        : `${count(n, 'bando', 'bandi')} per progetti di intelligenza artificiale che le imprese siciliane possono chiedere ora o a breve, con scadenze, importi e fonti ufficiali.`,
  }),

  grantsClosed: (n: number): Meta => ({
    title: 'Archivio dei bandi AI chiusi per le imprese siciliane',
    description:
      n === 0
        ? "L'archivio dei bandi chiusi è vuoto per ora: un bando ci arriva il giorno dopo la scadenza, o quando lo sportello chiude per fondi esauriti."
        : `${count(n, 'bando chiuso', 'bandi chiusi')} per l'AI e il digitale in Sicilia, con ente, data di chiusura e fonte. Servono a capire cosa potrebbe tornare.`,
  }),

  grant: (g: Grant): Meta => {
    const d = g.data;
    // Titolo: il nome del bando; se è troppo lungo si taglia prima di una preposizione, tenendo l'anno se c'è ("… anno 2026").
    const name = grantTitle(g);
    const issuer = grantIssuer(g);
    const year = name.match(/\b(20\d{2})\s*$/)?.[1];
    const cut = trimAtBoundary(name, T);
    const short = year ? trimAtBoundary(name, T - 5) : '';
    const withYear = year && !cut.includes(year) && !short.endsWith('…') ? [`${short} ${year}`] : [];
    // Bandi omonimi di enti diversi (es. "Doppia Transizione 2026" di più Camere): l'ente in coda li distingue.
    const tail = `, ${issuer.replace(/^Camera di Commercio( di| del)?/, 'CCIAA')}`;
    const named = name.includes(issuer) ? [`${trimAtBoundary(name.replace(issuer, '').replace(/[,\s]+$/, ''), T - tail.length)}${tail}`] : [];
    const title = fitTitle([name, ...named, ...withYear, cut], T);
    // Description: ente e stato (o scadenza) subito, poi per chi è e che forma ha l'agevolazione.
    const lead = `${issuer}: ${lowerFirst(grantWhen(g))}.`;
    const forWhom = (max: number) => `${grantAid(g, 1)} per ${grantAudience(g, max)}.`;
    const amount = d.max_amount ? ` Importo: ${d.max_amount.replace(/[.\s]+$/, '')}.` : '';
    // Due topic della stessa call hanno ente, date e beneficiari uguali: senza un pezzo della descrizione
    // del record la meta description verrebbe duplicata.
    const own = (room: number) => (room > 40 ? ` ${summarize(d.description, room)}` : '');
    const candidates = [
      `${lead}${own(D - lead.length - 1)}`,
      `${lead} ${forWhom(2)}${amount}`,
      `${lead} ${forWhom(2)}`,
      `${lead} ${forWhom(1)}`,
      `${issuer}: ${lowerFirst(grantWhen(g))}. Per ${grantAudience(g, 1)}.`,
    ];
    const fit = candidates.find((c) => c.length <= D);
    const description = fit ?? clipWords(candidates[candidates.length - 1], D);
    return {
      title,
      description: padTo(description, [`Scheda con fonte ufficiale e data di verifica.`]),
    };
  },

  learnIndex: (): Meta => ({
    title: "Impara l'AI: guide pratiche per le imprese siciliane",
    description:
      "Guide sull'intelligenza artificiale per PMI, hotel, ristoranti, cantine e studi professionali: cosa può fare l'AI, cosa no e da dove partire.",
  }),

  article: (a: Article): Meta => ({
    title: a.data.seo_title ?? fitTitle([a.data.title, trimAtBoundary(a.data.title, T)], T),
    description: a.data.description,
  }),

  promptsIndex: (n: number): Meta => ({
    title: 'Prompt AI per settore: pronti da copiare',
    description:
      n === 0
        ? 'La libreria di prompt per le imprese siciliane è in preparazione: i primi, divisi per settore e con esempi, arrivano a breve.'
        : `${count(n, 'prompt', 'prompt')} da copiare per ospitalità, ristorazione, agroalimentare, commercio, turismo, studi professionali, artigianato ed edilizia.`,
  }),

  promptSector: (s: PromptSector, n: number): Meta => {
    const label = sectorLabel(s);
    return {
      title: fitTitle([`Prompt AI per ${label}: modelli da copiare`, `Prompt AI per ${label}`], T),
      description:
        n === 0
          ? `I prompt per ${label} sono in preparazione. Ogni prompt avrà esempio, variabili da compilare e avvertenze sui limiti dell'AI.`
          : `${count(n, 'prompt pronto', 'prompt pronti')} per ${label}: ognuno con un esempio compilato, le variabili da sostituire e le avvertenze d'uso.`,
    };
  },

  prompt: (p: Prompt): Meta => {
    const d = p.data;
    const title = fitTitle([d.title, trimAtBoundary(d.title, T)], T);
    const goal = summarize(d.goal, D);
    return {
      title,
      description: padTo(goal, [`Prompt pronto da copiare per ${sectorLabel(d.sector)}, con esempio e avvertenze.`]),
    };
  },
};

/** Per i test: verifica i vincoli su una coppia title/description. */
export function checkMeta(m: Meta): string[] {
  const out: string[] = [];
  if (m.title.length > T) out.push(`title di ${m.title.length} caratteri`);
  if (m.description.length < META_LIMITS.descMin || m.description.length > D) out.push(`description di ${m.description.length} caratteri`);
  return out;
}
