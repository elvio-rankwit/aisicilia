// Leaflet non porta i tipi con sé (@types/leaflet non è tra le dipendenze): moduli tipizzati `any`.
declare module 'leaflet';
declare module 'leaflet.markercluster';
declare module '*.css?url' { const url: string; export default url; }
