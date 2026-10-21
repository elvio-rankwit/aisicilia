// Contenuto di llms.txt (formato llmstxt.org) e llms-full.txt, generato in build dai dati. Identico in beta e production.
import { getArticles, getCompanies, getPrompts, getUpcomingEvents, groupByProvince, latestDate } from '../data';
import { PROVINCE_SLUGS, PROVINCES } from '../provinces';
import { PROMPT_SECTORS, PROMPT_SECTOR_SLUGS } from '../taxonomies';
import { FEEDS } from './config';
import { formatDay, formatRange } from './dates';
import { abs } from './url';
import { SITE } from '../site';

const clean = (s: string) => s.replace(/\[[^\]]*\]\s*/g, '').replace(/\s+/g, ' ').trim();
const link = (name: string, path: string, desc: string) => `- [${name}](${abs(path)}): ${desc}`;

const SUMMARY =
  "Portale indipendente sull'intelligenza artificiale in Sicilia: una directory di aziende, startup e centri di ricerca, un calendario di eventi per provincia, guide pratiche per le imprese e una libreria di prompt per settore. Ogni scheda ha le sue fonti e la data dell'ultima verifica. Il sito è in italiano. Lo gestisce Elvio Leonardi, consulente SEO e GEO a Palermo.";

export async function buildLlmsTxt(): Promise<string> {
  const [companies, upcoming, articles, prompts] = await Promise.all([getCompanies(), getUpcomingEvents(), getArticles(), getPrompts()]);
  const byProv = groupByProvince(companies);
  const evByProv = groupByProvince(upcoming);
  const out: string[] = [`# ${SITE.name}`, '', `> ${SUMMARY}`, ''];

  out.push('## Sezioni principali', '');
  out.push(link('Aziende e startup AI in Sicilia', '/aziende/', `${companies.length} schede verificate, con mappa e filtri per provincia.`));
  out.push(link('Eventi AI in Sicilia', '/eventi/', `${upcoming.length} eventi in programma, con date, luoghi e link per iscriversi.`));
  out.push(link('Archivio eventi', '/eventi/archivio/', 'Gli eventi sull’AI già svolti in Sicilia.'));
  out.push(link("Impara l'AI", '/impara/', `${articles.length} guide pratiche per le imprese siciliane.`));
  out.push(link('Prompt AI per settore', '/prompt/', `${prompts.length} prompt da copiare, con esempio e avvertenze.`), '');

  out.push('## Aziende per provincia', '');
  for (const p of PROVINCE_SLUGS) {
    const n = byProv[p].length;
    out.push(link(`Aziende AI in provincia di ${PROVINCES[p].name}`, `/aziende/provincia/${p}/`, n ? `${n} ${n === 1 ? 'scheda' : 'schede'}.` : 'nessuna scheda verificata per ora.'));
  }
  out.push('', '## Eventi per provincia', '');
  for (const p of PROVINCE_SLUGS) {
    const n = evByProv[p].length;
    out.push(link(`Eventi AI in provincia di ${PROVINCES[p].name}`, `/eventi/provincia/${p}/`, n ? `${n} ${n === 1 ? 'evento in programma' : 'eventi in programma'}.` : 'nessun evento in programma per ora.'));
  }

  if (articles.length) {
    out.push('', '## Guide', '');
    for (const a of articles) out.push(link(a.data.title, `/impara/${a.id}/`, a.data.description));
  }

  out.push('', '## Prompt per settore', '');
  for (const s of PROMPT_SECTOR_SLUGS) {
    const n = prompts.filter((p) => p.data.sector === s).length;
    out.push(link(`Prompt AI per ${PROMPT_SECTORS[s].toLowerCase()}`, `/prompt/${s}/`, `${n} prompt con esempio, variabili da compilare e avvertenze.`));
  }

  out.push('', '## Metodo e progetto', '');
  out.push(link('Come verifichiamo i dati', '/metodologia/', 'Fonti usate, criteri di inclusione, significato di "verificato" e calcolo della posizione.'));
  out.push(link('Chi siamo', '/chi-siamo/', 'Elvio Leonardi, consulente SEO, GEO e Google Ads a Palermo, e il progetto AI Sicilia.'));
  out.push(link('Segnala un’azienda o un evento', '/segnala/', 'Come proporre una realtà o un evento che manca.'));
  out.push(link('Modifica o rimozione di una scheda', '/rimozione/', 'Come chiedere una correzione o la rimozione.'), '');

  out.push('## Optional', '');
  out.push(`- [llms-full.txt](${SITE.url}/llms-full.txt): estratto testuale completo di metodologia, aziende, eventi e guide.`);
  for (const f of FEEDS) out.push(`- [${f.title}](${SITE.url}${f.path}): feed RSS.`);
  out.push(link('Contatti', '/contatti/', 'Come scrivere ad AI Sicilia.'));
  out.push(link('Informativa privacy', '/privacy/', 'Nessun cookie né strumenti di analisi.'));
  out.push(link('Note legali', '/note-legali/', 'Natura del progetto e responsabilità sui dati di terzi.'), '');
  return out.join('\n');
}

export async function buildLlmsFull(): Promise<string> {
  const [companies, upcoming, articles] = await Promise.all([getCompanies(), getUpcomingEvents(), getArticles()]);
  const byProv = groupByProvince(companies);
  const evByProv = groupByProvince(upcoming);
  const updated = latestDate([...companies.map((c) => c.data.last_verified), ...upcoming.map((e) => e.data.last_verified)]);
  const out: string[] = [`# ${SITE.name}: testo completo`, '', `> ${SUMMARY}`, ''];
  if (updated) out.push(`Dati aggiornati al ${formatDay(updated)}. Indirizzo del sito: ${SITE.url}/`, '');

  out.push('## Metodologia', '');
  out.push(
    'Ogni azienda e ogni evento nasce da fonti pubbliche realmente consultate e riporta la data dell’ultima verifica. Le descrizioni sono riscritte, non copiate. Non ci sono dati personali né loghi di terzi.',
    '',
    'Aziende: entrano quelle con sede operativa in Sicilia e intelligenza artificiale al centro del prodotto o del servizio, dichiarata sul sito o in una fonte pubblica. Restano fuori gli operatori generalisti che usano l’AI solo tra gli strumenti.',
    '',
    'Eventi: quelli sull’intelligenza artificiale che si svolgono in Sicilia, in presenza o ibridi, e gli eventi online se li organizza una realtà siciliana. Un evento finito passa in archivio.',
    '',
    'Verificato: ogni dato pubblicato risulta da almeno una fonte aperta e letta, indicata nella scheda. Se non si riesce a confermare un dato, non si pubblica.',
    '',
    'Posizione: precisione "indirizzo" se l’azienda pubblica un indirizzo trasformato in coordinate; precisione "città" (centro del comune) se manca.',
    '',
    `Dettagli: ${abs('/metodologia/')}`,
    '',
  );

  out.push('## Aziende per provincia', '');
  out.push('| Provincia | Ente | Aziende | Eventi in programma |', '| --- | --- | ---: | ---: |');
  for (const p of PROVINCE_SLUGS) out.push(`| ${PROVINCES[p].name} | ${PROVINCES[p].ente} | ${byProv[p].length} | ${evByProv[p].length} |`);
  out.push('');

  out.push('## Elenco delle aziende', '');
  if (!companies.length) out.push('Nessuna scheda verificata per ora.', '');
  for (const c of companies) {
    const d = c.data;
    out.push(`### ${clean(d.name)}`, '');
    out.push(clean(d.description), '');
    out.push(`- Tipo: ${d.type}`);
    out.push(`- Sede: ${d.city} (provincia di ${PROVINCES[d.province].name})`);
    out.push(`- Ambiti AI: ${d.ai_areas.join(', ')}`);
    out.push(`- Settori serviti: ${d.sectors_served.join(', ')}`);
    if (d.founded_year) out.push(`- Anno di fondazione: ${d.founded_year}`);
    out.push(`- Sito: ${d.website}`);
    out.push(`- Fonti: ${d.source_urls.join(' ; ')}`);
    out.push(`- Ultima verifica: ${formatDay(d.last_verified)}`);
    out.push(`- Scheda: ${abs(`/aziende/${c.id}/`)}`, '');
  }

  out.push('## Eventi in programma', '');
  if (!upcoming.length) out.push('Nessun evento in programma per ora.', '');
  for (const e of upcoming) {
    const d = e.data;
    const where = d.format === 'online' ? 'online' : [d.venue_name, d.city].filter(Boolean).join(', ');
    out.push(`### ${clean(d.title)}`, '');
    out.push(`- Data: ${formatRange(d.start_date, d.end_date)}${d.start_time ? `, ore ${d.start_time}${d.end_time ? `–${d.end_time}` : ''}` : ''}`);
    out.push(`- Luogo: ${where} (provincia di ${PROVINCES[d.province].name}), formato ${d.format}`);
    out.push(`- Organizzatore: ${d.organizer}`);
    out.push(`- Prezzo: ${d.price}`);
    if (d.status !== 'programmato') out.push(`- Stato: ${d.status}`);
    out.push(`- Pubblico: ${d.audience.join(', ')}`);
    out.push(`- Pagina dell'evento: ${d.event_url}`);
    out.push(`- Scheda: ${abs(`/eventi/${e.id}/`)}`, `- Ultima verifica: ${formatDay(d.last_verified)}`, '');
  }

  out.push('## Guide', '');
  if (!articles.length) out.push('Nessuna guida pubblicata per ora.', '');
  for (const a of articles) {
    const d = a.data;
    out.push(`### ${clean(d.title)}`, '');
    out.push(`Risposta in breve: ${d.answer}`, '');
    out.push(`- Livello: ${d.level}, ${d.reading_time} min di lettura`);
    out.push(`- Pubblicata il ${formatDay(d.published_at)}, aggiornata il ${formatDay(d.updated_at)}`);
    out.push(`- Testo completo: ${abs(`/impara/${a.id}/`)}`, '');
  }
  out.push(`Altre sezioni: ${abs('/prompt/')} (prompt per settore), ${abs('/chi-siamo/')} (chi c'è dietro il progetto).`, '');
  return out.join('\n');
}
