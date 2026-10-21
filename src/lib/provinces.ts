// Le 9 province siciliane (oggi liberi consorzi comunali e città metropolitane).
// Lo slug è il contratto usato da dati, URL e mappe: minuscolo, senza accenti.
export const PROVINCE_SLUGS = [
  'agrigento', 'caltanissetta', 'catania', 'enna', 'messina',
  'palermo', 'ragusa', 'siracusa', 'trapani',
] as const;
export type ProvinceSlug = (typeof PROVINCE_SLUGS)[number];

export interface Province {
  slug: ProvinceSlug;
  name: string;
  sigla: string;
  capoluogo: string;
  /** Centro indicativo (capoluogo) per centrare le mappe. */
  center: [lat: number, lng: number];
  zoom: number;
  /** Ente attuale, per la pagina metodologia e i testi. */
  ente: 'Città metropolitana' | 'Libero consorzio comunale';
}

export const PROVINCES: Record<ProvinceSlug, Province> = {
  agrigento: { slug: 'agrigento', name: 'Agrigento', sigla: 'AG', capoluogo: 'Agrigento', center: [37.311, 13.576], zoom: 9, ente: 'Libero consorzio comunale' },
  caltanissetta: { slug: 'caltanissetta', name: 'Caltanissetta', sigla: 'CL', capoluogo: 'Caltanissetta', center: [37.49, 14.062], zoom: 9, ente: 'Libero consorzio comunale' },
  catania: { slug: 'catania', name: 'Catania', sigla: 'CT', capoluogo: 'Catania', center: [37.502, 15.087], zoom: 9, ente: 'Città metropolitana' },
  enna: { slug: 'enna', name: 'Enna', sigla: 'EN', capoluogo: 'Enna', center: [37.567, 14.279], zoom: 9, ente: 'Libero consorzio comunale' },
  messina: { slug: 'messina', name: 'Messina', sigla: 'ME', capoluogo: 'Messina', center: [38.193, 15.554], zoom: 9, ente: 'Città metropolitana' },
  palermo: { slug: 'palermo', name: 'Palermo', sigla: 'PA', capoluogo: 'Palermo', center: [38.116, 13.361], zoom: 9, ente: 'Città metropolitana' },
  ragusa: { slug: 'ragusa', name: 'Ragusa', sigla: 'RG', capoluogo: 'Ragusa', center: [36.925, 14.73], zoom: 10, ente: 'Libero consorzio comunale' },
  siracusa: { slug: 'siracusa', name: 'Siracusa', sigla: 'SR', capoluogo: 'Siracusa', center: [37.075, 15.287], zoom: 10, ente: 'Libero consorzio comunale' },
  trapani: { slug: 'trapani', name: 'Trapani', sigla: 'TP', capoluogo: 'Trapani', center: [38.018, 12.514], zoom: 9, ente: 'Libero consorzio comunale' },
};

export const SICILY_CENTER: [number, number] = [37.6, 14.1];
/** Bounding box della Sicilia incluse isole minori (Lampedusa, Pantelleria, Eolie). */
export const SICILY_BBOX = { minLat: 35.4, maxLat: 38.9, minLng: 11.9, maxLng: 15.7 } as const;
