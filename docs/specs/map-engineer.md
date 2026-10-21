# Spec: map-engineer

Costruisci le mappe di aisicilia.it: anteprima SVG delle 9 province (zero JS) e mappa interattiva Leaflet caricata solo quando serve. È il punto più delicato per il Lighthouse 100.

## Leggi solo
Questa spec, `src/lib/provinces.ts`, `src/lib/taxonomies.ts`, `src/styles/tokens.css` (variabili `--c-map-*`), `docs/DECISIONS.md` (D-006, D-017), `scripts/geocode/geocode.mjs`.

## Scrivi solo in
`src/components/map/`, `public/geo/`, `scripts/geocode/`. Dati sorgente grezzi (GeoJSON originale) in `scripts/geocode/raw/` (aggiungilo a un `.gitignore` locale in quella cartella se pesa più di 1 MB e documenta come riscaricarlo).

## 1. Confini provinciali → SVG
- Fonte: confini amministrativi ISTAT (unità territoriali sovracomunali, versione generalizzata, licenza CC BY 4.0). Scarica il file ufficiale, filtra la regione Sicilia (codice regione 19), le 9 unità. Se il download ISTAT non è possibile dall'ambiente, usa un'altra fonte open derivata da ISTAT o OSM con licenza compatibile e scrivila nel report.
- Script `scripts/geocode/build-provinces.mjs` (riproducibile): legge il GeoJSON, semplifica (Douglas–Peucker o Visvalingam, tolleranza tale da restare leggibile a 360px di larghezza), proietta (equirettangolare con correzione del coseno della latitudine media va bene), arrotonda a 1 decimale, produce:
  - `src/components/map/provinces-paths.ts`: `export const VIEWBOX = '...'` e `export const PROVINCE_PATHS: Record<ProvinceSlug, { d: string; labelX: number; labelY: number }>`. Isole minori: tieni Eolie, Egadi, Ustica, Pantelleria, Pelagie se il peso lo consente, altrimenti indicale in nota.
  - `public/geo/sicilia-province.min.geojson` (semplificato, coordinate a 4 decimali) per Leaflet, se serve il contorno nella mappa interattiva. Obiettivo: pochi KB.
- Attribuzione ISTAT nel componente (testo piccolo o `title`) e in `public/geo/README.md`.
- Funzione di proiezione esportata (`project(lat, lng) → [x, y]`) per disegnare punti nell'anteprima con le stesse coordinate dei path.

## 2. `ProvinceMapPreview.astro` (zero JS di default)
Props: `{ counts: Record<ProvinceSlug, number>; mode: 'link' | 'filter'; basePath: '/aziende/provincia/' | '/eventi/provincia/'; active?: ProvinceSlug; label: string; points?: { lat: number; lng: number }[] }`
- SVG inline, `role="img"` sul gruppo grafico più una lista accessibile; ogni provincia è un `<a href="{basePath}{slug}/">` con `aria-label="Palermo: 12 aziende"` e il conteggio visibile come etichetta.
- Colori solo dai token `--c-map-*` (light/dark automatici), hover/focus visibili, provincia `active` evidenziata.
- `mode="filter"`: con JS attivo, il clic su una provincia **non** naviga ma emette `document.dispatchEvent(new CustomEvent('aisicilia:province-select', { detail: { province } }))` e marca la provincia selezionata (`aria-pressed` o `aria-current`); un secondo clic deseleziona (`province: null`). Senza JS resta un link. Script minimo (< 1 KB).
- `points` opzionali: piccoli cerchi proiettati sull'SVG (anteprima della distribuzione, senza JS).
- Dimensioni: `viewBox` + `width:100%; height:auto` + `aspect-ratio` fisso: CLS 0.
- Sotto l'SVG, legenda testuale con i conteggi (utile anche come dato citabile).

## 3. `InteractiveMap.astro`
Props: `{ points: { id: string; lat: number; lng: number; title: string; url: string; province: ProvinceSlug; subtitle?: string }[]; center?: [number, number]; zoom?: number; height?: number; label: string }`
- Primo render: contenitore con altezza fissa (default 420px desktop, 320px mobile), sfondo neutro e pulsante "Apri la mappa interattiva" (testo esplicito, ≥ 44px). Nessun byte di Leaflet scaricato.
- Leaflet + `leaflet.markercluster` + CSS relativi si caricano con `import()` dinamico **solo** al clic sul pulsante. Opzionale: caricamento quando il contenitore entra nel viewport, ma solo se non peggiora TBT/LCP (sulla home la mappa sta sotto la piega: preferisci il clic). Annota la scelta nel report.
- CSS di Leaflet: importato nel chunk dinamico (non nel CSS globale della pagina).
- Tile: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, `maxZoom` 18, attribuzione "© contributori OpenStreetMap" con link a `https://www.openstreetmap.org/copyright`. La CSP (`astro.config.mjs`) ammette già `img-src` per `tile.openstreetmap.org`: se ti serve altro, segnalalo nel report (non toccare la config).
- Marker con cluster; popup con titolo (link alla scheda), sottotitolo, provincia. Icone marker: SVG/DivIcon con i token colore (niente PNG di default di Leaflet, che richiederebbero path di immagini).
- Sincronizzazione con la lista (contratto con frontend-builder):
  - ascolta `aisicilia:filter-change` (`detail: { visibleIds: string[] }`) e mostra solo quei marker;
  - ascolta `aisicilia:province-select` (`detail: { province: string | null }`) e fa `fitBounds` sulla provincia (bounds ricavati dai path o dal GeoJSON) o torna alla Sicilia intera.
  - se la mappa non è ancora caricata, memorizza l'ultimo stato e lo applica al caricamento.
- Accessibilità: il contenitore ha `aria-label`; la mappa non è l'unico modo di accedere alle schede (la lista c'è sempre). Tastiera: Leaflet già gestisce il focus; verifica che il pulsante di apertura sposti il focus nella mappa.
- Mobile: `dragging` attivo ma `tap` senza blocchi dello scroll pagina (usa `scrollWheelZoom: false`).
- CSP: niente `style="..."` scritti come attributi nell'HTML di Astro; gli stili inline impostati da Leaflet via JS sono ammessi. Verifica in console che la CSP non blocchi nulla (build + `npx astro preview` + Chromium headless).

## 4. Geocoding
`scripts/geocode/geocode.mjs` esiste già (Nominatim, cache, 1 req/s). Aggiungi `scripts/geocode/batch.mjs`: scorre `src/content/companies/*.json` e `src/content/events/*.json`, segnala i record senza coordinate o con `geo_precision` incoerente, e con `--write` geocodifica `address` (o il comune) e aggiorna `lat`, `lng`, `geo_precision`. Non deve toccare nessun altro campo. Rispetta il rate limit.

## 5. Pagina di prova
Per testare puoi creare **temporaneamente** `src/pages/prova-mappa.astro` (unica eccezione alla regola sulle cartelle) con le fixture (`USE_FIXTURES=1`). **Cancellala prima di chiudere** il lavoro: non deve restare nel repo.

## Performance (vincolante)
- Pagina con mappa al primo render: 0 KB di Leaflet, JS dell'isola ≤ 3 KB gzip.
- Chunk Leaflet caricato a interazione: non conta nel budget iniziale, ma tienilo al minimo (solo i moduli necessari).
- Nessun layout shift all'apertura della mappa.

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Al termine: `npm run build` e `npm run validate` (gli errori di pagine non tue sono attesi: citali).
- Report finale (max 200 parole): cosa hai fatto, file toccati, peso dell'SVG e del chunk Leaflet (gzip), problemi aperti.
