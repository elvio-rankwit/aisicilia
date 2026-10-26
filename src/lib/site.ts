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

// Endpoint Formspree (pubblici: finiscono comunque nell'HTML dei moduli). Le variabili d'ambiente
// PUBLIC_FORM_*_URL, se impostate, hanno la precedenza (D-033).
export const FORMS = {
  segnala: import.meta.env.PUBLIC_FORM_SEGNALA_URL || 'https://formspree.io/f/mzeeppqo',
  rimozione: import.meta.env.PUBLIC_FORM_RIMOZIONE_URL || 'https://formspree.io/f/meaajjwd',
  contatti: import.meta.env.PUBLIC_FORM_CONTATTI_URL || 'https://formspree.io/f/xoeeaazz',
  // Finché non c'è un modulo dedicato, le rivendicazioni arrivano sul modulo delle modifiche, con il campo "tipo".
  rivendica: import.meta.env.PUBLIC_FORM_RIVENDICA_URL || 'https://formspree.io/f/meaajjwd',
} as const;

/** Elementi per pagina nelle liste paginate (aziende, eventi, archivio). */
export const PAGE_SIZE = 24;
