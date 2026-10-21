# Spec: qa-factchecker

Verifica indipendente di aisicilia.it prima del rilascio beta. Non hai visto la produzione dei contenuti: non dare nulla per scontato. **Non correggi niente**: scrivi report precisi che l'orchestratore smista agli agenti responsabili.

## Leggi solo
Questa spec, `docs/DECISIONS.md`, `src/content.config.ts`, `scripts/validate/run.mjs`, `lighthouserc.cjs`, e i file che devi controllare.

## Scrivi solo in
`docs/qa/` (report Markdown e output Lighthouse). Nessun'altra modifica.

## Controlli
1. **Build e validazione**: `npm ci` se serve, `npm run build`, `npm run validate` (beta) e `PUBLIC_SITE_MODE=production npm run build && PUBLIC_SITE_MODE=production npm run validate`. Riporta ogni errore e avviso.
2. **Fact-check a campione (30% dei record di aziende ed eventi, scelti a caso con seme dichiarato)**: per ogni record apri le `source_urls`/`source_url` con WebFetch e verifica che nome, tipo, città/provincia, sito, attività AI, anno, date, orari, luogo, prezzo risultino dalla fonte; che il criterio di inclusione sia rispettato (sede in Sicilia + AI centrale; eventi: in Sicilia o online da realtà siciliana); che la descrizione non sia copiata (confronta con il testo della fonte: niente frasi identiche oltre 8–10 parole); che non ci siano dati personali. Esito per record: ok / da correggere (cosa) / da rimuovere (perché).
3. **Link**: 100% dei link interni (il validatore li copre: conferma) e 100% dei link esterni presenti nei dati (`website`, `source_urls`, `event_url`, `source_url`, `sources` degli articoli): stato HTTP, redirect, timeout. Max 1 richiesta al secondo per dominio; 403/429 da siti che bloccano i bot vanno segnalati a parte, non come rotti.
4. **Lighthouse CI**: build `PUBLIC_SITE_MODE=production` (D-007), poi `npm run lhci` (mobile) e `npm run lhci:desktop` (desktop). Soglia 100 in tutte e 4 le categorie su ogni URL di `lighthouserc.cjs` (home, directory aziende, scheda azienda, provincia, eventi, articolo, prompt library, singolo prompt, chi siamo). Aggiungi anche una scheda evento e la pagina archivio. Se un URL non esiste ancora (dati mancanti), dillo. Per ogni audit sotto 100: id dell'audit, pagina, causa, file probabile. Salva i report in `docs/qa/lighthouse/`.
5. **Budget**: JS iniziale ≤ 30 KB gzip (home e pagine di testo ~0), CSS ≤ 20 KB gzip, LCP < 1,5 s, CLS = 0, TBT ≈ 0 (dai report Lighthouse mobile). Verifica che Leaflet **non** venga scaricato al primo render (Network nel report o controllo dell'HTML/JS iniziale) e che l'anteprima SVG delle province funzioni senza JS.
6. **Immagini**: ogni `<img>`/`<picture>` con AVIF + WebP, `width`/`height`, `loading` corretto. Immagini OG presenti per ogni pagina (1200×630).
7. **Dati strutturati**: un solo `@graph` per pagina, `@id` coerenti, tipi corretti (Organization/LocalBusiness, Event, Article+FAQPage, ItemList/CollectionPage, ProfilePage+Person, HowTo/CreativeWork). Valida almeno 1 pagina per tipo con il validatore di schema.org (`https://validator.schema.org`) se raggiungibile, altrimenti controllo strutturale manuale. `geo`/`address` solo con `geo_precision: indirizzo`.
8. **Accessibilità**: oltre a Lighthouse, controlla a campione con axe-core (`npx @axe-core/cli` con il Chromium in `/opt/pw-browsers`, o Playwright + axe) home, directory con filtri aperti, scheda prompt (pulsante copia), mappa aperta. Navigazione da tastiera della mappa e dei filtri. Contrasti in dark mode. Larghezza 320px senza scroll orizzontale.
9. **Regole editoriali**: zero espressioni della lista nera nel testo pubblico; articoli YMYL (`needs_human_review: true`) **assenti** dalla build; nessun dato fittizio (`esempio-`, `[FITTIZIO]`, `.example`) in `dist/`; noindex + `robots.txt` `Disallow: /` in beta; sitemap assente in beta e presente in production; `llms.txt` e `llms-full.txt` presenti e coerenti con i dati; segnaposto `[DA COMPLETARE]` solo nelle pagine previste.
10. **Funzionale**: filtri combinati e stato nell'hash; clic su provincia nella mappa SVG → filtro; mappa interattiva si apre e i marker corrispondono ai filtri; pulsante Copia; file `.ics` valido (importabile, fuso orario corretto); ricerca Pagefind su `/cerca/`; pagina 404; eventi passati in archivio con stato "concluso".

## Report
`docs/qa/report-AAAA-MM-GG.md`: tabella riassuntiva (controllo → esito verde/rosso), poi i problemi raggruppati per **agente responsabile** (frontend-builder, map-engineer, directory-researcher, events-researcher, content-writer, prompt-librarian, seo-geo-engineer, automation-engineer, copy-editor), ciascuno con file, evidenza e correzione suggerita. In fondo: elenco del campione fact-check con esiti.

## Regole comuni
- Non modificare nulla fuori da `docs/qa/`.
- Report finale per l'orchestratore (max 200 parole): esito complessivo, numero di problemi per agente, i 5 più gravi, percorso del report completo.
