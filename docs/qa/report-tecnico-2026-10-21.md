# Report QA tecnico, 21 ottobre 2026

Redatto dal qa-factchecker (istanza tecnica). Il subagente non ha potuto scrivere il file: lo ha trascritto l'orchestratore dal suo report. Gli output Lighthouse sono in `docs/qa/lighthouse/{mobile,desktop,mobile-extra,desktop-extra}/`.

## Sintesi
| Controllo | Esito |
|---|---|
| Build e validate (beta e production) | verde: 165 pagine, 0 errori, 0 avvisi |
| Lighthouse 15 URL, mobile e desktop | verde: 100/100/100/100 ovunque. LCP max 1,40 s, CLS 0, TBT 0 |
| Budget | verde: JS max 4,8 KB gzip, CSS max 7,3 KB gzip. Leaflet solo al clic |
| Immagini e OG | verde: nessuna immagine raster; OG 1200×630 su 165/165 pagine |
| JSON-LD | giallo: un `@graph` per pagina, `@id` coerenti; `geo` su Organization non valido (S-1) |
| Accessibilità (axe) | giallo: 1 regola best-practice su 7 articoli; `/cerca/` in dark con contrasto insufficiente (F-1) |
| Funzionale | verde: filtri e hash, mappa SVG → filtro, marker coerenti, Copia, `.ics` validi, Pagefind, 404, archivio |
| Beta online | verde: tutti gli header di sicurezza e il noindex presenti; 203 file su 204 identici alla build |

## Problemi per agente

### frontend-builder
- **F-1 (alta)**: in `/cerca/` (dark) la UI Pagefind ha contrasto 1,54:1 e il campo resta bianco; l'input non ha label (`label-title-only`). Correzione: ridefinire `--pagefind-ui-*` con i token del sito e dare un `aria-label` all'input.
- **F-2 (media)**: `src/components/ics.ts:29`, `';'` non escapato (`'\;'` → `'\\;'`), 11 eventi; LOCATION ripete la città in 12 eventi.
- **F-3 (media)**: `SourceBox.astro`, link alle fonti con lo stesso testo (solo host) in 25 schede. Mostrare host + percorso.
- **F-4 (bassa)**: `SiciliaDots.astro`, l'etichetta "15°E" è coperta dalla costa.
- **F-5 (bassa)**: `<aside>` annidato negli articoli (`landmark-complementary-is-top-level`).
- **F-6 (bassa)**: `.btn` sovrascrive `.js-only`, così i pulsanti Copia e Mappa sono visibili e inerti senza JS.
- **F-9 (bassa)**: toggle del tema, il primo clic non produce cambiamenti visibili su un dispositivo in modalità chiara.

### map-engineer
- **M-1 (media)**: Esc non chiude il popup quando il focus è su un marker.
- **M-2 (bassa)**: `aria-label="Close popup"` è in inglese.
- **M-3 (bassa)**: i cluster sono tabbabili ma il loro nome è solo un numero.

### seo-geo-engineer
- **S-1 (media)**: `geo` su `Organization` non è valido in schema.org (19 schede). Usare `LocalBusiness` oppure `location: Place`.
- **S-2 (bassa)**: `sameAs` uguale a `url`.
- **S-3 (bassa)**: lo `streetAddress` degli Event contiene già la città.

### Orchestratore / configurazione
- **A-1 (alta)**: `LHCI_PRESET` collide con il prefisso `LHCI_` di lhci, quindi il gate desktop esce sempre con errore e le asserzioni non vengono valutate.
- **F-7 (bassa)**: `inlineStylesheets: 'always'` toglie due CSS bloccanti (l'audit è informativo, ma LCP mobile è a 1,40 s su un budget di 1,5 s).
- **F-8 (bassa)**: `preact()` è attivo senza componenti: chunk orfani in `dist/_astro`.
- **A-2 (bassa)**: warning Shiki/CSP a ogni build, da risolvere con `markdown.syntaxHighlight: false`.

### Dati
- **E-1 (bassa)**: `venue_address` con la città già inclusa (si risolve nel codice con F-2 e S-3).
- `techsgiving-ai-meetup-palermo-2026-11`: `event_url` punta alla home dell'organizzatore, ma la descrizione parla di iscrizione su Meetup.

## Note
- L'audit `render-blocking-resources` è informativo (peso 0).
- Pagefind usa una ricerca fuzzy: è il comportamento della libreria, non un difetto.
- Script, screenshot e log sono nello scratchpad della sessione (non versionati).
