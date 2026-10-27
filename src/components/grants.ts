// Funzioni pure per la presentazione dei bandi (D-042): etichette di stato, scadenza, territorio, attributi dei filtri.
// Lo stato e i giorni che mancano vengono da src/lib/data.ts (calcolati alla data di build).
import { daysLeft, grantStatus, today, type Grant } from '../lib/data';
import { PROVINCES, PROVINCE_SLUGS } from '../lib/provinces';
import { dateRange, slugify } from './helpers';

export type GrantTone = 'ok' | 'accent' | 'plain';

/** Slug che non possono essere usati come scheda perché collidono con rotte fisse. */
export const GRANT_RESERVED_SLUGS = ['chiusi'];

const fShort = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fShortYear = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
/** "16 nov" (con l'anno se non è quello in corso). */
export const shortDate = (d: Date): string => (d.getUTCFullYear() === today().getUTCFullYear() ? fShort : fShortYear).format(d);

export interface GrantState { key: 'aperto' | 'in-apertura' | 'chiuso'; label: string; tone: GrantTone }

export function grantState(g: Grant): GrantState {
  const s = grantStatus(g);
  if (s === 'aperto') return { key: 'aperto', label: 'Aperto', tone: 'ok' };
  if (s === 'in apertura') return { key: 'in-apertura', label: `In apertura dal ${shortDate(g.data.opens_at!)}`, tone: 'accent' };
  // `grantStatus` dà 'chiuso' anche per gli sportelli chiusi prima della scadenza: qui l'etichetta li distingue.
  return { key: 'chiuso', label: g.data.closed_early ? 'Chiuso in anticipo' : 'Chiuso', tone: 'plain' };
}

/** Procedura: etichetta e mezza riga di spiegazione (deck bandi §2.1). */
export const PROCEDURE_NOTES: Record<string, { label: string; note: string }> = {
  'a sportello': { label: 'A sportello.', note: 'Conta l’ordine di arrivo delle domande.' },
  graduatoria: { label: 'Graduatoria.', note: 'Le domande si valutano dopo la scadenza.' },
  'click day': { label: 'Click day.', note: 'Si apre a un’ora precisa e conta l’ordine di invio.' },
  'call con scadenza': { label: 'Call con scadenza.', note: 'Le domande si valutano dopo la chiusura.' },
};

/** Rapporto con l'AI: etichetta e spiegazione (deck bandi §2.4). */
export const AI_FIT_NOTES: Record<string, { label: string; note: string }> = {
  "dedicato all'AI": { label: 'Dedicato all’AI.', note: 'Il bando riguarda l’intelligenza artificiale, in modo esplicito.' },
  'AI tra le spese ammesse': { label: 'AI tra le spese ammesse.', note: 'Il bando finanzia più tecnologie e il testo nomina l’AI nell’elenco.' },
  'innovazione digitale': { label: 'Innovazione digitale.', note: 'Il bando non è pensato per l’AI: finanzia progetti digitali o di innovazione, e un progetto di AI può rientrarci. Se la tua spesa sia ammessa lo decide l’ente: chiedi per iscritto prima di comprare.' },
};

/** "mancano 17 giorni", "scade domani", "scade oggi". */
export const countdown = (n: number): string => (n <= 0 ? 'scade oggi' : n === 1 ? 'scade domani' : `mancano ${n} giorni`);

/** Un bando aperto che scade entro `days` giorni (oggi compreso). */
export function expiresWithin(g: Grant, days = 30): boolean {
  const n = daysLeft(g);
  return grantStatus(g) === 'aperto' && n !== undefined && n >= 0 && n <= days;
}

/** "12 novembre 2026, ore 14:00" */
export function deadlineText(g: Grant): string | undefined {
  const d = g.data;
  return d.deadline ? `${dateRange(d.deadline)}${d.deadline_time ? `, ore ${d.deadline_time}` : ''}` : undefined;
}

/** Riga di scadenza per le schede: data e conto alla rovescia, oppure la nota della fonte. */
export function deadlineLine(g: Grant): { text: string; left?: string; urgent: boolean } {
  const d = g.data;
  const state = grantState(g);
  const when = deadlineText(g);
  if (state.key === 'chiuso') {
    if (d.closed_early) return { text: d.deadline_note ?? 'Sportello chiuso prima della scadenza', urgent: false };
    return { text: when ? `Scaduto il ${when}` : (d.deadline_note ?? 'Chiuso'), urgent: false };
  }
  if (!when) return { text: d.deadline_note ?? '', urgent: false };
  const n = daysLeft(g)!;
  return { text: when, left: state.key === 'aperto' ? countdown(n) : undefined, urgent: state.key === 'aperto' && n <= 30 };
}

/** "a, b e c", con «ed» davanti a una parola che inizia per e ("università ed enti"). */
export function joinList(list: readonly string[]): string {
  if (list.length <= 1) return list[0] ?? '';
  const last = list[list.length - 1];
  return `${list.slice(0, -1).join(', ')} ${/^e/i.test(last) ? 'ed' : 'e'} ${last}`;
}

/** Elenco di province in italiano: "Catania, Ragusa e Siracusa". */
export const provinceList = (g: Grant): string => joinList(g.data.provinces.map((p) => PROVINCES[p].name));

/** Territorio in forma breve (schede e filtri). */
export const territoryShort = (g: Grant): string =>
  g.data.provinces.length ? provinceList(g) : g.data.scope === 'nazionale' ? 'Tutta Italia' : g.data.scope === 'europeo' ? 'Unione europea' : 'Tutta la Sicilia';

/** Territorio in forma estesa (dati chiave della scheda). */
export function territoryLong(g: Grant): string {
  const d = g.data;
  if (d.provinces.length) return `${d.provinces.length === 1 ? 'Provincia' : 'Province'} di ${provinceList(g)}`;
  if (d.scope === 'nazionale') return 'Bando nazionale, aperto anche a chi ha sede in Sicilia';
  if (d.scope === 'europeo') return 'Bando europeo, aperto anche a chi ha sede in Sicilia';
  return 'Tutta la Sicilia';
}

/** Valori del filtro «territorio»: un bando senza limiti vale per ogni provincia, e per «tutta la Sicilia». */
export const territoryTokens = (g: Grant): string =>
  (g.data.provinces.length ? g.data.provinces : ['tutta-la-sicilia', ...PROVINCE_SLUGS]).join(' ');

export const tokens = (list: readonly string[]): string => list.map(slugify).join(' ');

/** Due bandi condividono territorio se entrambi valgono ovunque o se hanno una provincia in comune. */
export function sameTerritory(a: Grant, b: Grant): boolean {
  if (!a.data.provinces.length && !b.data.provinces.length) return true;
  if (!a.data.provinces.length || !b.data.provinces.length) return false;
  return a.data.provinces.some((p) => b.data.provinces.includes(p));
}

/** Altri bandi aperti affini: stesso territorio o stessi beneficiari, poi stesso tipo di agevolazione. Al massimo `n`. */
export function relatedGrants(g: Grant, pool: Grant[], n = 3): Grant[] {
  const overlap = (a: readonly string[], b: readonly string[]) => a.filter((x) => b.includes(x)).length;
  return pool
    .filter((x) => x.id !== g.id)
    .map((x) => ({ x, s: (sameTerritory(g, x) ? 4 : 0) + overlap(x.data.beneficiaries, g.data.beneficiaries) * 3 + overlap(x.data.aid_types, g.data.aid_types) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ x }) => x);
}
