# aisicilia.it — regole di progetto

Portale sull'intelligenza artificiale in Sicilia: directory aziende ed eventi (con mappe), articoli per le imprese, prompt library. Progetto indipendente di Elvio Leonardi. Stato: **beta non indicizzata**.

## Stack
Astro 7 statico · TypeScript · Content Collections + Zod (`src/content.config.ts`) · CSS con design tokens (`src/styles/tokens.css`) · Leaflet + OSM (solo a interazione) · Pagefind · Cloudflare Pages · GitHub Actions.

## Comandi
- `npm run dev` / `npm run dev:fixtures` (dati fittizi di `src/fixtures/`)
- `npm run build` (Astro + indice Pagefind)
- `npm run validate` — schemi, slug, dati fittizi, dati personali, lista nera del copy, e sul `dist/`: H1, title/description (lunghezza, duplicati), canonical, noindex, JSON-LD, link rotti, pagine orfane, budget JS/CSS
- `PUBLIC_SITE_MODE=production npm run build && npm run lhci` (+ `npm run lhci:desktop`) — Lighthouse CI, soglia 100

## Regole non negoziabili
1. **Zero dati inventati.** Ogni azienda/evento ha fonti realmente consultate. Dati non verificabili → `data/_pending/`, mai pubblicati. Fixture solo in `src/fixtures/` (slug `esempio-`, nomi `[FITTIZIO]`).
2. **Solo dati aziendali**, nessun dato personale. Pagina `/rimozione/` obbligatoria.
3. **Descrizioni riscritte**, mai copiate. Niente loghi di terzi.
4. **Fonti rispettate**: niente scraping di LinkedIn/Crunchbase o siti che lo vietano; robots.txt; max 1 req/s per dominio. Geocoding solo con `scripts/geocode/geocode.mjs` (Nominatim, cache), coordinate salvate nei dati.
5. **Beta non indicizzata**: tutto passa da `PUBLIC_SITE_MODE=beta|production`.
6. **Copy umano**: `docs/copy-rules.md` è vincolante; la lista nera è in `scripts/validate/blacklist.mjs`.
7. **Lighthouse 100/100** in tutte le categorie, mobile e desktop. Zero JS di default, isole solo dove serve, mai `client:load` senza motivo in `docs/DECISIONS.md`. Budget: JS iniziale ≤ 30 KB gzip, CSS ≤ 20 KB gzip, CLS 0.
8. **YMYL** (AI Act, GDPR, bandi): solo fonti ufficiali, data visibile, `needs_human_review: true` → esclusi dalla build finché l'utente non li approva.

## Contratti tra parti del codice
- Dati: le pagine leggono solo tramite `src/lib/data.ts` (regole editoriali: solo `verified`, YMYL nascosti, eventi passati in archivio).
- SEO: le pagine passano un `PageSeo` (`src/lib/seo/types.ts`) a `BaseLayout`; title/description da `src/lib/seo/meta.ts`, JSON-LD da `src/lib/seo/jsonld.ts`. Niente `<meta>` a mano.
- Mappe: componenti in `src/components/map/`; eventi DOM `aisicilia:province-select` e `aisicilia:filter-change`.
- Immagini raster: solo `src/components/Img.astro` (AVIF + WebP).
- Vocabolari: `src/lib/taxonomies.ts`, province: `src/lib/provinces.ts`.

## Organizzazione del lavoro
- Squadra di agenti in `.claude/agents/` (tutti `model: sonnet`), ognuno con la sua spec in `docs/specs/<agente>.md` e cartelle di scrittura dedicate.
- Decisioni in `docs/DECISIONS.md`; fonti candidate in `docs/sources.md`; report QA in `docs/qa/`; log delle pipeline in `docs/runs/`.
- Commit in italiano, piccoli e descrittivi.
