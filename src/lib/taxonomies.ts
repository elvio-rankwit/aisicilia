// Vocabolari controllati: stesse etichette ovunque (filtri, schede, JSON-LD, llms.txt).
// Aggiungere voci qui, mai stringhe libere nei dati.

export const COMPANY_TYPES = [
  'startup', 'azienda', 'spin-off universitario', 'centro di ricerca',
  'incubatore/acceleratore', 'community/associazione',
] as const;

export const AI_AREAS = [
  'AI generativa', 'NLP', 'computer vision', 'machine learning', 'robotica',
  'dati e analytics', 'voce e speech', 'agenti e automazione', 'IoT ed edge AI',
  'AI per la sicurezza informatica',
] as const;

export const SECTORS_SERVED = [
  'turismo e ospitalità', 'agroalimentare', 'agricoltura', 'sanità', 'manifattura',
  'pubblica amministrazione', 'energia', 'ambiente', 'logistica e trasporti',
  'finanza e assicurazioni', 'commercio e retail', 'edilizia e immobiliare',
  'istruzione e ricerca', 'marketing e comunicazione', 'cultura e beni culturali',
  'legale e professioni', 'trasversale',
] as const;

export const EVENT_FORMATS = ['in presenza', 'online', 'ibrido'] as const;
export const EVENT_PRICES = ['gratuito', 'a pagamento', 'non indicato'] as const;
export const EVENT_AUDIENCES = [
  'imprese', 'professionisti', 'sviluppatori', 'studenti', 'startup',
  'ricercatori', 'pubblica amministrazione', 'tutti',
] as const;
export const EVENT_STATUSES = ['programmato', 'annullato', 'rinviato', 'spostato online'] as const;

export const LEVELS = ['base', 'intermedio', 'avanzato'] as const;

/** Gli 8 settori della prompt library (slug → etichetta). Usati anche per gli articoli. */
export const PROMPT_SECTORS = {
  ospitalita: 'Ospitalità',
  ristorazione: 'Ristorazione',
  'agroalimentare-vino': 'Agroalimentare e vino',
  'commercio-retail': 'Commercio e retail',
  'turismo-agenzie': 'Turismo e agenzie',
  'studi-professionali': 'Studi professionali',
  'artigianato-manifattura': 'Artigianato e manifattura',
  'edilizia-immobiliare': 'Edilizia e immobiliare',
} as const;
export type PromptSector = keyof typeof PROMPT_SECTORS;
export const PROMPT_SECTOR_SLUGS = Object.keys(PROMPT_SECTORS) as [PromptSector, ...PromptSector[]];

export const PROMPT_USE_CASES = [
  'marketing', 'social media', 'customer care', 'recensioni', 'vendite e preventivi',
  'amministrazione', 'analisi', 'traduzioni', 'formazione del personale', 'organizzazione',
] as const;

export const COMPATIBLE_TOOLS = ['ChatGPT', 'Claude', 'Gemini', 'Microsoft Copilot', 'Mistral Le Chat', 'Perplexity'] as const;
