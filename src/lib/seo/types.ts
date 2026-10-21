// Interfaccia SEO di pagina: le pagine la compilano, SeoHead la rende.
// Proprietario: seo-geo-engineer. Le pagine NON scrivono tag <meta> a mano.
export interface Crumb { name: string; path: string }

export interface PageSeo {
  /** Title tag completo, ≤ 60 caratteri, unico nel sito. */
  title: string;
  /** Meta description, 70–155 caratteri, unica nel sito. */
  description: string;
  /** Path canonico relativo, minuscolo, con slash finale (es. /aziende/palermo/). */
  path: string;
  /** Breadcrumb dalla home esclusa; resi visibili e come BreadcrumbList. */
  breadcrumbs?: Crumb[];
  type?: 'website' | 'article' | 'profile';
  /** Nodi JSON-LD specifici della pagina: finiscono nell'unico @graph insieme a WebSite/Organization/Person. */
  jsonld?: Record<string, unknown>[];
  /** Testo dell'immagine OG generata (default: title). */
  ogTitle?: string;
  publishedAt?: Date;
  modifiedAt?: Date;
  /** Pagine da non indicizzare nemmeno in production (es. 404, ricerca). */
  noindex?: boolean;
}
