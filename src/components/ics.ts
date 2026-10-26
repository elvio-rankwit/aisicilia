// Generatore di file iCalendar (RFC 5545) per un evento. Fuso Europe/Rome, UID stabile, CRLF, righe ≤ 75 ottetti.
import { eventPath, type Event } from '../lib/data';

const CRLF = '\r\n';
const enc = new TextEncoder();

/** Piega una riga a 75 ottetti UTF-8 senza spezzare i caratteri multibyte (RFC 5545 §3.1). */
export function fold(line: string): string {
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = '';
  let curBytes = 0;
  let limit = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (curBytes + b > limit) {
      out.push(cur);
      cur = ' ';
      curBytes = 1;
      limit = 75;
    }
    cur += ch;
    curBytes += b;
  }
  out.push(cur);
  return out.join(CRLF);
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
const hms = (t: string) => t.replace(':', '') + '00';
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Rome',
  'X-LIC-LOCATION:Europe/Rome',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

export function buildIcs(e: Event, siteUrl: string): string {
  const d = e.data;
  const lines: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//aisicilia.it//Eventi AI Sicilia//IT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', ...VTIMEZONE];

  lines.push('BEGIN:VEVENT');
  lines.push(`UID:${e.id}@aisicilia.it`);
  // DTSTAMP deterministico (data dell'ultima verifica): il file non cambia a ogni build.
  lines.push(`DTSTAMP:${ymd(d.last_verified)}T000000Z`);

  const lastDay = d.end_date ?? d.start_date;
  const multiDay = lastDay.getTime() > d.start_date.getTime();
  const timed = Boolean(d.start_time) && (!multiDay || Boolean(d.end_time));
  if (timed) {
    lines.push(`DTSTART;TZID=Europe/Rome:${ymd(d.start_date)}T${hms(d.start_time!)}`);
    // Senza ora di fine non inventiamo una durata: DTEND si omette.
    if (d.end_time) lines.push(`DTEND;TZID=Europe/Rome:${ymd(lastDay)}T${hms(d.end_time)}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${ymd(d.start_date)}`);
    lines.push(`DTEND;VALUE=DATE:${ymd(addDays(lastDay, 1))}`);
  }

  lines.push(`SUMMARY:${esc(d.title)}`);
  const extra = [
    d.start_time && !timed ? `Inizio alle ${d.start_time}${d.end_time ? `, fine alle ${d.end_time}` : ''}.` : '',
    `Organizza: ${d.organizer}.`,
    `Pagina dell'evento: ${d.event_url}`,
    `Scheda su AI Sicilia: ${siteUrl}${eventPath(e)}`,
    'Controlla date e orari sul sito dell\'organizzatore prima di partire.',
  ].filter(Boolean);
  lines.push(`DESCRIPTION:${esc(d.description + '\n\n' + extra.join('\n'))}`);
  const cityInAddress = d.venue_address ? d.venue_address.toLowerCase().includes(d.city.toLowerCase()) : false;
  const where = d.format === 'online' ? 'Online' : [d.venue_name, d.venue_address, cityInAddress ? '' : d.city].filter(Boolean).join(', ');
  if (where) lines.push(`LOCATION:${esc(where)}`);
  lines.push(`URL:${d.event_url}`);
  lines.push(`STATUS:${d.status === 'annullato' ? 'CANCELLED' : 'CONFIRMED'}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.map(fold).join(CRLF) + CRLF;
}
