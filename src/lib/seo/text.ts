// Utilità di testo per meta title e description: troncamenti su parola, frasi intere, nessun elenco di keyword.

/** Taglia su parola e chiude con "…" (un solo carattere). */
export function clipWords(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  let cut = t.slice(0, max - 1);
  if (!/\s/.test(t[max - 1])) cut = cut.replace(/\s+\S*$/, '');
  return cut.replace(/[\s,;:.\-–(]+$/, '') + '…';
}

/** Prima lettera minuscola se la parola è comune ("Startup" → "startup"), invariata per sigle e nomi ("AIM", "CNR"). */
export const lowerFirst = (s: string): string => (/^[A-ZÀ-Ý][a-zà-ÿ]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

/** Nome senza gruppi tra parentesi e senza prefissi tra quadre: "Lab (Università di Palermo)" → "Lab". */
export const baseName = (name: string): string =>
  name.replace(/\[[^\]]*\]\s*/g, '').replace(/\s*\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();

/** Nome breve: tutto ciò che precede la prima virgola o parentesi. */
export const shortName = (name: string): string => baseName(name).split(',')[0].trim();

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9“"«])/;

/**
 * Riassume un testo in `max` caratteri: frasi intere finché ci stanno; se la prima è troppo lunga,
 * taglia all'ultima virgola/due punti utile e chiude con il punto; in ultima istanza taglia su parola.
 */
export function summarize(text: string, max: number, min = 60): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const sentences = clean.split(SENTENCE_SPLIT);
  let out = '';
  for (const s of sentences) {
    const next = out ? `${out} ${s}` : s;
    if (next.length > max) break;
    out = next;
  }
  if (out.length >= min) return out;
  const head = clean.slice(0, max);
  const cut = Math.max(head.lastIndexOf(', '), head.lastIndexOf('; '), head.lastIndexOf(': '));
  if (cut >= min) return head.slice(0, cut).replace(/[\s,;:]+$/, '') + '.';
  return clipWords(clean, max);
}

/** Taglia un titolo lungo prima di una preposizione/congiunzione, senza puntini: "…cantiere in un verbale…" → "…cantiere". */
export function trimAtBoundary(title: string, max: number, minLeft = 25): string {
  if (title.length <= max) return title;
  const re = / (?=(?:con|per|e|in|da|di|del|della|dei|che|senza|prima|dopo|tra|fra|a|al|alla|nel|nella) )|[,:;–-] /g;
  let best = -1;
  for (const m of title.matchAll(re)) {
    if (m.index !== undefined && m.index >= minLeft && m.index <= max) best = m.index;
  }
  if (best === -1) return clipWords(title, max);
  return title.slice(0, best).replace(/[\s,;:–-]+$/, '');
}

/** Primo candidato che sta in `max`; se nessuno ci sta, taglia il primo su parola. */
export const fitTitle = (candidates: string[], max = 60): string =>
  candidates.find((c) => c.length <= max) ?? clipWords(candidates[0], max);

/** Aggiunge frasi di riempimento finché la description raggiunge `min` senza superare `max`. */
export function padTo(desc: string, extras: string[], min = 70, max = 155): string {
  let out = desc;
  for (const e of extras) {
    if (out.length >= min) break;
    if ((out + ' ' + e).length <= max) out = `${out} ${e}`;
  }
  return out;
}
