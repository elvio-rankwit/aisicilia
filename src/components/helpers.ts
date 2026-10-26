// Funzioni pure condivise dai componenti e dalle pagine (formati, etichette, slug dei filtri).
// Non sta in src/lib/ (non è del frontend-builder): qui vive solo la presentazione.
import type { Company, Event } from '../lib/data';
import { eventPath, isPast } from '../lib/data';
import { PROVINCES, PROVINCE_SLUGS, type ProvinceSlug } from '../lib/provinces';
import { PROMPT_SECTORS, type PromptSector } from '../lib/taxonomies';

/** Dimensione delle pagine nelle liste lunghe (D-014) e soglia oltre la quale si impagina. */
export const LIST_PAGE_SIZE = 48;
export const PAGINATE_OVER = 100;
/** Slug che non possono essere usati come scheda perché collidono con rotte fisse. */
export const RESERVED_SLUGS = ['provincia', 'pagina', 'archivio', 'prossimi'];

export const slugify = (s: string): string =>
  s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export const cap = (s: string): string => (s ? s[0].toUpperCase() + s.slice(1) : s);

export const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;

export const clip = (s: string, n: number): string =>
  s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,;:.]+\S*$/, '') + '…';

/** Nome senza eventuali prefissi tra parentesi quadre (es. segnaposto delle fixture). */
export const cleanName = (s: string): string => s.replace(/\[[^\]]*\]\s*/g, '').trim() || s;

export const initials = (name: string): string => {
  const words = cleanName(name).split(/[\s\-/&]+/).filter((w) => /\p{L}/u.test(w));
  const letters = words.slice(0, 2).map((w) => (w.match(/\p{L}/u) ?? [''])[0]);
  return (letters.join('') || '?').toUpperCase();
};

/** Tono del badge con iniziali: stabile per nome, 4 varianti. */
export const toneOf = (key: string): number => [...key].reduce((a, c) => (a + c.charCodeAt(0)) % 4, 0);

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('it-IT', { ...opts, timeZone: 'UTC' });
const fDay = fmt({ day: 'numeric' });
const fDayMonth = fmt({ day: 'numeric', month: 'long' });
const fFull = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
const fWeekday = fmt({ weekday: 'long' });

/** "12 marzo 2027", "12–14 marzo 2027", "30 marzo – 2 aprile 2027". */
export function dateRange(start: Date, end?: Date): string {
  if (!end || end.getTime() === start.getTime()) return fFull.format(start);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  if (sameMonth) return `${fDay.format(start)}–${fFull.format(end)}`;
  if (sameYear) return `${fDayMonth.format(start)} – ${fFull.format(end)}`;
  return `${fFull.format(start)} – ${fFull.format(end)}`;
}

export const weekdayOf = (d: Date): string => fWeekday.format(d);

export const timeRange = (start?: string, end?: string): string =>
  start ? (end ? `${start}–${end}` : start) : '';

export const isoDay = (d: Date): string => d.toISOString().slice(0, 10);
export const monthKey = (d: Date): string => d.toISOString().slice(0, 7);
export const monthLabel = (key: string): string =>
  fmt({ month: 'long', year: 'numeric' }).format(new Date(`${key}-01T00:00:00Z`));

/** Tutti i mesi (YYYY-MM) toccati da un evento. */
export function eventMonths(e: Event): string[] {
  const first = e.data.start_date;
  const last = e.data.end_date ?? first;
  const out: string[] = [];
  let y = first.getUTCFullYear();
  let m = first.getUTCMonth();
  while (y < last.getUTCFullYear() || (y === last.getUTCFullYear() && m <= last.getUTCMonth())) {
    out.push(`${y}-${String(m + 1).padStart(2, '0')}`);
    m += 1;
    if (m > 11) { m = 0; y += 1; }
    if (out.length > 24) break;
  }
  return out;
}

export type StatusTone = 'ok' | 'warn' | 'danger' | 'plain';
export function eventStatus(e: Event): { key: string; label: string; tone: StatusTone; past: boolean } {
  const past = isPast(e);
  const s = e.data.status;
  if (s === 'annullato') return { key: 'annullato', label: 'Annullato', tone: 'danger', past };
  if (s === 'rinviato') return { key: 'rinviato', label: 'Rinviato', tone: 'warn', past };
  if (past) return { key: 'concluso', label: 'Concluso', tone: 'plain', past };
  if (s === 'spostato online') return { key: 'spostato', label: 'Spostato online', tone: 'warn', past };
  return { key: 'programmato', label: 'In programma', tone: 'ok', past };
}

/** Un evento conta come "in programma" se non è annullato né rinviato. */
export const isScheduled = (e: Event): boolean => e.data.status !== 'annullato' && e.data.status !== 'rinviato';

export const provinceName = (p: ProvinceSlug): string => PROVINCES[p].name;
export const sectorName = (s: PromptSector): string => PROMPT_SECTORS[s];

export const emptyCounts = (): Record<ProvinceSlug, number> =>
  Object.fromEntries(PROVINCE_SLUGS.map((p) => [p, 0])) as Record<ProvinceSlug, number>;

export function countByProvince<T extends { data: { province: ProvinceSlug } }>(items: T[]): Record<ProvinceSlug, number> {
  const out = emptyCounts();
  for (const i of items) out[i.data.province] += 1;
  return out;
}

export const hostOf = (url: string): string => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
};

/** Titolo di pagina per liste impaginate: unico e ≤ 60 caratteri. */
export const pagedTitle = (base: string, n: number): string => {
  const suffix = `, pagina ${n}`;
  return base.length + suffix.length <= 60 ? base + suffix : clip(base, 60 - suffix.length) + suffix;
};

export interface MapPoint { id: string; lat: number; lng: number; title: string; url: string; province: ProvinceSlug; subtitle?: string }

export const companyPoints = (list: Company[]): MapPoint[] =>
  list.map((c) => ({
    id: c.id, lat: c.data.lat, lng: c.data.lng, title: c.data.name, url: `/aziende/${c.id}/`,
    province: c.data.province, subtitle: `${c.data.type}, ${c.data.city}`,
  }));

/** Solo eventi con coordinate: gli online non hanno marker. */
export const eventPoints = (list: Event[]): MapPoint[] =>
  list.flatMap((e) =>
    e.data.lat !== undefined && e.data.lng !== undefined
      ? [{ id: e.id, lat: e.data.lat, lng: e.data.lng, title: e.data.title, url: eventPath(e), province: e.data.province, subtitle: `${dateRange(e.data.start_date, e.data.end_date)}, ${e.data.city}` }]
      : [],
  );

/** Settori della prompt library/articoli → settori serviti dalle aziende (per i blocchi "in Sicilia"). */
export const SECTOR_TO_COMPANY_SECTORS: Record<PromptSector, string[]> = {
  ospitalita: ['turismo e ospitalità'],
  ristorazione: ['turismo e ospitalità', 'agroalimentare'],
  'agroalimentare-vino': ['agroalimentare', 'agricoltura'],
  'commercio-retail': ['commercio e retail'],
  'turismo-agenzie': ['turismo e ospitalità', 'cultura e beni culturali'],
  'studi-professionali': ['legale e professioni', 'finanza e assicurazioni'],
  'artigianato-manifattura': ['manifattura'],
  'edilizia-immobiliare': ['edilizia e immobiliare'],
};

/** "a, b e c" */
export const joinIt = (list: readonly string[]): string =>
  list.length <= 1 ? (list[0] ?? '') : `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;

export const COMPANY_TYPE_ARTICLE: Record<string, string> = {
  startup: 'una startup',
  azienda: 'un’azienda',
  'spin-off universitario': 'uno spin-off universitario',
  'centro di ricerca': 'un centro di ricerca',
  'incubatore/acceleratore': 'un incubatore o acceleratore',
  'community/associazione': 'una community o associazione',
};
