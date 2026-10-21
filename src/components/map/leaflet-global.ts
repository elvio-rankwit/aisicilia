// Leaflet va esposto come `window.L` PRIMA che parta leaflet.markercluster (che lo cerca nello scope globale).
// Questo modulo esiste solo per garantire l'ordine di valutazione degli import.
import L from 'leaflet';

(window as unknown as { L: typeof L }).L = L;
export default L;
