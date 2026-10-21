# Spec: prompt-librarian

Scrivi la prompt library di aisicilia.it: **8 settori × 6 prompt = 48 prompt**, pronti all'uso per imprese siciliane, ognuno **testato** su un input di esempio.

## Leggi solo
Questa spec, `docs/copy-rules.md` (per i testi descrittivi), `src/content.config.ts` (schema `prompts`), `src/lib/taxonomies.ts`.

## Scrivi solo in
`src/content/prompts/<slug>.json`. Solo i settori che ti sono stati assegnati.

## Settori (slug → etichetta)
ospitalita (Ospitalità) · ristorazione (Ristorazione) · agroalimentare-vino (Agroalimentare e vino) · commercio-retail (Commercio e retail) · turismo-agenzie (Turismo e agenzie) · studi-professionali (Studi professionali) · artigianato-manifattura (Artigianato e manifattura) · edilizia-immobiliare (Edilizia e immobiliare)

## Copertura per settore
6 prompt con casi d'uso **diversi** tra loro (`use_case` dai valori di `src/lib/taxonomies.ts`): marketing, social media, customer care, recensioni, vendite e preventivi, amministrazione, analisi, traduzioni, formazione del personale, organizzazione. In ogni settore almeno 5 `use_case` diversi. Esempi del tipo giusto:
- Ospitalità: risposta a recensione negativa; email pre-arrivo in tre lingue; descrizione camere per il sito; procedura check-in per il personale stagionale; analisi delle recensioni del mese; regole della casa per un B&B.
- Agroalimentare e vino: scheda tecnica di un vino per l'export (in inglese e tedesco); descrizione prodotto per e-commerce; risposta a un buyer estero; piano editoriale per la vendemmia; etichetta e claim da verificare (con avvertenze normative); sintesi di un capitolato della GDO.
Pensa a casi reali di imprese siciliane (stagionalità turistica, export, piccole dimensioni, personale stagionale).

## Come è fatto un prompt
- `prompt_text`: istruzioni chiare in italiano, con ruolo, contesto, compito, vincoli, formato dell'output. Variabili `{snake_case}` tra graffe singole per ciò che l'utente deve compilare. Lunghezza: quanto serve, di solito 600–1.500 caratteri. Includi istruzioni anti-errore (es. "se un'informazione manca, chiedimela invece di inventarla").
- `variables`: **tutte e sole** le variabili usate nel testo (il validatore lo controlla), con descrizione e un esempio realistico.
- `goal`: una frase su cosa ottieni (30–240 caratteri).
- `how_to_use`: passi pratici (dove incollarlo, cosa compilare, come rileggere e correggere).
- `example_input`: valori di esempio delle variabili, verosimili e **inventati come esempio** (es. "B&B Il Cortile, Ortigia"): niente aziende reali, niente dati personali reali.
- `expected_output_description`: com'è fatto un buon risultato (lunghezza, struttura, tono).
- `limits_and_warnings`: avvertenze concrete (non inserire dati personali dei clienti; verifica sempre numeri, prezzi, norme, allergeni; l'AI può inventare; rileggi prima di pubblicare; per testi legali/fiscali serve il professionista).
- `compatible_tools`: dai valori ammessi; `level`: base/intermedio/avanzato.
- `title`: descrittivo, cosa fa il prompt (≤ 90 caratteri), es. "Rispondere a una recensione negativa su Booking senza mettersi sulla difensiva".
- **Slug**: dal titolo, breve, minuscolo, unico in tutta la libreria (prefisso consigliato: nessuno; evita slug generici come `recensioni`).

## Test obbligatorio
Per **ogni** prompt: sostituisci le variabili con `example_input` ed esegui tu stesso il prompt (sei un modello linguistico: produci davvero l'output). Valuta se l'output rispetta formato e vincoli; se no, correggi il prompt e riprova. Poi compila:
- `tested_at`: la data di oggi
- `test_notes`: 1–3 frasi su cosa hai verificato e cosa hai corretto (es. "Prima versione troppo lunga: aggiunto limite di 120 parole. Output ok in italiano e inglese.").
Non incollare gli output dei test nei file.

## Regole comuni
- Non modificare file fuori dalla tua cartella; se serve, segnalalo nel report.
- Al termine: `npm run validate -- --content`: zero errori sui tuoi file.
- Report finale (max 200 parole): prompt scritti per settore, correzioni emerse dai test, problemi aperti.
