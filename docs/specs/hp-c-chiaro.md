# Concept C in versione chiara: 3 varianti tipografiche

Feedback dell'utente: la struttura del concept C ("Mappa viva") va bene, ma vuole **una versione chiara**, e i font (Space Grotesk + DM Sans) sono "troppo AI": serve **più fantasia**. Si fanno 3 varianti chiare della stessa home, a mano (non per sostituzione automatica dei colori), ognuna con una tipografia di carattere.

## Base comune
- Parti da `docs/mockups/hp-c.html`: stessa struttura, stessi contenuti, stessi dati reali, stessa mappa (path e punti). Riscrivi il CSS per un **fondo chiaro**. Il copy resta quello di hp-c; puoi limarlo con la skill copywriter-umano solo se una frase stona con il nuovo tono.
- File: `docs/mockups/hp-c-<nome>.html`; font woff2 locali in `docs/mockups/fonts/` (con `npm pack @fontsource/...` o `@fontsource-variable/...` in una cartella temporanea, più le licenze OFL); screenshot full page a 1440 e 390 px in `docs/mockups/shots/hp-c-<nome>-1440.png` e `-390.png` (Playwright globale `/opt/node-tools/node_modules/playwright`, Chromium `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`).
- **Fondo bianco o quasi bianco freddo** (`#FFFFFF`–`#FBFBF9`), **non** beige, crema o avorio: l'utente li trova "da AI". Superfici secondarie in grigi chiarissimi o in tinte molto tenui del colore di marca.
- Mappa in versione chiara: terra in tinta tenue, confini sottili, punti e intensità per provincia leggibili. Etichette senza contorni pesanti. Tooltip chiaro.
- Testo principale scuro ma non nero puro; contrasti AA; niente viola, niente neon, niente gradienti arcobaleno.
- Consulta la skill `.claude/skills/ui-ux-pro-max/` per le regole UX (contrasto, leggibilità, spaziatura): `--domain ux` e `--domain color`. Per i font segui le indicazioni qui sotto: la ricerca google-fonts della skill dà risultati poco utili.
- Corpo del testo ≥ 17px, interlinea ≥ 1.6. I font di display si usano grandi e con coraggio: è lì che si vede la fantasia.
- Guarda gli screenshot, correggi, rifai. Nessuno scroll orizzontale a 390 px.

## Variante 1: "Unbounded" (tech solare)
- Titoli e numeri: **Unbounded** (variabile, OFL): largo, arrotondato, deciso, molto riconoscibile. Usalo per H1, H2, i numeri grandi e il logo.
- Testo: **Figtree** (variabile, OFL).
- Palette: bianco; inchiostro `#14213D` (blu notte molto scuro, solo per il testo); colore di marca **blu maiolica** `#1D4ED8` circa (verifica AA); accento **giallo limone** usato come evidenziatore e per i punti delle aziende sulla mappa (tinta tipo `#F5C518`, mai come colore del testo su bianco); eventi in **rosso corallo** tenue.
- Feeling: solare, contemporaneo, un po' pop ma pulito.

## Variante 2: "Young Serif" (mediterraneo editoriale)
- Titoli: **Young Serif** (OFL), un serif caldo e corposo con personalità. Per i numeri grandi va bene anche Young Serif.
- Testo: **Hanken Grotesk** (variabile, OFL).
- Palette: bianco; inchiostro `#1E1B18`; colore di marca **rosso ceramica/pomodoro** `#C8372D` circa (verifica AA); secondario **verde cappero** `#4F6B2F` per gli eventi; tinte tenui di entrambi per le superfici.
- Feeling: mediterraneo, autorevole, caldo senza essere rustico.

## Variante 3: "Bricolage" (espressivo, grafico)
- Titoli: **Bricolage Grotesque** (variabile, OFL, assi `wght`, `wdth` e `opsz`): ai corpi grandi usa larghezza e peso alti, così si vedono le forme particolari.
- Testo: **Bricolage Grotesque** a corpo piccolo (l'asse `opsz` lo rende leggibile) oppure **Onest** (OFL). Scegli e motiva.
- Palette: bianco; inchiostro `#101418`; colore di marca **blu mare profondo** `#0B5FA5` circa; accento **arancia di Sicilia** `#F07A1A` circa per i punti delle aziende e le CTA (testo scuro sopra, se serve per AA); eventi in **turchese** scuro.
- Feeling: grafico, da studio di design, energico ma ordinato.
