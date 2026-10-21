# Spec: directory-researcher

Trova e verifica aziende, startup, spin-off, centri di ricerca, incubatori e community che fanno **intelligenza artificiale in Sicilia**, e compila un record JSON per ciascuna. Qualità prima della quantità: meglio 30 record verificati che 150 dubbi.

## Leggi solo
Questa spec, `src/content.config.ts` (schema `companies`), `src/lib/taxonomies.ts`, `src/lib/provinces.ts`, `docs/sources.md`.

## Scrivi solo in
- `src/content/companies/<slug>.json` — record **verificati**
- `data/_pending/companies/<slug>.json` — record con dubbi (stesso formato + campo `"pending_reason": "..."`)
- `docs/sources.md` — solo la colonna "Stato" delle fonti aziende e nuove righe di fonti trovate

Se ti è stato assegnato un sottoinsieme di province, scrivi **solo** record di quelle province (altre istanze lavorano sulle altre). Se trovi una realtà fuori dalle tue province, citala nel report.

## Criterio di inclusione (tutti e due obbligatori)
1. **Sede operativa in Sicilia** (sede legale o operativa verificabile su sito ufficiale, registro o pagina istituzionale).
2. **L'AI è centrale** nel prodotto o servizio, dichiarato sul sito o sulla fonte: sviluppa modelli, prodotti o servizi AI, fa ricerca AI, o è un incubatore/community dedicato a AI e dati. Escluse le agenzie generaliste (web, marketing, software house) che "usano anche ChatGPT" o citano l'AI come voce tra tante. Nel dubbio → `_pending`.

Tipi ammessi (`type`): startup, azienda, spin-off universitario, centro di ricerca, incubatore/acceleratore, community/associazione. Un centro di ricerca è incluso se ha una sede in Sicilia con attività AI dichiarata (es. un istituto o una sede territoriale): il record riguarda la sede siciliana.

## Fonti e metodo
1. Parti dalle fonti candidate in `docs/sources.md` (registro startup innovative, spin-off universitari di Palermo, Catania, Messina, Enna Kore, incubatori, DIH/EDIH, community, stampa locale per scoprire nomi). Cerca anche con WebSearch: "startup intelligenza artificiale Palermo", "spin-off machine learning Catania", "computer vision Sicilia azienda", ecc.
2. **Vietato**: scraping di LinkedIn, Crunchbase, siti che lo vietano nei termini; aggregatori di dati aziendali a pagamento. Rispetta `robots.txt`. Massimo 1 richiesta al secondo per dominio.
3. Per ogni candidato apri **davvero** almeno una fonte (preferibilmente il sito ufficiale + una seconda fonte indipendente, es. registro o pagina universitaria) e ricava da lì: nome esatto, tipo, città e provincia, sito, attività AI, eventuale anno di fondazione, eventuale iscrizione al registro startup innovative (solo se lo vedi nel registro o sul sito).
4. Se il sito non risponde, è in costruzione, l'attività sembra cessata o l'AI non è chiaramente centrale → `_pending` con `pending_reason`.

## Regole sui dati
- **Zero dati inventati.** Ogni campo deve risultare dalle `source_urls` che hai consultato. Se un campo facoltativo non è verificabile, omettilo. Mai coordinate, anni o indirizzi "stimati".
- **Solo dati aziendali.** Niente nomi, email, telefoni di persone fisiche (nemmeno fondatori). Indirizzo solo se è la sede aziendale pubblicata dall'azienda o da un registro.
- **Descrizione** 300–600 caratteri, **riscritta con parole tue**: cosa fa, per chi, con quale tecnologia, in modo concreto. Vietato copiare o parafrasare da vicino il sito. Niente superlativi né parole della lista nera (`docs/copy-rules.md` non è nella tua lettura: basta evitare "innovativo", "leader", "rivoluzionario", "all'avanguardia", "fondamentale", "cruciale", "potenziare", "sinergia", "a 360 gradi", "ecosistema").
- Vocabolari: `ai_areas`, `sectors_served`, `type` **solo** dai valori in `src/lib/taxonomies.ts`; `province` è lo slug.
- **Slug**: nome in minuscolo, senza accenti né forma societaria (`srl`, `spa`), parole separate da `-`. Il file si chiama `<slug>.json`.
- **Coordinate**:
  - con indirizzo verificato: `node scripts/geocode/geocode.mjs "<indirizzo completo>"` → `lat`, `lng`, `"geo_precision": "indirizzo"`;
  - senza indirizzo: `node scripts/geocode/geocode.mjs --city "<comune>"` → `"geo_precision": "città"`.
  - Lo script ha cache e rate limit: usalo sempre, non chiamare Nominatim a mano. Controlla che il risultato sia nel comune giusto.
- `same_as`: solo profili ufficiali verificati diversi dal sito (es. pagina dello spin-off sul sito dell'università). Niente social personali.
- `last_verified`: la data di oggi (in cui hai consultato le fonti). `verification_status`: `"verified"` solo se tutti i campi pubblicati sono confermati dalle fonti.

## Esempio di record (struttura, dati inventati: NON copiare i valori)
```json
{
  "name": "Nome Esatto",
  "slug": "nome-esatto",
  "type": "startup",
  "description": "300–600 caratteri riscritti…",
  "ai_areas": ["computer vision"],
  "sectors_served": ["agroalimentare"],
  "province": "catania",
  "city": "Catania",
  "address": "Via …, 95100 Catania CT",
  "lat": 37.5, "lng": 15.08, "geo_precision": "indirizzo",
  "website": "https://…",
  "founded_year": 2021,
  "is_innovative_startup": true,
  "same_as": [],
  "source_urls": ["https://… (sito)", "https://… (registro)"],
  "last_verified": "AAAA-MM-GG",
  "verification_status": "verified"
}
```

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Al termine: `npm run validate -- --content` (zero errori sui tuoi file).
- Report finale (max 200 parole): numero di record verified per provincia, numero in `_pending` con i motivi principali, fonti usate e fonti scartate (perché), problemi aperti. Non incollare i record nel report.
