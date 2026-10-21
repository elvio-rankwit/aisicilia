# Regole del copy (brief §10.1): vincolanti per chi scrive testo pubblico

Il portale parla di AI ma non deve sembrare scritto da un'AI. Vale per articoli, schede, pagine provincia, microcopy, meta description, Chi siamo.

## Voce
- È quella di Elvio Leonardi: consulente che lavora sul campo con imprese siciliane (soprattutto ospitalità e turismo) e insegna AI in aula. Diretto, pratico, a volte ironico, mai professorale.
- Prima persona dove ha senso ("quando lo spiego in aula, la domanda che arriva sempre è…"), seconda persona (tu) per il lettore.
- Esempi siciliani concreti e verosimili (il B&B a Ortigia che risponde alle recensioni, la cantina dell'Etna che traduce le schede per l'export, lo studio di Caltanissetta che smista le email). Si presentano come esempi ("immagina", "prendiamo un B&B"), **mai** come casi reali o clienti.

## Lista nera (lo script `npm run validate` la controlla: `scripts/validate/blacklist.mjs`)
- Aperture e chiusure di rito: "Nel panorama attuale…", "In un mondo sempre più digitale…", "L'AI sta rivoluzionando…", "Al giorno d'oggi", "In conclusione…", "In sintesi…".
- Parole gonfie: fondamentale, cruciale, rivoluzionario, potenziare, sfruttare il potenziale, sinergia, a 360 gradi, game changer, senza precedenti, ecosistema (solo se è il termine tecnico giusto), "non è solo X, ma Y", "non si tratta solo di".
- Tic: elenchi sempre da tre voci, frasi tutte della stessa lunghezza, un grassetto per paragrafo, trattini lunghi a ripetizione, emoji, "immergiamoci", "un viaggio alla scoperta".
- Domande retoriche in serie, entusiasmo generico, promesse ("raddoppia le vendite con l'AI").
- Frasi vere ovunque e quindi inutili ("l'AI può aiutare le aziende a essere più efficienti").

## Da fare
- Ritmo vario: frasi brevi alternate a frasi più articolate.
- Ogni paragrafo contiene un fatto, un esempio o un'azione. Se si toglie senza perdere nulla, va tolto.
- Ammettere i limiti: cosa l'AI non fa bene, quando non conviene, quanto costa davvero in tempo e soldi.
- Lessico da imprenditore. Ogni termine tecnico si spiega in una riga la prima volta.
- Microcopy asciutto e cordiale. Esempio: "Nessun evento in programma a Enna per ora. Ne conosci uno? Segnalalo."
- Numeri e statistiche solo con fonte linkata e data.
- Nomi di strumenti (ChatGPT, Claude, Gemini…) solo come esempi, con la data di aggiornamento dell'articolo.
- Entità scritte sempre allo stesso modo: usare le etichette di `src/lib/taxonomies.ts` e `src/lib/provinces.ts`.
