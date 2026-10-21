# Spec: frontend-builder

Costruisci tutte le pagine e i componenti di aisicilia.it (Astro 7, statico). Il risultato deve fare 100/100 su Lighthouse in tutte e quattro le categorie, mobile e desktop.

## Leggi solo
- questa spec, `docs/copy-rules.md` (per il microcopy)
- `src/content.config.ts`, `src/lib/data.ts`, `src/lib/related.ts`, `src/lib/provinces.ts`, `src/lib/taxonomies.ts`, `src/lib/site.ts`
- `src/lib/seo/types.ts`, `src/lib/seo/meta.ts`, `src/lib/seo/jsonld.ts` (contratti: li **usi**, non li modifichi)
- quello che c'è già in `src/layouts`, `src/components`, `src/styles`, `src/pages`

## Scrivi solo in
`src/components/` (esclusa `src/components/map/`), `src/layouts/`, `src/pages/`, `src/styles/`, `public/favicon.svg`.
Non toccare: `src/lib/**` (se ti serve una funzione nuova, scrivila in un componente o segnalala), `src/components/map/**` (map-engineer), `src/content/**`, `src/fixtures/**`.

## Come lavori
- Sviluppa con i dati fittizi: `USE_FIXTURES=1 npx astro build` (oppure `npm run dev:fixtures`). Le collezioni reali sono vuote o in arrivo: **ogni pagina deve funzionare con 0 record** (stato vuoto cordiale) e con 100.
- I dati si leggono solo da `src/lib/data.ts` (`getCompanies`, `getUpcomingEvents`, `getPastEvents`, `getArticles`, `getPrompts`…). Mai `getCollection` diretto: lì ci sono le regole editoriali.
- Ogni pagina usa `BaseLayout` e passa `seo: PageSeo` con: `title`/`description` da `meta.*()` in `src/lib/seo/meta.ts`, `path` canonico con slash finale, `breadcrumbs`, e `jsonld` dalle funzioni di `src/lib/seo/jsonld.ts` (oggi restituiscono `[]`: il seo-geo-engineer le implementa dopo, tu le chiami già). Niente `<meta>` scritti a mano nelle pagine.
- Pagine istituzionali senza funzione dedicata in `meta.ts`: scrivi title (≤ 60) e description (70–155) unici direttamente nella pagina.

## Pagine (tutte, anche con 0 record)
| Route | Contenuto |
|---|---|
| `/` | H1 + paragrafo di risposta diretta (cos'è il portale in 2–3 frasi), 4 accessi rapidi (Aziende, Eventi, Impara, Prompt) con conteggi reali, prossimi 3–4 eventi, mappa riassuntiva (anteprima SVG province con conteggi aziende), ultimi 3 articoli, CTA Segnala. |
| `/aziende/` | Risposta diretta con numeri reali (quante realtà, in quante province, data ultimo aggiornamento = `latestDate` dei `last_verified`), tabella riassuntiva "aziende per provincia" (dato citabile), mappa (anteprima SVG + mappa interattiva), filtri, lista schede, CTA "La tua azienda non c'è? Segnalala". |
| `/aziende/provincia/[provincia]/` | 9 pagine sempre generate. Conteggi reali, mappa centrata, lista aziende della provincia, ultimi eventi della provincia, 2–3 articoli dei settori rilevanti (`sectorsForProvince`), link alle altre province. Stato vuoto se 0. |
| `/aziende/[slug]/` | Scheda: nome (H1), tipo, città/provincia, descrizione, aree AI, settori serviti, sito (link esterno `rel="noopener"`), anno, startup innovativa (se true), mini mappa (anteprima statica + interattiva), box **Fonte e ultima verifica** ben visibile (link alle `source_urls`, data `last_verified`), link "Richiedi modifica o rimozione" → `/rimozione/?scheda=…` (solo testo, nessun dato inviato), correlate (`relatedCompanies`), eventi della stessa provincia. Nessun logo: badge con iniziali generato in CSS. |
| `/aziende/pagina/[n]/` | Solo se le aziende sono > 100 (D-014): pagine da 48. Con i dati della beta probabilmente non si genera: il codice deve esserci comunque. |
| `/eventi/` | Prossimi eventi (default), risposta diretta con numero eventi in programma e periodo coperto, filtri (provincia, formato incluso "online", pubblico, gratuito/a pagamento, mese), mappa (solo eventi con coordinate; gli online non hanno marker), vista calendario semplice per mese (liste raggruppate per mese, niente librerie), link all'archivio. |
| `/eventi/provincia/[provincia]/` | 9 pagine: prossimi eventi della provincia, aziende della provincia, stato vuoto con invito a segnalare (es. "Nessun evento in programma a Enna per ora. Ne conosci uno? Segnalalo."). |
| `/eventi/archivio/` | Eventi passati dal più recente, paginazione oltre 100 (`/eventi/archivio/pagina/[n]/`). |
| `/eventi/[slug]/` | Scheda: titolo (H1), stato (in programma / concluso / annullato / rinviato), date e orari, formato, luogo, organizzatore, prezzo, pubblico, temi, descrizione, link all'evento, box fonte e verifica, mini mappa se ha coordinate, pulsante **Aggiungi al calendario** che scarica `/eventi/[slug]/evento.ics`. Se concluso resta online con avviso "Evento concluso" e link all'archivio. |
| `/eventi/[slug]/evento.ics` | Endpoint statico (`src/pages/eventi/[slug]/evento.ics.ts`) che genera un VCALENDAR valido (RFC 5545, fuso Europe/Rome, UID stabile `slug@aisicilia.it`, righe ≤ 75 ottetti, CRLF). |
| `/impara/` | Hub: risposta diretta, articoli in ordine di lettura (`order`), filtro per settore e livello come link/ancore (niente JS necessario), link alla prompt library. |
| `/impara/[slug]/` | Articolo: H1, risposta diretta (`answer`), meta (autore con link a `/chi-siamo/`, data pubblicazione e **aggiornamento** visibili, tempo di lettura, livello), indice dei contenuti dagli H2, corpo Markdown (stile per `aside.in-pratica`), FAQ (da frontmatter, `<details>`), fonti (lista numerata da `sources`), prompt correlati (`promptsForArticle`), aziende/eventi pertinenti, **articolo successivo** (`nextArticle`). Firma autore in fondo con link a Chi siamo. |
| `/prompt/` | Hub: risposta diretta, 8 settori con conteggio, come si usa un prompt (3–4 righe), tutti i prompt raggruppati per settore. |
| `/prompt/[settore]/` | 8 pagine: prompt del settore con caso d'uso e livello, articoli collegati (`articlesForSector`). |
| `/prompt/[settore]/[slug]/` | Prompt: titolo (H1), obiettivo, testo del prompt in un blocco con variabili `{evidenziate}`, pulsante **Copia** (unica isola JS della pagina, `navigator.clipboard`, feedback "Copiato" in `aria-live`; senza JS il testo resta selezionabile), tabella variabili (nome, descrizione, esempio), come usarlo, esempio di input, output atteso, limiti e avvertenze in evidenza, strumenti compatibili, livello, data test. Correlati: altri prompt del settore, articoli. |
| `/chi-siamo/` | Vedi sezione dedicata sotto. |
| `/segnala/` | Form "Segnala azienda o evento" (D-015): `<form method="post" action={FORMS.segnala}>`. Campi: tipo (azienda/evento), nome, sito o link, provincia, perché c'entra l'AI, fonte, email per eventuale risposta (facoltativa, con nota privacy). Se `FORMS.segnala` è vuoto: form `disabled` con avviso visibile "Modulo in attivazione" e testo TODO in commento HTML. Spiega i criteri di inclusione con link a `/metodologia/`. |
| `/rimozione/` | Form "Richiedi modifica o rimozione" (stesso schema; campi: pagina interessata, cosa va corretto o rimosso, ruolo del richiedente, email). Spiega i tempi di risposta `[DA COMPLETARE: tempi di risposta]` e che si pubblicano solo dati aziendali. |
| `/contatti/` | Contatti del progetto: `[DA COMPLETARE: email di contatto]`, form contatti (FORMS.contatti), link a Segnala e Rimozione. |
| `/metodologia/` | Come raccogliamo e verifichiamo i dati (testo dettagliato, è un segnale di affidabilità): fonti usate (tipi), criterio di inclusione aziende (sede operativa in Sicilia **e** AI centrale nel prodotto/servizio, dichiarata su sito o fonte; esclusi gli operatori generalisti che "usano anche ChatGPT"), criterio eventi (in Sicilia, oppure online se organizzati da realtà siciliane), cosa significano "verificato" e "ultima verifica", geolocalizzazione (precisione indirizzo/città), descrizioni riscritte, niente dati personali, niente loghi, frequenza aggiornamenti, come chiedere correzioni, nota sulle province (liberi consorzi comunali e città metropolitane dal 2015), uso dell'AI nel progetto (agenti AI per ricerca e bozze, verifica e responsabilità editoriale di Elvio). Tabella con i conteggi attuali per provincia. |
| `/privacy/` | Informativa privacy per un sito statico senza cookie né analytics: titolare `[DA COMPLETARE: dati del titolare]`, dati trattati solo via form (fornitore esterno `[DA COMPLETARE: Formspree/Tally]`), log tecnici dell'hosting (Cloudflare), diritti GDPR, contatti. Tono chiaro. Segnaposto evidenziati con `<span class="todo">`. |
| `/note-legali/` | Note legali: natura del progetto (indipendente, gestito da Elvio Leonardi), esclusione di responsabilità sui dati di terzi, marchi citati appartengono ai titolari, licenza contenuti `[DA COMPLETARE: licenza]`, link a metodologia e rimozione. |
| `/cerca/` | Ricerca Pagefind: input `<form action="/cerca/" role="search">` con parametro `q`; la UI Pagefind (`/pagefind/pagefind-ui.js` + css) si carica **solo** su questa pagina e solo quando l'utente interagisce o arriva con `?q=`. `noindex: true` nella PageSeo. |
| `404` (`src/pages/404.astro`) | Pagina utile: messaggio breve, campo di ricerca (verso `/cerca/`), link alle 4 sezioni. `noindex: true`. |

Ogni pagina che non ha un link dal menu deve essere raggiungibile da almeno un'altra pagina (lo script di validazione segnala le pagine orfane). Pagine provincia: linkate dalla tabella per provincia e dalla mappa SVG.

## Chi siamo (brief §8)
Il progetto è ideato e gestito **in autonomia da Elvio Leonardi**: non è un ente, un'associazione o un'agenzia. Usa **solo** queste informazioni, senza aggiungere titoli, numeri, premi o anni:
- Consulente freelance SEO, GEO (Generative Engine Optimization) e Google Ads, con base a Palermo
- Specializzato in ospitalità e turismo, su cui si concentra in modo esclusivo dal 2024
- Collabora con RankWit come SEO & AI Search Specialist, seguendo strutture alberghiere sulla visibilità nella ricerca tradizionale e nelle risposte dei motori AI
- Ha sviluppato strumenti per misurare la visibilità dei brand nelle risposte dei modelli AI, ad esempio un generatore di query per l'analisi GEO con tassonomia per intento: scoperta, confronto, transazionale, informativo
- Docente di AI e Digital Marketing per Confesercenti: formazione rivolta a imprese e professionisti
- Ideatore di Protocollo Disintermediazione, servizio di consulenza per aiutare le strutture ricettive indipendenti a ridurre la dipendenza dalle OTA e aumentare le prenotazioni dirette
- Costruisce portali editoriali automatizzati con sistemi multi-agente AI, gli stessi metodi usati per realizzare aisicilia.it
- Competenze tecniche: Python/pandas per l'analisi dati SEO, SEO tecnico (crawling, Search Console, dati strutturati, hreflang), automazione con AI
- Esperienze precedenti in Google, Liu Jo e Plenitude
- "Perché aisicilia.it": rendere l'AI comprensibile e usabile per le imprese siciliane, mappare l'ecosistema locale e dare visibilità a chi lo anima

Struttura: intro breve in prima persona → percorso → competenze AI e GEO → formazione → perché questo progetto → come lavoriamo sui dati (link a `/metodologia/`) → contatti.
Segnaposto visibili (`<span class="todo">`): `[DA COMPLETARE: foto]` (box segnaposto con dimensioni fisse, niente immagine), `[DA COMPLETARE: link LinkedIn]`, `[DA COMPLETARE: email di contatto]`, `[DA COMPLETARE: ruolo esatto in Google / Liu Jo / Plenitude]`. Non citare nomi di clienti. JSON-LD: chiama `profilePageNodes()`.

## Design (brief §10)
- Usa i token di `src/styles/tokens.css` (palette mare/pietra/agrumi, già con dark mode). Puoi aggiungere token, non colori sparsi.
- Identità siciliana senza cliché: niente carretti, Trinacria, limoni disegnati. La firma visiva è sobria: titoli serif, accento arancio usato con misura, fondo pietra, mappa delle province come elemento ricorrente.
- **Toggle tema** chiaro/scuro/sistema nell'header: piccolo script inline (già c'è quello che applica la preferenza salvata, tienilo prima del primo paint), `localStorage` in try/catch, pulsante accessibile con `aria-pressed` o menu.
- Badge "Beta" visibile in header. Logo testuale "AI Sicilia".
- Mobile-first: gutter 16px, nessuno scroll orizzontale a 320px, aree cliccabili ≥ 44px, menu che va a capo o si comprime senza JS se possibile.
- Card per aziende/eventi/prompt/articoli come componenti riusabili (`CompanyCard`, `EventCard`, `ArticleCard`, `PromptCard`), con il link principale sul titolo (un solo link per card verso la scheda, niente card interamente cliccabili con link annidati).
- Date in italiano (`formatDate`), orari "18:30".

## Filtri delle liste (aziende ed eventi)
- Isola in TypeScript vanilla (`<script>` del componente, D-005): le schede sono già nell'HTML con `data-*` (provincia, tipo, aree, settori, formato, pubblico, prezzo, mese). I filtri nascondono/mostrano con l'attributo `hidden`, aggiornano un contatore in `aria-live="polite"` e lo stato nell'hash (`#provincia=catania&tipo=startup`). Nessun URL indicizzabile nuovo; canonical sempre alla pagina base.
- Senza JS: i filtri non si vedono (render con `hidden` rimosso via JS) e la lista è completa; le province restano link alle pagine provincia.
- Contratto con la mappa (map-engineer): ascolta l'evento `aisicilia:province-select` (`detail: { province: string | null }`) per impostare il filtro provincia; quando i filtri cambiano emetti `aisicilia:filter-change` con `detail: { visibleIds: string[] }` sul `document`.
- Ricerca testuale nella directory: input che filtra per nome/descrizione/città sulle schede presenti.

## Mappe
Non scrivi codice Leaflet. Usi i componenti del map-engineer in `src/components/map/` (se non esistono ancora quando inizi, prepara nel template un contenitore con dimensioni fisse e un commento `<!-- MAP: ... -->`; li integra l'orchestratore):
- `ProvinceMapPreview.astro` — props `{ counts: Record<ProvinceSlug, number>; mode: 'link' | 'filter'; basePath: '/aziende/provincia/' | '/eventi/provincia/'; active?: ProvinceSlug; label: string }`
- `InteractiveMap.astro` — props `{ points: { id: string; lat: number; lng: number; title: string; url: string; province: ProvinceSlug; subtitle?: string }[]; center?: [number, number]; zoom?: number; height?: number; label: string }`

## Performance (vincolante, brief §4.1)
- Zero JS di default. Isole consentite: toggle tema (inline), filtri liste, pulsante copia, ricerca (`/cerca/`), mappa (del map-engineer). Mai `client:load`.
- JS iniziale ≤ 30 KB gzip per pagina (home e pagine di testo idealmente 0 KB oltre al toggle tema). CSS ≤ 20 KB gzip, niente CSS inutilizzato.
- Nessuna immagine raster nella beta salvo necessità; se servono, solo tramite `src/components/Img.astro` (AVIF + WebP). Icone SVG inline, mai icon font.
- CLS = 0: dimensioni fisse per mappe, box segnaposto, badge.
- Prefetch: aggiungi `data-astro-prefetch` ai link principali di navigazione (strategia hover già impostata).
- Accessibilità WCAG 2.1 AA: landmark, un solo H1, titoli senza salti (H2 → H3), etichette sui campi, focus visibile, contrasti dei token, `lang="it"`, testo alternativo, tabelle con `<caption>`/`<th scope>`, link esterni riconoscibili.

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Microcopy secondo `docs/copy-rules.md`.
- Al termine: `npm run build` (con dati reali, anche se vuoti), `USE_FIXTURES=1 npx astro build` e `npm run validate`. Gli errori su `robots.txt`, `llms.txt`, `_headers`, JSON-LD vuoto e OG sono del seo-geo-engineer: ignorali e citali nel report. Tutti gli altri devono essere zero.
- Report finale (max 200 parole): cosa hai fatto, file toccati, problemi aperti.
