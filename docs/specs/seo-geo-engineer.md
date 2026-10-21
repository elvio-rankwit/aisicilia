# Spec: seo-geo-engineer

Porta SEO tecnico, dati strutturati e GEO di aisicilia.it al livello massimo. Tutto deve funzionare già in beta (noindex): il passaggio a production è solo `PUBLIC_SITE_MODE=production`.

## Leggi solo
Questa spec, `docs/DECISIONS.md` (D-002, D-007, D-008, D-009, D-012, D-016, D-017), `src/content.config.ts`, `src/lib/data.ts`, `src/lib/related.ts`, `src/lib/site.ts`, `src/lib/provinces.ts`, `src/lib/taxonomies.ts`, `src/lib/seo/*`, `src/layouts/BaseLayout.astro`, e le pagine in `src/pages/` **in sola lettura** per capire cosa passano a `PageSeo`.

## Scrivi solo in
- `src/lib/seo/**` (meta.ts, jsonld.ts, SeoHead.astro, generatore OG, helper)
- `public/` (`_headers`, `_redirects`, file statici SEO) — non toccare `public/geo/` né `public/favicon.svg`
- endpoint nuovi in `src/pages/` **solo** per: `robots.txt.ts`, `sitemap-*.xml.ts` e `sitemap-index.xml.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `rss/articoli.xml.ts`, `rss/eventi.xml.ts`, `og/[...path].png.ts`
- `astro.config.mjs` e `package.json` solo se indispensabile (dipendenze OG; CSP): motivalo nel report
- `src/assets/fonts/` per il font OFL usato solo nelle immagini OG
Non modificare le pagine `.astro` esistenti: se una pagina passa dati SEO sbagliati o mancanti, elenca il problema nel report (lo corregge l'orchestratore).

## 1. Meta (`src/lib/seo/meta.ts`)
Riscrivi i template di title e description. Vincoli: title ≤ 60, description 70–155, **unici** in tutto il sito, scritti come li scriverebbe una persona (niente "Scopri…", niente elenchi di keyword), con l'entità principale all'inizio. Gestisci i casi limite (nomi lunghi, 0 record, troncamento su parola). Lo script di validazione segnala lunghezze e duplicati.

## 2. SeoHead (`src/lib/seo/SeoHead.astro`)
- title, description, canonical assoluto (minuscolo, slash finale, senza parametri), `robots` (beta: `noindex, nofollow` ovunque; production: `index, follow, max-image-preview:large`; `noindex` per `seo.noindex`)
- Open Graph completi (`og:type`, `og:title`, `og:description`, `og:url`, `og:image` 1200×630 con `width`/`height`/`alt`, `og:locale` it_IT, `og:site_name`), `article:published_time`/`modified_time` per gli articoli; Twitter Card `summary_large_image`
- `<link rel="alternate" type="application/rss+xml">` per i feed. **Il sito è SOLO in italiano**: nessuna versione in altre lingue, nessuna traduzione. `hreflang` va solo predisposto nel codice come struttura **disattivata** (costante `HREFLANG_ENABLED = false`): nelle pagine non si emette alcun tag hreflang
- `<link rel="sitemap">` solo in production
- **Un unico `<script type="application/ld+json">`** con `@graph`: nodi globali + `WebPage` (o sottotipo) + `BreadcrumbList` (se `seo.breadcrumbs`) + nodi della pagina (`seo.jsonld`). Deduplica per `@id`.

## 3. JSON-LD (`src/lib/seo/jsonld.ts`)
Implementa le funzioni del contratto (stesse firme). Regole: valido su schema.org e Rich Results Test; riferimenti per `@id` (`https://aisicilia.it/#website`, `#organization`, `/chi-siamo/#elvio-leonardi`, `<url>#webpage`, `<url>#company`…); nessun duplicato.
- Globali (su ogni pagina): `WebSite` (+ `SearchAction` verso `/cerca/?q={search_term_string}`, `inLanguage: it-IT`, `publisher` → Organization), `Organization` del progetto (nome "AI Sicilia", url, logo `/favicon.svg` o immagine generata, `founder` → Person), `Person` minimale con `@id` (il nodo completo solo su `/chi-siamo/`).
- `profilePageNodes()`: `ProfilePage` con `mainEntity` → `Person` completo: `name`, `jobTitle` ("Consulente SEO, GEO e Google Ads"), `knowsAbout` (SEO, Generative Engine Optimization, Google Ads, intelligenza artificiale, marketing per l'ospitalità, analisi dati con Python), `address` (Palermo), `sameAs: []` (da completare), `worksFor`/`affiliation` solo con ciò che è nel brief (collabora con RankWit), collegato a `Organization` del progetto come `founder`.
- `companyNodes(c)`: `Organization` (o `LocalBusiness` se ha sede fisica verificata), `name`, `url` = website, `description`, `areaServed` (Sicilia o provincia), `knowsAbout` = ai_areas, `foundingDate` se c'è, `sameAs` = same_as + website; `address` (`PostalAddress`) e `geo` **solo** se `geo_precision === 'indirizzo'` e `address` presente; `subjectOf`/`mainEntityOfPage` → WebPage.
- `eventNodes(e)`: `Event` completo: `name`, `description`, `startDate` (con ora e fuso `+01:00`/`+02:00` corretto per la data, se `start_time`), `endDate`, `eventAttendanceMode` (Offline/Online/Mixed), `eventStatus` (`EventScheduled`, `EventCancelled`, `EventPostponed`, `EventMovedOnline`; se concluso resta `EventScheduled` — schema.org non ha "concluso"), `location` (`Place` con `address`/`geo` se presenti, `VirtualLocation` con url per online, entrambi per ibrido), `organizer` (`Organization` con url se c'è), `offers` solo se `price` noto (`gratuito` → price 0 EUR; "a pagamento" → `Offer` senza prezzo inventato, con url), `url` = event_url, `image` = OG generata.
- `articleNodes(a)`: `Article` (`headline`, `description`, `author` → Person `@id`, `publisher` → Organization, `datePublished`, `dateModified`, `inLanguage`, `citation` = sources, `image` OG, `about`) + `FAQPage` con le FAQ.
- `promptNodes(p)`: `HowTo` (con `step` derivati da `how_to_use`) **o** `CreativeWork` (`text` = prompt_text, `genre: "prompt"`, `audience`, `educationalLevel`): scegli e motiva nel report (HowTo non dà più rich result, ma è semanticamente corretto).
- `itemListNodes`, `collectionPageNodes`: `ItemList` con `ListItem` (`position`, `url`, `name`) e `CollectionPage` con `mainEntity` → ItemList.

## 4. Immagini Open Graph (D-016)
Endpoint statico `src/pages/og/[...path].png.ts` che genera in build un PNG 1200×630 per **ogni** pagina (titolo, sezione, "AI Sicilia", colori dei token), con satori + `@resvg/resvg-js` e un font OFL incluso nel repo (es. Atkinson Hyperlegible o Source Sans 3, file `.woff`/`.ttf` in `src/assets/fonts/`). Comprimi (palette PNG o JPEG via sharp, < 80 KB). SeoHead punta a `/og/<path>.png`. La lista dei path si ricava dalle stesse funzioni di `data.ts` che usano le pagine (aggiungi un helper `allPagePaths()` in `src/lib/seo/`).

## 5. robots, sitemap, llms
- `robots.txt` (endpoint): beta → `User-agent: *` / `Disallow: /`; production → `Allow: /`, regole esplicite di consenso per GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended (salvo diversa decisione dell'utente: tienili in una costante), `Sitemap:` assoluta.
- Sitemap segmentate (aziende, eventi, articoli, prompt, pagine) + indice, `lastmod` reale dai dati (`last_verified`, `updated_at`, `tested_at`; pagine hub = data più recente dei loro elementi). Generate **solo in production** (in beta gli endpoint non si generano o restituiscono 404: scegli una soluzione statica pulita). Niente pagine `noindex` nelle sitemap.
- `llms.txt` (formato llmstxt.org): titolo, sintesi del progetto, sezioni con link alle pagine chiave (hub, province, metodologia, chi siamo, articoli, settori prompt) con descrizioni di una riga. `llms-full.txt`: estratto testuale delle sezioni chiave (metodologia, tabella aziende per provincia, elenco aziende con descrizione e fonte, eventi in programma, sommari degli articoli con risposta diretta). Generati in build dai dati, in entrambe le modalità.

## 6. Feed RSS
`/rss/articoli.xml` (articoli pubblicati) e `/rss/eventi.xml` (prossimi eventi), RSS 2.0 valido, date RFC 822, link assoluti. Usa `@astrojs/rss` se vuoi (aggiungilo a package.json).

## 7. `public/_headers` (Cloudflare Pages)
- Sicurezza su `/*`: `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrittiva (camera, microphone, geolocation, interest-cohort…), `X-Frame-Options: DENY` e `Content-Security-Policy: frame-ancestors 'none'` (il resto della CSP è nel meta generato da Astro: verifica che non si contraddicano).
- Cache: `/_astro/*` → `public, max-age=31536000, immutable`; `/og/*` → 1 settimana; HTML → `public, max-age=0, must-revalidate`; `/pagefind/*` → 1 giorno.
- In beta: `X-Robots-Tag: noindex, nofollow` su `/*` (rafforza il meta). In production non deve esserci: genera `_headers` in build o documenta il passaggio (preferibile: endpoint/integrazione che lo scrive in base a `PUBLIC_SITE_MODE`).
- `public/_redirects`: predisponi (commentato) il redirect `www` → apex per quando ci sarà il dominio; nota che su Cloudflare il redirect host si fa meglio con una Redirect Rule (documentalo nel report).

## 8. GEO
- Verifica che ogni tipo di pagina abbia il paragrafo di risposta diretta (`.answer`) in apertura: se manca, segnalalo per pagina.
- Date di aggiornamento visibili in pagina e coerenti con `dateModified`.
- Entità coerenti (nomi di province e città come in `provinces.ts`).

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Al termine: `npm run build`, `npm run validate` e `PUBLIC_SITE_MODE=production npm run build && PUBLIC_SITE_MODE=production npm run validate`: zero errori di tua competenza (title, description, canonical, JSON-LD, robots, llms, _headers). Prova almeno 3 JSON-LD (azienda, evento, articolo) con un validatore schema.org se raggiungibile, altrimenti controllo manuale dei tipi.
- Report finale (max 200 parole): cosa hai fatto, file toccati, scelte (es. HowTo vs CreativeWork), problemi delle pagine da correggere, problemi aperti.
