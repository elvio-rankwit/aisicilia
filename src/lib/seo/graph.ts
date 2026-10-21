// Costruzione dell'unico @graph JSON-LD di ogni pagina: nodi globali + WebPage + BreadcrumbList + nodi della pagina.
import { SITE } from '../site';
import { ymd } from './dates';
import { ID, IN_LANGUAGE } from './ids';
import type { JsonLdNode } from './jsonld';
import { OG } from './config';
import type { PageSeo } from './types';
import { abs, normalizePath, ogUrl } from './url';

/** WebSite + Organization del progetto + Person minimale: presenti su ogni pagina. */
export function globalNodes(): JsonLdNode[] {
  return [
    {
      '@type': 'WebSite',
      '@id': ID.website,
      url: abs('/'),
      name: SITE.name,
      description: SITE.tagline,
      inLanguage: IN_LANGUAGE,
      publisher: { '@id': ID.organization },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/cerca/?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': ID.organization,
      name: SITE.name,
      url: abs('/'),
      description: SITE.tagline,
      logo: { '@type': 'ImageObject', '@id': ID.logo, url: `${SITE.url}/favicon.svg`, contentUrl: `${SITE.url}/favicon.svg` },
      founder: { '@id': ID.person },
      areaServed: { '@type': 'AdministrativeArea', name: 'Sicilia' },
    },
    // Nodo minimale: quello completo (lavoro, competenze, indirizzo) sta solo su /chi-siamo/.
    { '@type': 'Person', '@id': ID.person, name: SITE.author.name, url: abs(SITE.author.url) },
  ];
}

function webPageNode(seo: PageSeo): JsonLdNode[] {
  const path = normalizePath(seo.path);
  const isHome = path === '/';
  const page: JsonLdNode = {
    '@type': 'WebPage',
    '@id': ID.webpage(path),
    url: abs(path),
    name: seo.title,
    description: seo.description,
    inLanguage: IN_LANGUAGE,
    isPartOf: { '@id': ID.website },
    ...(isHome ? { about: { '@id': ID.organization } } : {}),
    ...(seo.breadcrumbs?.length ? { breadcrumb: { '@id': ID.breadcrumb(path) } } : {}),
    primaryImageOfPage: { '@id': ID.image(path) },
    ...(seo.publishedAt ? { datePublished: ymd(seo.publishedAt) } : {}),
    ...(seo.modifiedAt ? { dateModified: ymd(seo.modifiedAt) } : {}),
  };
  const image: JsonLdNode = {
    '@type': 'ImageObject',
    '@id': ID.image(path),
    url: ogUrl(path),
    contentUrl: ogUrl(path),
    width: OG.width,
    height: OG.height,
    caption: seo.ogTitle ?? seo.title,
    inLanguage: IN_LANGUAGE,
  };
  return [page, image];
}

function breadcrumbNode(seo: PageSeo): JsonLdNode[] {
  if (!seo.breadcrumbs?.length) return [];
  const path = normalizePath(seo.path);
  const crumbs = [{ name: 'Home', path: '/' }, ...seo.breadcrumbs];
  return [
    {
      '@type': 'BreadcrumbList',
      '@id': ID.breadcrumb(path),
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
    },
  ];
}

/** Unisce i nodi con lo stesso @id (l'ultimo vince sulle proprietà in conflitto, @type compreso). I nodi senza @id restano. */
export function dedupeById(nodes: JsonLdNode[]): JsonLdNode[] {
  const out: JsonLdNode[] = [];
  const seen = new Map<string, number>();
  for (const n of nodes) {
    const id = n['@id'];
    if (typeof id !== 'string') { out.push(n); continue; }
    const at = seen.get(id);
    if (at === undefined) { seen.set(id, out.length); out.push({ ...n }); continue; }
    out[at] = { ...out[at], ...Object.fromEntries(Object.entries(n).filter(([, v]) => v !== undefined)) };
  }
  return out;
}

export function buildGraph(seo: PageSeo): { '@context': string; '@graph': JsonLdNode[] } {
  return {
    '@context': 'https://schema.org',
    '@graph': dedupeById([...globalNodes(), ...webPageNode(seo), ...breadcrumbNode(seo), ...(seo.jsonld ?? [])]),
  };
}

/** Serializzazione sicura dentro <script>: niente "</script>" né "<!--" nei valori. */
export const serializeJsonLd = (graph: object): string => JSON.stringify(graph).replace(/</g, '\\u003c');

