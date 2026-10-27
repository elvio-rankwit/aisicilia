// Helper SEO per i bandi (D-042): frasi su stato e scadenza, per chi è il bando, data di aggiornamento.
// Lo stato si calcola alla data di build (`grantStatus`): meta description, llms.txt e feed dicono quello del giorno di build,
// la ricostruzione notturna lo tiene allineato.
import { daysLeft, grantStatus, latestDate, today, type Grant } from '../data';
import { formatDay as formatDayRaw } from './dates';
import { lowerFirst } from './text';

/** "1 dicembre 2026" → "1° dicembre 2026" (il primo del mese si scrive con l'ordinale). */
export const formatGrantDay = (d: Date): string => formatDayRaw(d).replace(/^1 /, '1° ');

const strip = (s: string) => s.replace(/\[[^\]]*\]\s*/g, '').trim();
/** Titolo e ente senza i prefissi tra quadre delle fixture ("[FITTIZIO] …"), come per le aziende. */
export const grantTitle = (g: Grant): string => strip(g.data.title);
export const grantIssuer = (g: Grant): string => strip(g.data.issuer);

/** Ultimo aggiornamento di un bando: la più recente tra l'ultima verifica e l'approvazione. Serve a lastmod, dateModified, feed. */
export const grantUpdated = (g: Grant): Date => latestDate([g.data.last_verified, g.data.reviewed_at])!;

/**
 * Frase breve su stato e scadenza, con la maiuscola iniziale ("Scade il 30 novembre 2026", "Scade oggi",
 * "Apre il 12 gennaio 2027, scade il 28 febbraio 2027", "Aperto fino a esaurimento delle risorse", "Chiuso il 30 settembre 2026").
 * Mai una data che non c'è nel record.
 */
export function grantWhen(g: Grant, ref = today()): string {
  const d = g.data;
  const status = grantStatus(g, ref);
  if (status === 'chiuso') {
    if (d.closed_early) return 'Sportello chiuso per esaurimento fondi';
    return d.deadline ? `Chiuso il ${formatGrantDay(d.deadline)}` : 'Chiuso';
  }
  const note = d.deadline_note ? lowerFirst(d.deadline_note.replace(/[.\s]+$/, '')) : undefined;
  if (status === 'in apertura') {
    const opens = `Apre il ${formatGrantDay(d.opens_at!)}`;
    if (d.deadline) return `${opens}, scade il ${formatGrantDay(d.deadline)}`;
    return note ? `${opens}, ${note}` : opens;
  }
  if (d.deadline) return daysLeft(g, ref) === 0 ? 'Scade oggi' : `Scade il ${formatGrantDay(d.deadline)}`;
  return note ? `Aperto, ${note}` : 'Aperto, senza scadenza fissa';
}

/** "e", o "ed" davanti a una parola che comincia per e ("università e centri di ricerca ed enti del terzo settore"). */
const and = (next: string) => (/^e/i.test(next) ? 'ed' : 'e');

/** "micro e piccole imprese", "micro e piccole imprese e startup innovative", "micro e piccole imprese, startup innovative e altri". */
export function grantAudience(g: Grant, max = 2): string {
  // "micro e piccole imprese" + "medie imprese" → "micro, piccole e medie imprese" (PMI), che si legge meglio.
  let b: string[] = g.data.beneficiaries;
  if (b.includes('micro e piccole imprese') && b.includes('medie imprese'))
    b = ['micro, piccole e medie imprese', ...b.filter((x) => x !== 'micro e piccole imprese' && x !== 'medie imprese')];
  if (b.length === 1) return b[0];
  if (b.length === 2) return `${b[0]} ${and(b[1])} ${b[1]}`;
  if (max <= 1) return `${b[0]} e altri`;
  return b.length <= max ? `${b.slice(0, -1).join(', ')} ${and(b[b.length - 1])} ${b[b.length - 1]}` : `${b.slice(0, max).join(', ')} e altri`;
}

/** Tipi di agevolazione, con la maiuscola iniziale: "Fondo perduto", "Voucher e garanzia". */
export function grantAid(g: Grant, max = 2): string {
  const a = g.data.aid_types.slice(0, max);
  const text = a.length === 2 ? `${a[0]} ${and(a[1])} ${a[1]}` : a[0];
  return text[0].toUpperCase() + text.slice(1);
}
