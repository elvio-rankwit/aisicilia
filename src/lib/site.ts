// Configurazione globale del sito. Unica fonte per nome, URL e modalità beta/production.
export const SITE_MODE: 'beta' | 'production' =
  import.meta.env.PUBLIC_SITE_MODE === 'production' ? 'production' : 'beta';
export const IS_BETA = SITE_MODE === 'beta';

export const SITE = {
  name: 'AI Sicilia',
  domain: 'aisicilia.it',
  url: (import.meta.env.PUBLIC_SITE_URL || 'https://aisicilia.it').replace(/\/$/, ''),
  locale: 'it_IT',
  lang: 'it',
  tagline: "L'intelligenza artificiale in Sicilia: aziende, eventi, guide e prompt per le imprese",
  author: {
    id: 'elvio-leonardi',
    name: 'Elvio Leonardi',
    url: '/chi-siamo/',
  },
} as const;

export const FORMS = {
  segnala: import.meta.env.PUBLIC_FORM_SEGNALA_URL || '',
  rimozione: import.meta.env.PUBLIC_FORM_RIMOZIONE_URL || '',
  contatti: import.meta.env.PUBLIC_FORM_CONTATTI_URL || '',
} as const;

/** Elementi per pagina nelle liste paginate (aziende, eventi, archivio). */
export const PAGE_SIZE = 24;
