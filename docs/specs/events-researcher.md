# Spec: events-researcher

Trova e verifica gli **eventi sull'intelligenza artificiale in Sicilia** e compila un record JSON per ciascuno.
Obiettivo beta: **tutti gli eventi futuri verificabili nei prossimi 6 mesi** (da oggi) + un piccolo archivio degli **ultimi 6 mesi** (5–15 eventi) per non avere pagine vuote.

## Leggi solo
Questa spec, `src/content.config.ts` (schema `events`), `src/lib/taxonomies.ts`, `src/lib/provinces.ts`, `docs/sources.md`.

## Scrivi solo in
- `src/content/events/<slug>.json` — eventi **verificati**
- `data/_pending/events/<slug>.json` — eventi con dubbi (stesso formato + `"pending_reason": "..."`)
- `docs/sources.md` — colonna "Stato" delle fonti eventi e nuove righe

Se ti è stato assegnato un sottoinsieme di province, scrivi solo eventi di quelle province (per gli online: provincia dell'organizzatore).

## Criterio di inclusione
- Tema principale: intelligenza artificiale (anche applicata: AI per imprese, turismo, sanità, dati, sviluppo). Eventi digitali generici con un intervento sull'AI tra tanti → solo se l'AI è nel titolo o è un blocco dichiarato del programma.
- Luogo: in Sicilia (in presenza o ibrido), **oppure online se organizzato da una realtà siciliana** (università, camera di commercio, associazione, azienda, community con sede in Sicilia).
- Pagina pubblica dell'evento consultabile (sito organizzatore, Eventbrite, Meetup, pagina istituzionale). Niente eventi visti solo su social privati.

## Fonti e metodo
1. Parti da `docs/sources.md`: Eventbrite, Meetup, GDG, università, Camere di Commercio e Punti Impresa Digitale, associazioni di categoria (Confesercenti, Confcommercio, Confartigianato, CNA, Sicindustria), incubatori, coworking, DIH/EDIH. Cerca anche con WebSearch: "evento intelligenza artificiale Palermo 2026", "workshop AI Catania", "webinar AI imprese Camera di Commercio Sicilia", ecc.
2. Rispetta `robots.txt` e i termini; massimo 1 richiesta al secondo per dominio (Eventbrite risponde 429 se si esagera: rallenta). Usa API solo dove consentito senza chiavi; niente login.
3. Per ogni evento apri la pagina ufficiale e ricava: titolo, date, orari, formato, luogo (nome e indirizzo della sede, che è un luogo pubblico), città, organizzatore (ente o azienda, **mai** persone fisiche come organizzatore se non sono un'attività), prezzo (se non indicato: `"non indicato"`), pubblico, temi.
4. Se date o luogo non sono chiari, se la pagina è scaduta o contraddittoria → `_pending` con motivo.

## Regole sui dati
- **Zero dati inventati.** Ogni campo deve risultare dalla `source_url`. Campi facoltativi non verificabili: omessi.
- **Nessun dato personale**: non elencare relatori per nome nella descrizione, niente email o telefoni. Puoi scrivere "interventi di ricercatori dell'Università di Catania" se è scritto nella fonte.
- **Descrizione** 200–900 caratteri, **riscritta** con parole tue: di cosa si parla, per chi è utile, formato. Niente hype; evita "imperdibile", "rivoluzionario", "fondamentale", "cruciale", "potenziare", "sinergia", "ecosistema" (salvo nome proprio).
- Date ISO `AAAA-MM-GG`, orari `HH:MM` ora italiana. `end_date` solo per eventi su più giorni.
- `status`: `programmato` (default), `annullato`, `rinviato` o `spostato online` solo se la fonte lo dice.
- `format`: `in presenza`, `online`, `ibrido`. Eventi in presenza/ibridi richiedono `lat`/`lng`: geocodifica l'indirizzo della sede con `node scripts/geocode/geocode.mjs "<indirizzo della sede>"`; se non geocodificabile, usa `--city` sul comune. Eventi online: niente coordinate.
- `audience` e `price` solo dai valori in `src/lib/taxonomies.ts`. `topics`: 1–4 temi brevi in minuscolo, coerenti tra eventi ("AI generativa", "machine learning", "AI per il turismo", "AI Act", "dati"…): riusa le stesse etichette.
- **Slug**: `<titolo-breve>-<citta>-<aaaa-mm>` (es. `workshop-ai-generativa-catania-2026-11`), minuscolo senza accenti. File `<slug>.json`.
- **Serie** (D-039): se la fonte dice che l'evento si ripete ("seconda edizione", "nato nel 2019", nome con l'anno come "DevFest Catania 2026"), aggiungi `series` (slug senza anno, es. `devfest-catania`) e `series_name` (nome stabile senza anno, es. `DevFest Catania`). Per una nuova edizione di una serie già presente usa gli stessi due valori: le edizioni condividono la pagina `/eventi/<series>/`. Senza indizi di ricorrenza, niente serie.
- `last_verified`: oggi. `verification_status`: `"verified"` solo se tutto è confermato.

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Al termine: `npm run validate -- --content` (zero errori sui tuoi file).
- Report finale (max 200 parole): eventi futuri e passati verificati per provincia, quanti online, quanti in `_pending` e perché, fonti usate e scartate, problemi aperti.
