# Design v3: leggibilità prima di tutto

Richiesta dell'utente (22/10/2026): "upgrade totale" della grafica. La base piace, ma i contenuti sono poco leggibili, c'è troppo contrasto e il font sembra stretto. Strumento: skill **UI/UX Pro Max** (`.claude/skills/ui-ux-pro-max/`, vedi `SOURCE.md`). Questa spec sostituisce `design-v2.md` per il linguaggio visivo. Restano invariati contenuti, struttura delle pagine, contratti dati/SEO/mappe e vincoli (Lighthouse 100 mobile e desktop, WCAG AA, CLS 0, CSS ≤ 20 KB gzip, JS minimo).

## Diagnosi della v2 (perché cambiamo)
1. **Font stretto**: Familjen Grotesk ha lettere compatte e spaziatura serrata. Va bene per titoli brevi, stanca nei testi lunghi.
2. **Contrasto aggressivo**: testo quasi nero su calce, bande scure (hero e footer lava) che si alternano a fondi chiari, arancio in molti punti. Ne risulta una pagina "dura".
3. **Densità**: card in stile spec sheet con griglie chiave/valore in monospazio. Con 30+ card l'occhio non trova il titolo.

## Cosa dice la skill e cosa adottiamo
Comando usato: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "editorial directory portal local business guides regional italian" --design-system -p "AI Sicilia" --density 3 --variance 4 --motion 2`, più ricerche `--domain typography` e `--domain ux`.
- **Adottato**: pattern *Marketplace / Directory*, cioè la ricerca come azione principale nell'hero, categorie, schede in evidenza, fiducia (fonti e verifica), CTA "segnala". Stile *Flat*: niente ombre né gradienti, hover semplici da 150–200 ms. Densità *spaziosa*. Movimento minimo. Regole UX: corpo ≥ 16px, interlinea 1.5–1.75, misura 65–75 caratteri, `text-wrap: balance` sui titoli, contrasto AA, focus visibile, target da 44px, niente card troppo cariche di testo, filtri visibili.
- **Non adottato**: la palette verde smeraldo e la coppia Inter + Playfair proposte dal generatore. Sono generiche e scollegate dall'identità siciliana che l'utente ha approvato. Teniamo la direzione cromatica di v2, ammorbidita.

## Tipografia
- **Testo e interfaccia: Public Sans** (variabile, OFL, `@fontsource-variable/public-sans`, file `latin-wght` circa 27 KB). È un sans aperto e largo, con occhio medio alto e cifre tabellari, nato per la leggibilità dei siti pubblici. Pesi usati: 400, 500, 600.
- **Titoli: Newsreader** (OFL, `@fontsource/newsreader` statico **600**, solo latin; se il file statico supera 30 KB, usa la variabile `wght` e rinunciaci solo se sfora il budget). È un serif disegnato per la lettura editoriale: dà autorevolezza e calore mediterraneo senza essere decorativo. Solo per H1, H2 e H3 e per i numeri grandi.
- **Niente monospazio.** IBM Plex Mono e Familjen vanno rimossi. Numeri e dati usano Public Sans con `font-variant-numeric: tabular-nums`. Le etichette usano Public Sans 600, 0.75rem, maiuscoletto con `letter-spacing: 0.04em`, al massimo una per card.
- **Preload** solo di Public Sans. Newsreader con `font-display: swap` e fallback metrico regolato (Georgia con `size-adjust`/`ascent-override`), Public Sans con fallback Arial regolato: CLS 0.
- **Scala** (rem, base 16px):
  - corpo articoli: 1.125rem (18px) desktop, 1.0625rem (17px) mobile, interlinea 1.7, paragrafi distanziati di 1.1em, misura `max-width: 68ch`;
  - corpo UI: 1rem, interlinea 1.6;
  - H1: clamp(2rem, 1.4rem + 2.6vw, 3rem), interlinea 1.15;
  - H2: clamp(1.5rem, 1.2rem + 1.2vw, 2rem), con margine sopra generoso (3rem);
  - H3: 1.25rem;
  - piccolo: 0.875rem (mai sotto 0.8125rem per testo leggibile);
  - nessun `letter-spacing` negativo sul corpo, -0.01em al massimo sui titoli grandi.

## Colore (meno contrasto, stessa anima)
Light, con fondi chiari ovunque: niente più bande scure nella home né footer lava pieno.
| Token | Valore | Note |
|---|---|---|
| `--c-bg` | `#F8F6F1` | calce caldo |
| `--c-surface` | `#FFFFFF` | card |
| `--c-surface-2` | `#F1EDE5` | fasce leggere, footer |
| `--c-border` | `#E3DDD2` | filetti morbidi (1px) |
| `--c-text` | `#2A2E33` | antracite, non nero (~12.8:1 su bg) |
| `--c-text-muted` | `#5D6369` | ~5.9:1 |
| `--c-primary` | `#235C80` | blu maiolica, link e azioni |
| `--c-primary-soft` | `#E6EEF4` | |
| `--c-accent` | `#A8532D` | terracotta: solo date, etichette "In evidenza", 1 CTA per pagina |
| `--c-accent-soft` | `#F6E7DD` | |
| `--c-data` | `#55672C` | pistacchio: conteggi e tag dati |
| `--c-ochre` | `#C79A45` | decorativo (punti mappa, filetti), mai testo |

Dark: fondo `#15191C`, surface `#1C2125`, testo `#E6E1D8` (non bianco puro), muted `#A9AEB2`, primary `#8EBBD8`, accent `#E39B74`, data `#AFC07E`. Verifica tutti i contrasti (≥ 4.5:1 per il testo, ≥ 3:1 per i bordi dei controlli) con uno script.
Regola: **un solo colore d'accento visibile per area**. Il link primario è blu, la terracotta è un dettaglio.

## Layout e componenti
- **Spazi**: scala spaziosa (8, 12, 16, 24, 32, 48, 64, 96px). Sezioni separate da 64–96px, nessun filetto dove basta lo spazio.
- **Header**: bianco, 72px, logo "AI Sicilia" in Newsreader 600 con il piccolo glifo a 4 quadrati (resta), badge Beta discreto (testo piccolo su `--c-primary-soft`). La voce attiva ha una sottolineatura di 2px in primary.
- **Home (pattern directory)**:
  1. **Hero chiaro**: H1, risposta diretta e **campo di ricerca grande** (form GET verso `/cerca/?q=`, senza JS), più due link rapidi ("Esplora le aziende", "Prossimi eventi"). A destra la Sicilia a punti in tonalità tenui (ocra e blu), con la griglia cartografica appena accennata o assente.
  2. **4 accessi** come categorie: numero grande in Newsreader, etichetta, una riga di descrizione.
  3. **In evidenza**: RankWit e i prossimi eventi.
  4. **Fiducia**: un blocco breve "Come verifichiamo i dati" (fonti, data di verifica, nessun dato personale) con link a Metodologia.
  5. Ultime guide.
  6. CTA "Segnala".
- **Card** (aziende, eventi, prompt, guide): bianche, bordo 1px morbido, raggio 12px, padding 24px, **niente ombre**. Contenuto: 1 etichetta piccola (tipo · provincia), titolo in Public Sans 600 da 1.125rem, 2 righe di descrizione (line-clamp), una riga di meta (città, data o settore) e al massimo 3 chip. **Niente griglie chiave/valore nelle card**: restano solo nelle schede di dettaglio, impaginate come lista di definizioni ariosa.
- **Schede di dettaglio**: colonna di lettura da 68ch, box "Fonte e ultima verifica" come riquadro tenue con icona, dati chiave in una griglia a 2 colonne su desktop.
- **Articoli**: colonna 68ch, corpo 18px con interlinea 1.7. Il box "In breve" è un riquadro bianco con filetto ocra a sinistra. "In pratica" è un riquadro `--c-primary-soft`. Le tabelle sono leggibili: righe alternate leggerissime, celle con padding 12px, intestazioni in 600. FAQ come accordion `<details>` con spazio tra le voci. Indice dei contenuti sticky a destra su desktop ≥ 1200px, in alto su mobile.
- **Prompt**: il blocco del prompt resta riconoscibile ma leggibile, in Public Sans 1rem con interlinea 1.65 su `--c-surface-2` (niente monospazio). Variabili `{…}` evidenziate in `--c-accent-soft`, pulsante Copia in alto a destra.
- **Filtri**: visibili (non nascosti), chip a 40–44px di altezza, stato attivo chiaro, contatore risultati.
- **Footer**: chiaro (`--c-surface-2`), testo muted, link leggibili; niente lava.
- **Mappa**: anteprima SVG con terra `#ECE6DA` (dark `#262D32`), confini bianchi sottili, numeri delle province in Public Sans 600.

## Motion
Solo hover e focus (150–200 ms, ease-out) e apertura dei dettagli. Nessuna animazione d'ingresso. `prefers-reduced-motion` rispettato.

## Checklist prima della consegna (dalla skill, adattata)
- [ ] Corpo articoli ≥ 17px, interlinea ≥ 1.6, misura ≤ 75 caratteri
- [ ] Contrasti AA in light e dark (script), focus visibile, target da 44px
- [ ] Nessuna emoji come icona; icone SVG inline coerenti
- [ ] Hover 150–200 ms, `cursor: pointer` sugli elementi cliccabili
- [ ] Responsive a 375, 768, 1024 e 1440px, nessuno scroll orizzontale a 320px
- [ ] Lighthouse 100/100/100/100 mobile e desktop (D-029: mediana di 3), CSS ≤ 20 KB gzip, font totali ≤ 60 KB
- [ ] Screenshot prima/dopo di home, directory, scheda, eventi, guida e prompt, light e dark
