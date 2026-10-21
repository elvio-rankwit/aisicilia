// Date per meta, JSON-LD e feed. I dati hanno date a mezzanotte UTC (YYYY-MM-DD); gli orari sono locali (Europe/Rome).

export const ymd = (d: Date): string => d.toISOString().slice(0, 10);

const fullFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const dayFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', timeZone: 'UTC' });
const dayMonthFmt = new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', timeZone: 'UTC' });

/** "27 maggio 2026". */
export const formatDay = (d: Date): string => fullFmt.format(d);

/** "12–14 marzo 2027", "30 marzo – 2 aprile 2027", "12 marzo 2027". */
export function formatRange(start: Date, end?: Date): string {
  if (!end || end.getTime() === start.getTime()) return fullFmt.format(start);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  if (sameYear && start.getUTCMonth() === end.getUTCMonth()) return `${dayFmt.format(start)}–${fullFmt.format(end)}`;
  if (sameYear) return `${dayMonthFmt.format(start)} – ${fullFmt.format(end)}`;
  return `${fullFmt.format(start)} – ${fullFmt.format(end)}`;
}

const offsetFmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Rome', timeZoneName: 'longOffset', hour: 'numeric' });

/** Scarto di Europe/Rome da UTC, in minuti, all'istante dato. */
function romeOffsetMinutes(utcMs: number): number {
  const name = offsetFmt.formatToParts(new Date(utcMs)).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

/** "+01:00" o "+02:00" corretto per la data e l'ora locali indicate (gestisce anche il cambio d'ora). */
export function romeOffset(day: string, time: string): string {
  const [y, mo, d] = day.split('-').map(Number);
  const [h, mi] = time.split(':').map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const guess = romeOffsetMinutes(wall - 3600_000);
  const minutes = romeOffsetMinutes(wall - guess * 60_000);
  const sign = minutes < 0 ? '-' : '+';
  const a = Math.abs(minutes);
  return `${sign}${String(Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`;
}

/** Data ISO 8601: solo giorno, oppure giorno + ora locale con fuso corretto. */
export function localIso(date: Date, time?: string): string {
  const day = ymd(date);
  return time ? `${day}T${time}:00${romeOffset(day, time)}` : day;
}
