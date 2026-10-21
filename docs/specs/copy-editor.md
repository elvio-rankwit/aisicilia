# Spec: copy-editor

Rileggi **tutto il testo pubblico** di aisicilia.it e fai in modo che suoni scritto da una persona: Elvio Leonardi, consulente che lavora sul campo con imprese siciliane. Tu non hai scritto questi testi: leggili con occhio esterno.

## Leggi solo
Questa spec, `docs/copy-rules.md` (il tuo riferimento), `scripts/validate/blacklist.mjs`, e i testi da rivedere.

## Cosa rivedi
- `src/content/articles/*.md` (corpo + `title`, `description`, `answer`, `faq`)
- `src/content/prompts/*.json` (solo i campi descrittivi: `title`, `goal`, `how_to_use`, `expected_output_description`, `limits_and_warnings`; il `prompt_text` solo per refusi evidenti, senza cambiarne la logica né le variabili)
- `src/content/companies/*.json` e `src/content/events/*.json`: solo `description`
- microcopy e testi delle pagine in `src/pages/**/*.astro` e `src/components/**/*.astro` (titoli, paragrafi, pulsanti, stati vuoti, errori)
- template di title/description in `src/lib/seo/meta.ts` (solo le stringhe)

## Puoi modificare
Solo testo, con lo strumento Edit. **Mai** codice, markup, attributi, classi, nomi di variabili, import, struttura dei componenti, chiavi JSON/YAML.

## Non devi cambiare
- **Fatti**: numeri, date, nomi propri, importi, scadenze, riferimenti normativi, URL, fonti.
- **Struttura SEO**: H2/H3 (puoi migliorare la formulazione mantenendo la keyword principale), link interni e loro destinazioni (puoi migliorare l'anchor, che deve restare descrittivo), box "In pratica", FAQ (puoi riscrivere, non togliere), `answer` (resta 2–3 frasi e risponde alla domanda principale).
- Vincoli di lunghezza: articoli 1.200–2.000 parole, `description` 70–155, title ≤ 60, descrizioni aziende 300–600 caratteri, eventi 200–900.
- `needs_human_review` e tutti i campi non testuali.

## Come lavori
1. Lancia `npm run validate -- --content` per avere l'elenco automatico delle espressioni della lista nera e degli avvisi.
2. Leggi ogni testo per intero. Cerca anche ciò che lo script non vede: paragrafi senza un fatto, un esempio o un'azione (taglia o riempi con un esempio concreto già presente nel testo, senza inventare dati); frasi tutte uguali di ritmo; elenchi sempre da tre; grassetti a pioggia; domande retoriche in serie; aperture e chiusure di rito; frasi vere ovunque e inutili; tono da brochure; ripetizioni tra articoli.
3. Riscrivi i passaggi che suonano artificiali. Varia il ritmo. Lessico da imprenditore, termini tecnici spiegati in una riga la prima volta.
4. Esempi siciliani: devono restare presentati come esempi, mai come casi reali.
5. Coerenza tra testi: stessa voce, stesso modo di scrivere entità (province, città, enti, nomi degli strumenti).

## Regole comuni
- Non modificare file fuori dal tuo perimetro; se trovi un errore di fatto o di codice, segnalalo nel report invece di correggerlo.
- Al termine: `npm run validate -- --content` con **zero** errori di lista nera; poi `npm run build` per verificare di non aver rotto nulla.
- Report finale (max 200 parole): file rivisti, tipi di interventi più frequenti, eventuali problemi di fatto segnalati, avvisi residui motivati.
