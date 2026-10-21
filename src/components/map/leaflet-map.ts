// Mappa interattiva: tutto ciò che dipende da Leaflet vive qui, caricato con import() al clic.
// L'isola in InteractiveMap.astro resta minuscola e non importa mai questo file in modo statico.
import L from './leaflet-global';
import 'leaflet.markercluster';
// Il CSS NON si importa come modulo: Astro lo metterebbe nel <head> di ogni pagina con la mappa.
// Con `?url` resta un file a parte, che carichiamo noi con un <link> solo quando serve.
import cssUrl from './imap.css?url';
import { PROVINCES, type ProvinceSlug } from '../../lib/provinces';
import { PROVINCE_BOUNDS, SICILY_BOUNDS } from './province-bounds';

export interface MapPoint {
  id: string; lat: number; lng: number; title: string; url: string;
  province: ProvinceSlug; subtitle?: string;
}
export interface MapState { visible: string[] | null; province: string | null }
export interface MapApi { filter(ids: string[] | null): void; province(slug: string | null): void }

const PIN = '<svg viewBox="0 0 28 36" width="28" height="36" aria-hidden="true" focusable="false"><path d="M14 1.5C6.8 1.5 1.5 7.2 1.5 14c0 9 12.5 20.5 12.5 20.5S26.5 23 26.5 14C26.5 7.2 21.2 1.5 14 1.5z"/><circle cx="14" cy="14" r="4.5"/></svg>';
const GEOJSON = '/geo/sicilia-province.min.geojson';
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">contributori OpenStreetMap</a>';

function popup(p: MapPoint): HTMLElement {
  const box = document.createElement('div');
  box.className = 'imap-pop';
  const a = document.createElement('a');
  a.className = 'imap-pop-title';
  a.href = p.url;
  a.textContent = p.title;
  box.append(a);
  if (p.subtitle) { const s = document.createElement('p'); s.textContent = p.subtitle; box.append(s); }
  const pr = document.createElement('p');
  pr.textContent = PROVINCES[p.province]?.name ?? p.province;
  box.append(pr);
  return box;
}

function loadCss(): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('CSS della mappa non caricato'));
    document.head.append(link);
  });
}

export async function mount(root: HTMLElement, state: MapState): Promise<MapApi> {
  await loadCss();
  const canvas = root.querySelector<HTMLElement>('.imap-canvas')!;
  const data = root.querySelector('script[type="application/json"]');
  const points: MapPoint[] = data?.textContent ? JSON.parse(data.textContent) : [];
  const center = root.dataset.center ? (root.dataset.center.split(',').map(Number) as [number, number]) : null;
  const zoom = Number(root.dataset.zoom) || 8;

  canvas.hidden = false;
  const map = L.map(canvas, {
    scrollWheelZoom: false, zoomControl: false, attributionControl: false,
    minZoom: 6, maxZoom: 18,
  });
  L.control.zoom({ zoomInTitle: 'Ingrandisci', zoomOutTitle: 'Riduci' }).addTo(map);
  L.control.attribution({ prefix: false }).addTo(map);
  L.tileLayer(TILES, { maxZoom: 18, attribution: ATTRIBUTION }).addTo(map);

  const home = () => (center ? map.setView(center, zoom) : map.fitBounds(SICILY_BOUNDS, { padding: [8, 8] }));
  home();

  const icon = L.divIcon({ className: 'imap-pin', html: PIN, iconSize: [28, 36], iconAnchor: [14, 35], popupAnchor: [0, -32] });
  const markers = new Map<string, any>();
  for (const p of points) {
    const m = L.marker([p.lat, p.lng], { icon, title: p.title, alt: p.title });
    m.bindPopup(popup(p));
    markers.set(p.id, m);
  }
  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 48,
    iconCreateFunction: (c: any) =>
      L.divIcon({
        className: 'imap-cluster',
        html: `<span aria-hidden="true">${c.getChildCount()}</span><span class="imap-sr">${c.getChildCount()} schede in quest'area, premi Invio per ingrandire</span>`,
        iconSize: [40, 40],
      }),
  });
  map.addLayer(cluster);

  let outline: any = null;
  let geo: Promise<any> | null = null;
  const clearOutline = () => { if (outline) { outline.remove(); outline = null; } };
  const drawOutline = async (slug: string) => {
    geo ??= fetch(GEOJSON).then((r) => r.json()).catch(() => null);
    const fc = await geo;
    if (!fc || state.province !== slug) return;
    clearOutline();
    const color = getComputedStyle(root).getPropertyValue('--c-map-active').trim() || '#0a5a74';
    outline = L.geoJSON(fc, {
      filter: (f: any) => f.properties.slug === slug,
      style: { color, weight: 2, fillColor: color, fillOpacity: 0.1 },
      interactive: false,
    }).addTo(map);
  };

  const api: MapApi = {
    filter(ids) {
      const set = ids ? new Set(ids) : null;
      cluster.clearLayers();
      cluster.addLayers(points.filter((p) => !set || set.has(p.id)).map((p) => markers.get(p.id)));
    },
    province(slug) {
      clearOutline();
      const b = slug ? PROVINCE_BOUNDS[slug as ProvinceSlug] : null;
      if (!b) { home(); return; }
      map.fitBounds(b, { padding: [16, 16] });
      void drawOutline(slug!);
    },
  };

  // Popup: testi in italiano e Esc che chiude restituendo il focus al marker (il gestore di Leaflet
  // vale solo con il focus sul riquadro della mappa).
  let lastMarker: any = null;
  map.on('popupopen', (e: any) => {
    lastMarker = e.popup._source ?? null;
    const close: HTMLElement | undefined = e.popup._closeButton;
    close?.setAttribute('aria-label', 'Chiudi');
    close?.setAttribute('title', 'Chiudi');
  });
  map.getContainer().addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !map._popup) return;
    map.closePopup();
    lastMarker?.getElement?.()?.focus();
  });

  const el = map.getContainer();
  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', `${root.dataset.label ?? 'Mappa'}. Mappa interattiva: frecce per spostarti, più e meno per lo zoom.`);
  api.filter(state.visible);
  if (state.province) api.province(state.province);
  el.focus();
  return api;
}
