# Spec: grants-researcher

Trova e verifica i **bandi, i finanziamenti e le agevolazioni a cui possono accedere imprese, startup e professionisti siciliani per progetti di intelligenza artificiale**, e compila un record JSON per ciascuno. I bandi sono contenuti YMYL: una scadenza sbagliata fa perdere soldi a chi legge. La precisione vale più del numero.

## Leggi solo
Questa spec, `src/content.config.ts` (schema `grants`), `src/lib/taxonomies.ts` (vocabolari `GRANT_*`), `src/lib/provinces.ts`, `docs/sources.md`, e per contesto la guida già pubblicata `src/content/articles/incentivi-finanziamenti-digitalizzazione-ai-sicilia.md` (verificata il 22/10/2026: riparti dalle sue fonti, ma riverifica tutto).

## Scrivi solo in
- `src/content/grants/<slug>.json`: bandi **verificati** sulla fonte ufficiale
- `data/_pending/grants/<slug>.json`: bandi con dubbi (stesso formato + `"pending_reason": "..."`)
- `docs/runs/grants-<ambito>-<aaaa-mm-gg>.md`: log della ricerca (fonti consultate, esito, scartati e perché)

Se ti è stato assegnato un ambito (enti regionali e locali, nazionali, europei e privati), scrivi solo bandi di quell'ambito: gli altri li cercano altri agenti in parallelo.

## Criterio di inclusione (tutte e tre le condizioni)
1. **Accessibile da chi ha sede o unità locale in Sicilia** (bandi regionali, camerali siciliani, nazionali, europei aperti alle imprese italiane).
2. **C'entra l'AI**, in uno di questi modi (campo `ai_fit`):
   - `dedicato all'AI`: il bando riguarda esplicitamente l'intelligenza artificiale;
   - `AI tra le spese ammesse`: il testo del bando nomina l'intelligenza artificiale tra tecnologie, progetti o spese ammissibili;
   - `innovazione digitale`: il bando finanzia progetti innovativi o digitali in cui un progetto AI rientra senza forzature (es. startup innovative, R&S, transizione digitale). Usalo con parsimonia e spiega in `ai_note` perché un progetto AI ci sta.
   Nessuna AI plausibile (es. solo efficienza energetica, solo attrezzature) → escluso.
3. **Stato utile**: aperto oggi, oppure in apertura con data di apertura già pubblicata in un atto ufficiale. Più al massimo 3 bandi del tuo ambito chiusi negli ultimi 6 mesi e ricorrenti (che probabilmente torneranno), per l'archivio.

## Fonti
Solo **fonti ufficiali**: sito dell'ente che emette il bando o del soggetto gestore (Regione Siciliana, Euroinfosicilia, IRFIS, Camere di Commercio, MIMIT, Invitalia, Commissione europea / Funding & Tenders portal, EIC, CDP, fondazioni), Gazzetta Ufficiale, GURS, testi PDF dei bandi. Portali di aggregazione, blog e consulenti servono solo come **pista**: trovato lì un bando, vai sulla fonte ufficiale e verifica tutto. Se non trovi la fonte ufficiale → `_pending`.
Rispetta robots.txt, massimo 1 richiesta al secondo per dominio, niente login.

## Come compili il record
- Apri la pagina ufficiale e, quando c'è, il **testo del bando** (PDF): scadenze, importi e beneficiari si prendono da lì, non dalla notizia.
- `title`: nome ufficiale del bando, accorciato solo se lunghissimo.
- `issuer`: ente che emette (es. "Camera di Commercio del Sud Est Sicilia", "Invitalia", "Commissione europea"). `issuer_type` dal vocabolario.
- `scope` e `provinces`: `provinciale` + elenco delle province ammesse (slug di `provinces.ts`) per i bandi camerali; `regionale`, `nazionale`, `europeo` con `provinces: []`.
- `description` 300–900 caratteri, **riscritta** con parole tue: cosa finanzia, chi può chiedere, in che forma. Niente copia dal bando, niente hype. Vietati: imperdibile, fondamentale, cruciale, rivoluzionario, potenziare, sfruttare, sinergia, ecosistema, a 360 gradi, opportunità unica.
- `ai_note` 60–400 caratteri: dove il bando nomina l'AI (articolo, allegato, elenco tecnologie) o perché un progetto AI rientra. Es.: "L'articolo 4 del bando elenca l'intelligenza artificiale tra le tecnologie finanziabili, insieme a cloud e cybersecurity."
- `budget`, `max_amount`, `aid_intensity`: testo breve **come nella fonte** (es. "fino a 10.000 euro per impresa", "50% delle spese ammissibili"). Se non c'è, ometti il campo. Mai stime.
- `procedure`: `a sportello` (ordine cronologico), `graduatoria`, `click day`, `call con scadenza` (call europee e simili).
- `opens_at`, `deadline` (AAAA-MM-GG), `deadline_time` (HH:MM ora italiana) se indicata. Sportelli senza scadenza: niente `deadline`, `deadline_note` obbligatoria (es. "fino a esaurimento delle risorse"). Call europee con più cut-off: `deadline` = prossimo cut-off, `deadline_note` con quelli successivi.
- `closed_early: true` solo se la fonte dice che lo sportello è chiuso o sospeso per esaurimento fondi.
- `official_url`: la pagina ufficiale del bando. `documents`: testo del bando, allegati, FAQ ufficiali (titolo leggibile). `sources`: le pagine consultate, con titolo che finisce con "(consultato il 26 ottobre 2026)".
- `last_verified`: oggi. `verification_status`: `"verified"` solo se **date, importi e beneficiari** risultano dalla fonte ufficiale; altrimenti `_pending`.
- `needs_human_review`: **sempre `true`**. Non scrivere `reviewed_at`: lo decide l'utente.
- **Slug**: `<nome-breve>-<ente-breve>-<aaaa>` (es. `voucher-doppia-transizione-cciaa-sud-est-2026`, `smart-start-italia-invitalia`), minuscolo senza accenti. Per misure senza anno, niente anno. File `<slug>.json`.
- Nessun dato personale: niente nomi di funzionari, email, telefoni.

Esempio (forma, non contenuto da copiare):
```json
{
  "title": "Bando Doppia Transizione Digitale ed Ecologica, regime de minimis, anno 2026",
  "slug": "voucher-doppia-transizione-cciaa-sud-est-2026",
  "issuer": "Camera di Commercio del Sud Est Sicilia",
  "issuer_type": "Camera di Commercio",
  "scope": "provinciale",
  "provinces": ["catania", "ragusa", "siracusa"],
  "description": "...",
  "ai_fit": "AI tra le spese ammesse",
  "ai_note": "...",
  "beneficiaries": ["micro e piccole imprese", "medie imprese"],
  "aid_types": ["voucher"],
  "max_amount": "...",
  "procedure": "a sportello",
  "opens_at": "2026-...",
  "deadline": "2026-10-31",
  "deadline_time": "21:00",
  "closed_early": false,
  "official_url": "https://...",
  "documents": [{ "url": "https://...pdf", "title": "Testo del bando" }],
  "sources": [{ "url": "https://...", "title": "Camera di Commercio del Sud Est Sicilia, pagina del bando (consultata il 26 ottobre 2026)" }],
  "last_verified": "2026-10-26",
  "verification_status": "verified",
  "needs_human_review": true
}
```

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Al termine: `npm run validate -- --content` (zero errori sui tuoi file).
- Report finale (max 250 parole): bandi verificati (slug, stato, scadenza), quanti in `_pending` e perché, fonti consultate e irraggiungibili, dubbi da far controllare all'utente.
