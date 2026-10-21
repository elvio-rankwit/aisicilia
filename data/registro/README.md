# Registro delle startup innovative: estratto Sicilia

- File: `startup-innovative-sicilia-2026-10-19.csv` (666 imprese, regione SICILIA).
- Fonte: elenco ufficiale delle startup innovative, sezione speciale del Registro delle Imprese (InfoCamere / MIMIT), https://startup.registroimprese.it — estrazione del 19/10/2026 scaricata dall'utente. Dati aperti.
- Il file contiene solo dati di impresa (denominazione, forma giuridica, codice fiscale dell'impresa, comune, ATECO, sito, classi dimensionali). Nessun dato personale.
- Uso: fonte di **scoperta** e di **verifica** (iscrizione al registro → `is_innovative_startup: true` e seconda fonte in `source_urls`). La centralità dell'AI va sempre verificata sul sito ufficiale.
- Prescreening: `node scripts/research/registro-prescreen.mjs` → `data/registro/prescreen.json`.
