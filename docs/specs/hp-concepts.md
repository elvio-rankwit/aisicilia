# Concept homepage: 3 direzioni da mostrare all'utente

Feedback dell'utente sulla v3: "peggio di prima, i colori fanno cacare, i copy fanno cacare, molto poco innovativo". Prima di sviluppare il sito si fanno **3 mockup statici della sola home**, molto diversi tra loro. L'utente sceglie, poi si sviluppa.

## Regole comuni
- File singolo HTML con CSS inline, in `docs/mockups/hp-<lettera>.html`. Niente framework, JS solo se serve a mostrare un'interazione (massimo 30 righe). Font da file woff2 locali in `docs/mockups/fonts/`, presi con `npm pack @fontsource...` in una cartella temporanea: niente Google Fonts a runtime.
- **Dati reali**, letti da `src/content/` (aziende, eventi, articoli, prompt): numeri veri (oggi 37 aziende, 15 eventi in programma, 10 guide, 48 prompt), nomi veri (RankWit in evidenza con la nota di trasparenza), titoli veri di eventi e guide. Niente lorem ipsum, niente dati inventati.
- **Usa la skill** `.claude/skills/ui-ux-pro-max/` per davvero: leggi `SKILL.md` e `references/quick-reference.md`, lancia le ricerche indicate per il tuo concept (`--domain style`, `--domain color`, `--domain typography`, `--domain landing`, `--domain ux`) e applica le specifiche tecniche dello stile (sezione "CSS/Technical Keywords"). Nel report cita le ricerche fatte e cosa hai preso.
- **Copy**: nuovo, con la skill di scrittura `/root/.claude/skills/synced/30cb4036-b2c0-48e5-a408-a8b7b96fb2b9_3c89d9d6-9673-4fa7-8111-027b8e900396/copywriter-umano/SKILL.md` (modalità 2D e 2G, lista bandita). Frasi corte e concrete, numeri veri, nessun "scopri", "rivoluzione", "ecosistema" o trattino lungo. Il copy di ogni concept è diverso e coerente con il suo tono.
- Colori: **niente viola, niente neon, niente gradienti arcobaleno**. Contrasti AA. Light e dark se il concept lo prevede.
- La home deve contenere, nell'ordine che il concept preferisce: ricerca, accessi alle 4 sezioni con i numeri, RankWit in evidenza (con la nota di trasparenza), prossimi eventi, aziende per provincia (mappa o equivalente), ultime guide, un prompt in vetrina, fiducia (come verifichiamo i dati), CTA Segnala, footer.
- Responsive: va bene a 1440 e a 390 px, nessuno scroll orizzontale.
- Alla fine: screenshot full page a 1440 px e a 390 px con Playwright (`require('/opt/node-tools/node_modules/playwright')`, Chromium `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `file://` del mockup), salvati in `docs/mockups/shots/hp-<lettera>-1440.png` e `-390.png`. Guardali, correggi, rifai lo screenshot.

## Concept A: "Bento" (moderno, tech, modulare)
- Stile skill: **Bento Box Grid** (`"bento grid modular tech" --domain style`). Griglia asimmetrica con tile di dimensioni diverse (1×1, 2×1, 2×2), raggio 20–24px, ombre leggerissime, molto spazio negativo, gerarchia nitida. Ispirazione: le pagine prodotto Apple e le dashboard moderne, non un blog.
- La home è quasi tutta una bento grid: tile grande con la Sicilia a punti (path in `src/components/map/provinces-paths.ts`, punti reali delle aziende), tile "37 aziende" con mini-barre per provincia, tile del prossimo evento con data grande, tile RankWit in evidenza, tile "Prompt del giorno" con il testo e un finto pulsante Copia, tile guida in evidenza, tile ricerca.
- Font: un sans geometrico-umanista **largo** e moderno, per esempio Plus Jakarta Sans o Manrope (scegli con `--domain typography` e `--domain google-fonts`). Un solo font, pesi 400, 600 e 800.
- Colori: base neutra calda (bianco e sabbia chiarissima), un **colore di marca deciso ma non acceso** ispirato al mare siciliano (blu Tirreno profondo), un solo accento caldo (arancia o terracotta) usato con misura.
- Tono del copy: diretto, da prodotto. Hero corto (massimo 8 parole) più una riga di numeri.

## Concept B: "Magazine" (editoriale, autorevole)
- Stile skill: **Editorial Grid / Magazine** (`"swiss editorial grid typographic" --domain style`). Testata grande con "AI Sicilia" come un giornale, griglia asimmetrica a colonne, apertura con la guida principale (titolo grande, sommario, autore, data), colonna laterale "Agenda" con i prossimi eventi a mo' di palinsesto, numeri grandi tipografici, una citazione in evidenza, capolettera nella guida d'apertura, filetti sottili e sezioni con occhielli.
- Font: un serif display **con carattere** per titoli e testata, più un sans molto leggibile per il testo (scegli con `--domain typography`, evita Playfair e Inter). Corpo ≥ 17px, interlinea ≥ 1.6.
- Colori: carta bianca o avorio, inchiostro antracite (non nero puro), **un solo accento** ispirato alla Sicilia (rosso corallo di Sciacca o blu maiolica), usato per occhielli e date.
- Tono del copy: giornalistico, asciutto, autorevole. Titoli che dicono un fatto.

## Concept C: "Mappa viva" (dark morbido, tech, territoriale)
- Stile skill: un **dark mode morbido**, non nero OLED: fondo blu notte o basalto `#12171C`–`#1A2027`. Cerca `"dark mode tech premium" --domain style` e `"data visualization map" --domain style` e prendi solo ciò che resta sobrio: niente neon e niente glow forti.
- Hero a tutta larghezza dominato dalla **mappa della Sicilia** (SVG grande, province con bordi sottili, punti delle aziende in ambra e degli eventi in azzurro tenue, etichette dei capoluoghi), con H1 e ricerca sovrapposti a sinistra. Sotto: barra di numeri, poi sezioni su fondo leggermente più chiaro, card con bordo sottile.
- Font: un grotesk tecnico ma **non stretto** (per esempio Space Grotesk per i titoli più un sans leggibile per il testo, oppure un solo sans; scegli con `--domain typography`), con numeri tabellari.
- Colori: basalto e blu notte, testo `#E8E6E1` (non bianco puro), un accento ambra o arancia spenta e un azzurro tenue per i dati. Contrasti AA.
- Tono del copy: territoriale e concreto ("Dove si fa AI in Sicilia").
