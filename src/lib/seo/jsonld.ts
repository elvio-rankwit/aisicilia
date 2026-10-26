// Nodi JSON-LD per tipo di pagina. CONTRATTO: le pagine chiamano queste funzioni e passano il risultato
// a PageSeo.jsonld. SeoHead aggiunge i nodi globali (WebSite, Organization, Person, WebPage, BreadcrumbList)
// e scrive un unico @graph, deduplicato per @id (in `graph.ts`).
//
// Scelte (vedi anche il report):
// - Company: sempre `Organization` (non `LocalBusiness`: i dati non dicono se l'indirizzo è una sede aperta al pubblico);
//   indirizzo e geo vanno in `location: Place`, perché `geo` non è valido su Organization.
// - Event: `geo` solo se c'è `venue_address` (le coordinate degli eventi possono essere al centro della città).
// - Prompt: `CreativeWork` e non `HowTo`: HowTo non dà più rich result e i passaggi andrebbero ricavati da un paragrafo.
import { eventPath, type Article, type Company, type Event, type Prompt } from '../data';
import { PROVINCES } from '../provinces';
import { PROMPT_SECTORS } from '../taxonomies';
import { localIso, ymd } from './dates';
import { ID, IN_LANGUAGE } from './ids';
import { abs, ogUrl } from './url';
import { SITE } from '../site';

export type JsonLdNode = Record<string, unknown>;
export interface ListItem { url: string; name: string }

const SCHEMA = 'https://schema.org/';

// ------------------------------------------------------------------ riferimenti riusabili
/** Riferimento alla Person del progetto: @id + nome, così funziona anche per parser che non risolvono gli @id. */
export const personRef = (): JsonLdNode => ({ '@type': 'Person', '@id': ID.person, name: SITE.author.name, url: abs(SITE.author.url) });
export const organizationRef = (): JsonLdNode => ({ '@type': 'Organization', '@id': ID.organization, name: SITE.name, url: abs('/') });

const cleanName = (s: string) => s.replace(/\[[^\]]*\]\s*/g, '').trim();
const provinceAddressBits = (province: keyof typeof PROVINCES) => ({
  addressRegion: PROVINCES[province].sigla,
  addressCountry: 'IT',
});

/** Separa via e CAP e toglie dalla via la coda con la città ("Via X 1, 90100 Palermo PA" → via + CAP; "Via X 1, Palermo" → "Via X 1"). */
function postalAddress(raw: string, city: string, province: keyof typeof PROVINCES): JsonLdNode {
  const withCap = raw.match(/^(.*?),?\s*(\d{5})\s+.+$/);
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const street = withCap ? withCap[1] : raw.replace(new RegExp(`,?\\s*${escaped}(\\s+[A-Z]{2})?$`, 'i'), '');
  return {
    '@type': 'PostalAddress',
    streetAddress: street.trim() || raw,
    ...(withCap ? { postalCode: withCap[2] } : {}),
    addressLocality: city,
    ...provinceAddressBits(province),
  };
}

// ------------------------------------------------------------------ aziende
export const companyNodes = (c: Company): JsonLdNode[] => {
  const d = c.data;
  const path = `/aziende/${c.id}/`;
  const precise = d.geo_precision === 'indirizzo' && Boolean(d.address);
  const node: JsonLdNode = {
    '@type': 'Organization',
    '@id': ID.company(path),
    name: cleanName(d.name),
    url: d.website,
    description: d.description,
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `Provincia di ${PROVINCES[d.province].name}`,
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Sicilia' },
    },
    knowsAbout: d.ai_areas,
    ...(d.founded_year ? { foundingDate: String(d.founded_year) } : {}),
    // Solo profili esterni verificati: il sito ufficiale è già in `url`.
    ...(d.same_as.length ? { sameAs: d.same_as.filter((u) => u !== d.website) } : {}),
    // `geo` non esiste su Organization (dominio Place): indirizzo e coordinate stanno in `location`, solo con precisione "indirizzo".
    ...(precise
      ? { location: { '@type': 'Place', address: postalAddress(d.address!, d.city, d.province), geo: { '@type': 'GeoCoordinates', latitude: d.lat, longitude: d.lng } } }
      : {}),
    mainEntityOfPage: { '@id': ID.webpage(path) },
  };
  return [node];
};

// ------------------------------------------------------------------ eventi
const ATTENDANCE = {
  'in presenza': `${SCHEMA}OfflineEventAttendanceMode`,
  online: `${SCHEMA}OnlineEventAttendanceMode`,
  ibrido: `${SCHEMA}MixedEventAttendanceMode`,
} as const;

const EVENT_STATUS = {
  programmato: `${SCHEMA}EventScheduled`,
  annullato: `${SCHEMA}EventCancelled`,
  rinviato: `${SCHEMA}EventPostponed`,
  'spostato online': `${SCHEMA}EventMovedOnline`,
} as const;

export const eventNodes = (e: Event): JsonLdNode[] => {
  const d = e.data;
  const path = eventPath(e);
  const physical = d.format !== 'online';
  const online = d.format !== 'in presenza';

  const place: JsonLdNode = {
    '@type': 'Place',
    name: d.venue_name ?? d.city,
    address: d.venue_address
      ? postalAddress(d.venue_address, d.city, d.province)
      : { '@type': 'PostalAddress', addressLocality: d.city, ...provinceAddressBits(d.province) },
    // Le coordinate dei dati possono essere al centro della città: geo solo con un indirizzo vero.
    ...(d.venue_address && d.lat !== undefined && d.lng !== undefined
      ? { geo: { '@type': 'GeoCoordinates', latitude: d.lat, longitude: d.lng } }
      : {}),
  };
  const virtual: JsonLdNode = { '@type': 'VirtualLocation', url: d.event_url };
  const location = physical && online ? [place, virtual] : physical ? place : virtual;

  // Date: con start_time → data e ora locali con fuso corretto; senza → solo data.
  const startDate = localIso(d.start_date, d.start_time);
  const lastDay = d.end_date ?? d.start_date;
  const endDate = d.end_time
    ? localIso(lastDay, d.end_time)
    : d.end_date && d.end_date.getTime() !== d.start_date.getTime()
      ? ymd(d.end_date)
      : undefined;

  const offers =
    d.price === 'gratuito'
      ? { '@type': 'Offer', url: d.event_url, price: 0, priceCurrency: 'EUR' }
      : d.price === 'a pagamento'
        ? { '@type': 'Offer', url: d.event_url }
        : undefined;

  const node: JsonLdNode = {
    '@type': 'Event',
    '@id': ID.event(path),
    name: d.title,
    description: d.description,
    startDate,
    ...(endDate ? { endDate } : {}),
    eventAttendanceMode: ATTENDANCE[d.format],
    // Un evento concluso resta EventScheduled: schema.org non ha uno stato "concluso".
    eventStatus: EVENT_STATUS[d.status],
    location,
    organizer: { '@type': 'Organization', name: d.organizer, ...(d.organizer_url ? { url: d.organizer_url } : {}) },
    ...(offers ? { offers } : {}),
    audience: d.audience.map((a) => ({ '@type': 'Audience', audienceType: a })),
    about: d.topics.map((t) => ({ '@type': 'Thing', name: t })),
    url: d.event_url,
    image: [ogUrl(path)],
    inLanguage: IN_LANGUAGE,
    mainEntityOfPage: { '@id': ID.webpage(path) },
  };
  return [node];
};

// ------------------------------------------------------------------ articoli
export const articleNodes = (a: Article): JsonLdNode[] => {
  const d = a.data;
  const path = `/impara/${a.id}/`;
  const words = (a.body ?? '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const article: JsonLdNode = {
    '@type': 'Article',
    '@id': ID.article(path),
    headline: d.title,
    description: d.description,
    author: personRef(),
    publisher: organizationRef(),
    datePublished: ymd(d.published_at),
    dateModified: ymd(d.updated_at),
    inLanguage: IN_LANGUAGE,
    isAccessibleForFree: true,
    timeRequired: `PT${d.reading_time}M`,
    ...(words > 0 ? { wordCount: words } : {}),
    citation: d.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })),
    image: [ogUrl(path)],
    about: d.sectors.filter((s) => s !== 'tutti').map((s) => ({ '@type': 'Thing', name: PROMPT_SECTORS[s as keyof typeof PROMPT_SECTORS] })),
    mainEntityOfPage: { '@id': ID.webpage(path) },
  };
  const faq: JsonLdNode = {
    '@type': 'FAQPage',
    '@id': ID.faq(path),
    inLanguage: IN_LANGUAGE,
    isPartOf: { '@id': ID.webpage(path) },
    mainEntity: d.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
  return [article, faq];
};

/** FAQPage per le pagine che non sono articoli (hub eventi, prossimi eventi). */
export const faqPageNodes = (path: string, items: { question: string; answer: string }[]): JsonLdNode[] => [
  {
    '@type': 'FAQPage',
    '@id': ID.faq(path),
    inLanguage: IN_LANGUAGE,
    isPartOf: { '@id': ID.webpage(path) },
    mainEntity: items.map((q) => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } })),
  },
];

// ------------------------------------------------------------------ prompt
export const promptNodes = (p: Prompt): JsonLdNode[] => {
  const d = p.data;
  const path = `/prompt/${d.sector}/${p.id}/`;
  const label = PROMPT_SECTORS[d.sector];
  const node: JsonLdNode = {
    '@type': 'CreativeWork',
    '@id': ID.prompt(path),
    name: d.title,
    description: d.goal,
    text: d.prompt_text,
    genre: 'prompt',
    audience: { '@type': 'Audience', audienceType: `Imprese: ${label.toLowerCase()}` },
    educationalLevel: d.level,
    keywords: [d.use_case, label.toLowerCase()],
    mentions: d.compatible_tools.map((t) => ({ '@type': 'Thing', name: t })),
    author: personRef(),
    publisher: organizationRef(),
    dateModified: ymd(d.tested_at),
    inLanguage: IN_LANGUAGE,
    isAccessibleForFree: true,
    image: [ogUrl(path)],
    mainEntityOfPage: { '@id': ID.webpage(path) },
  };
  return [node];
};

// ------------------------------------------------------------------ liste e hub
/** ItemList per directory, pagine provincia, hub. */
export const itemListNodes = (o: { path: string; name: string; items: ListItem[] }): JsonLdNode[] => [
  {
    '@type': 'ItemList',
    '@id': ID.itemlist(o.path),
    name: o.name,
    numberOfItems: o.items.length,
    itemListElement: o.items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.url), name: cleanName(it.name) })),
  },
];

/** CollectionPage per gli hub (/aziende/, /eventi/, /impara/, /prompt/ e settori): sostituisce il WebPage generico. */
export const collectionPageNodes = (o: { path: string; name: string; description: string }): JsonLdNode[] => [
  {
    '@type': 'CollectionPage',
    '@id': ID.webpage(o.path),
    url: abs(o.path),
    name: o.name,
    description: o.description,
    mainEntity: { '@id': ID.itemlist(o.path) },
  },
];

// ------------------------------------------------------------------ chi siamo
/** ProfilePage + Person completo per /chi-siamo/. */
export const profilePageNodes = (): JsonLdNode[] => {
  const path = SITE.author.url;
  return [
    {
      '@type': 'ProfilePage',
      '@id': ID.webpage(path),
      mainEntity: { '@id': ID.person },
    },
    {
      '@type': 'Person',
      '@id': ID.person,
      name: SITE.author.name,
      givenName: 'Elvio',
      familyName: 'Leonardi',
      url: abs(path),
      jobTitle: 'Consulente SEO, GEO e Google Ads',
      description: 'Consulente freelance di SEO, GEO e Google Ads a Palermo, SEO & AI Search Specialist in RankWit e docente di AI e Digital Marketing per Confesercenti. Ha ideato AI Sicilia e lo gestisce.',
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Università di Parma' },
      knowsAbout: [
        'SEO',
        'Generative Engine Optimization',
        'Google Ads',
        'intelligenza artificiale',
        "marketing per l'ospitalità",
      ],
      address: { '@type': 'PostalAddress', addressLocality: 'Palermo', addressRegion: 'PA', addressCountry: 'IT' },
      // Profili ufficiali (LinkedIn, ecc.): da completare quando l'utente li fornisce.
      sameAs: [],
      // Dalla pagina Chi siamo: SEO & AI Search Specialist in RankWit da maggio 2026.
      affiliation: { '@type': 'Organization', name: 'RankWit', url: 'https://www.rankwit.ai/' },
    },
  ];
};
