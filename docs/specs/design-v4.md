# Design v4: dal mockup approvato a tutto il sito

L'utente ha approvato il mockup `docs/mockups/hp-c-finale.html` (screenshot in `docs/mockups/shots/hp-c-finale-*.png`): layout e colori della variante "Bricolage", font della variante "Unbounded". **È la fonte di verità visiva.** Sostituisce `design-v2.md` e `design-v3.md`. La v3 è stata bocciata: il codice attuale in `src/` ne contiene una parte, da sovrascrivere senza conservarne nulla di visivo.

## Fondamenta (da estrarre dal CSS del mockup)
- **Font** self-hosted, woff2 latin, con licenze OFL:
  - **Unbounded** variabile per H1–H3, logo, numeri grandi, readout e titoli delle card principali;
  - **Figtree** variabile per testo, etichette, bottoni, form e UI.
  - Preload solo di Figtree e di Unbounded se serve all'LCP (l'H1 della home è l'LCP: misura). `font-display: swap` con fallback metrici regolati (Arial/Helvetica con `size-adjust`) per CLS 0. Rimuovi Public Sans, Newsreader, Familjen e IBM Plex dai file e da package.json.
- **Token** (`src/styles/tokens.css`) con i valori esatti del mockup:
  - bianco, grigio freddo per le superfici;
  - inchiostro `#101418`, blu mare `#0B5FA5`, arancia `#F07A1A` (testo scuro sopra), turchese `#0B6B75` per gli eventi;
  - linee, ombre "piene" (offset netti, non sfocate), raggi.

  Mappa i nomi esistenti (`--c-bg`, `--c-primary`…) sui nuovi valori o rinominali in modo coerente.
- **Dark mode**: il mockup è solo chiaro. Prepara una dark mode coerente (fondo `#0F1418` circa, testo `#E9ECEF`, blu chiaro per i link, arancia invariata, turchese schiarito), con contrasti AA e toggle funzionante. È secondaria: la versione principale è la chiara.
- **Componenti** da allineare al mockup:
  - header con logo "AI **Sicilia**" e bottone Segnala arancia con ombra piena;
  - eyebrow con il rombo arancia;
  - H1 con l'evidenziazione a blocco inclinato (riusabile come `<mark class="blk">`);
  - campo di ricerca con bordo e ombra piena;
  - fascia blu dei numeri;
  - card con bordo inchiostro sottile e ombra piena all'hover o di default come nel mockup;
  - chip ed etichette;
  - barre per provincia;
  - riquadro "In evidenza" blu pieno con la nota di trasparenza;
  - prompt come terminale chiaro;
  - CTA "Segnala" arancia;
  - footer.
- **Mappa**: `ProvinceMapPreview` e `InteractiveMap` vanno restilizzati come nel mockup: province in tinte di blu per intensità, quelle a zero in grigio, punti aziende arancia, cerchi eventi turchese, etichette con conteggi. Il frontend-builder può modificare **solo lo stile e il markup visivo** dei componenti in `src/components/map/`, non la logica né gli eventi DOM.

## Pagine
- **Home**: riproduci il mockup con dati e testi reali. Il copy dell'hero e delle sezioni è quello del mockup: è stato scritto con la skill copywriter-umano ed è approvato.
- **Tutte le altre**: stesso linguaggio. Ogni pagina hub (aziende, eventi, impara, prompt, province) apre con una testata coerente: eyebrow, H1 Unbounded con eventuale blocco arancia su una parola chiave, risposta diretta e, dove c'è, la ricerca o i filtri in stile mockup.
  - **Schede di dettaglio**: colonna leggibile e dati chiave in riquadri con ombra piena.
  - **Guide**: corpo in Figtree da 18px, interlinea 1.7, misura di 68 caratteri. Box "In breve" e "In pratica" nello stile delle card del mockup. Tabelle leggibili. Indice laterale su desktop.
  - **Prompt**: blocco terminale come nel mockup.
  - **Pagine istituzionali**: testata, colonna di lettura e riquadri.
- Leggibilità prima dell'effetto: Unbounded solo per i titoli e i numeri, mai per paragrafi o testi lunghi. Tracking negativo solo sui titoli grandi.

## Vincoli invariati
Lighthouse 100/100/100/100 mobile e desktop (mediana di 3, D-029). Poi:
- CSS ≤ 20 KB gzip;
- font totali ≤ 80 KB;
- CLS 0;
- WCAG AA in chiaro e in scuro, focus visibile, target da 44px;
- nessuno scroll orizzontale a 320px;
- zero JS dove non serve.

Contratti dati, SEO e mappe invariati. Nessun `<meta>` a mano.
