# Design v2: "Basalto e maiolica digitale"

Richiesta dell'utente: qualcosa di diverso dal solito, non "AI-slop". Un mix dei colori della Sicilia e del tech. Niente colori accesi e niente viola da AI. La v1 era pulita ma generica (crema, serif, arancio): questa spec la sostituisce per quanto riguarda il linguaggio visivo. Restano invariati i vincoli di performance e accessibilità (Lighthouse 100, WCAG AA, CLS 0, budget JS/CSS) e tutti i contenuti e la struttura delle pagine.

## Idea
L'isola letta come un **dataset**. Due materiali siciliani veri incontrano due codici del tech:
- **pietra lavica dell'Etna** (basalto grafite) → superfici scure, bande, header della home;
- **calce e pietra di Noto** (bianco calce, ocra dorata) → fondi chiari, dettagli caldi;
- **maiolica di Caltagirone** (blu cobalto spento) → colore primario, link, stati attivi;
- **pistacchio di Bronte e fico d'india** (verde oliva-pistacchio spento) → dati, tag, conferme;
- **terracotta** → accento, CTA, date;
- **il codice tech**: coordinate geografiche, griglie cartografiche, numeri in monospazio, schede che sembrano spec sheet tecniche, punti dati sulla mappa.

Niente cliché (carretti, Trinacria, limoni, pupi). Niente gradienti viola/blu, glassmorphism, glow neon, blob, emoji, illustrazioni 3D.

## Palette (token in `src/styles/tokens.css`, sostituiscono i valori v1; i nomi delle variabili esistenti restano, se ne aggiungono)
Light:
| Token | Valore | Uso |
|---|---|---|
| `--c-bg` | `#F4F1EA` calce | fondo pagina |
| `--c-surface` | `#FBFAF7` | card |
| `--c-surface-2` | `#ECE7DC` | fasce, footer, celle |
| `--c-border` | `#D8D1C3` | filetti |
| `--c-text` | `#1A1E21` basalto | testo |
| `--c-text-muted` | `#555B5F` | testo secondario |
| `--c-primary` | `#24577A` blu maiolica | link, attivi |
| `--c-primary-hover` | `#183F59` | |
| `--c-primary-soft` | `#DDE7EE` | |
| `--c-accent` | `#A4502A` terracotta | date, CTA, dettagli (testo AA) |
| `--c-accent-soft` | `#F2DFD2` | fondo evidenziazioni |
| `--c-accent-strong` | `#8A4220` | testo terracotta su `--c-accent-soft` (es. variabili del prompt): 4.5:1 non è garantito con `--c-accent` |
| `--c-data` | `#5B6B2E` pistacchio | numeri, tag dati (testo AA) |
| `--c-data-soft` | `#E4E8D3` | |
| `--c-ochre` | `#C29A4E` pietra di Noto | solo decorativo (filetti, punti), mai testo |
| `--c-lava` | `#1C2124` | bande scure (header home, hero, footer) |
| `--c-lava-2` | `#252B2F` | |
| `--c-on-lava` | `#ECE7DC` | testo su lava |
| `--c-on-lava-muted` | `#A9AFA9` | |

Dark: fondo `#14181A`, surface `#1B2023`, surface-2 `#232A2E`, border `#343C41`, testo `#ECE7DC`, muted `#ABB0AA`, primary `#8FB9D6`, accent `#E0916A`, data `#AEBF7C`, ochre `#D3B06C`, lava `#0F1214`. Verifica tutti i contrasti testo ≥ 4.5:1 (scrivi uno script rapido o calcola a mano) e la mappa con i nuovi `--c-map-*` (terra `#E3DCCD`/hover `#D4E0E8`/attivo primary; in dark terra `#2A3236`).

## Tipografia
- **Familjen Grotesk** (variabile, OFL, `@fontsource-variable/familjen-grotesk`, file latin `wght` ~19 KB) per titoli, UI e testo. Pesi usati: 400, 600, 700. Titoli grandi in 700 con `letter-spacing: -0.02em`, interlinea stretta.
- **IBM Plex Mono 500** (`@fontsource/ibm-plex-mono`, latin ~15 KB) solo per dati: numeri, conteggi, coordinate, date in formato tecnico, etichette (`PA · 38.12°N 13.36°E`), codici provincia, badge "Beta".
- Self-hosted: copia i woff2 in `public/fonts/` (o importali via Astro con hash) e dichiara `@font-face` a mano con `font-display: swap`, `unicode-range` latin. **Preload** del solo Familjen. Fallback con metriche regolate (`size-adjust`, `ascent-override`, `descent-override`) su `Arial`/`system-ui` per CLS 0. Rimuovi il serif di sistema v1.

## Motivi grafici (tutti SVG/CSS, leggeri, senza immagini raster)
1. **Griglia cartografica**: un reticolo sottile (linee 1px, opacità bassa) come sfondo della banda scura della home e delle testate di sezione, con etichette di coordinate in mono ai bordi (es. `37°N`, `14°E`). CSS `background-image: linear-gradient` ripetuto, niente file.
2. **Maiolica digitale**: un modulo geometrico 4×4 ispirato alle piastrelle di Caltagirone ma costruito con linee e punti come un circuito (rombi, quarti di cerchio, nodi). Un solo SVG inline minuscolo (≤ 1 KB) usato come `mask`/background ripetuto a bassa opacità in 2–3 punti al massimo: fascia CTA "Segnala", separatori di sezione, angolo dell'hero. Discreto, mai a pieno colore.
3. **Sicilia a punti**: nella home, l'hero su banda `--c-lava` ha a destra la Sicilia disegnata con i path del map-engineer (`src/components/map/provinces-paths.ts`) in contorno sottile ocra + i **punti reali** di aziende (terracotta) ed eventi futuri (blu chiaro) proiettati con la funzione `project` esistente. Legenda in mono. È l'elemento identitario del sito: dati veri, non decorazione. Zero JS.
4. **Schede come spec sheet**: card azienda/evento/prompt con intestazione in mono (`CT · STARTUP · 2021`), griglia chiave/valore con filetti, angolo superiore con un piccolo marker quadrato colorato per tipo (primary aziende, terracotta eventi, pistacchio prompt, ocra guide). Bordi 1px, raggio piccolo (4px): più tecnico, meno "card morbida".
5. **Numeri grandi**: i conteggi (aziende, eventi, prompt, guide) in mono grande con etichetta piccola maiuscola sotto, nello stile di una dashboard.

## Pagine chiave
- **Header**: su tutte le pagine sfondo `--c-surface` con filetto; logo "AI Sicilia" in Familjen 700 con un piccolo glifo quadrato a punti (2×2, colori primary/terracotta/pistacchio/ocra) a sinistra, SVG inline. Badge Beta in mono su `--c-data-soft`. Menu: voce attiva con sottolineatura spessa terracotta, non pill colorata.
- **Home**: hero a tutta larghezza su `--c-lava` con griglia cartografica, H1 a sinistra (bianco calce), risposta diretta, due CTA (primaria: "Esplora le aziende"; secondaria contorno: "Prossimi eventi"), a destra la Sicilia a punti. Sotto, fascia di 4 numeri grandi (aziende / eventi in programma / guide / prompt) che sono anche gli accessi rapidi. Poi prossimi eventi, mappa province, ultime guide, CTA Segnala con maiolica digitale.
- **Directory e province**: testata con conteggio grande in mono e coordinate della provincia; tabella per provincia in stile tabella dati (numeri in mono allineati a destra, barra orizzontale proporzionale in pistacchio).
- **Schede azienda/evento**: spec sheet (vedi punto 4), box "Fonte e ultima verifica" con icona e data in mono, come un timbro di verifica.
- **Prompt**: il blocco del prompt è un "terminale chiaro": fondo `--c-surface-2`, font mono, variabili `{tra_graffe}` evidenziate in terracotta su `--c-accent-soft`, pulsante Copia in alto a destra.
- **Articoli**: colonna di lettura in Familjen 400 18px, interlinea 1.7; box "In pratica" con bordo sinistro pistacchio e titoletto in mono; indice dei contenuti in mono piccolo.
- **Footer**: banda `--c-lava` con griglia cartografica leggerissima, link in `--c-on-lava`.

## Microinterazioni
Solo CSS: hover con cambio di bordo/colore (120 ms), focus visibile spesso (3px primary, offset 2px). `prefers-reduced-motion` rispettato. Nessuna animazione d'ingresso.

## Vincoli che non cambiano
CSS ≤ 20 KB gzip, JS iniziale come prima (0 su pagine di testo, salvo toggle tema), font totali ≤ 40 KB, CLS 0, Lighthouse 100 mobile e desktop, contrasti AA in light e dark, nessuna immagine raster nuova.
