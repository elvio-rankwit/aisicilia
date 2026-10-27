# Bandi nazionali, ricerca del 26 ottobre 2026

- Agente: grants-researcher, ambito misure nazionali (imprese, startup, professionisti con sede in Sicilia).
- Esito: 5 record verificati in `src/content/grants/`, 5 in `data/_pending/grants/`. Tutti con `needs_human_review: true`.
- Metodo: fonti ufficiali lette in pagina o nel PDF (curl con pausa di oltre 1 secondo per dominio, pdftotext). Le ricerche web servono solo come pista: nessun dato di un record viene da un aggregatore.

## Verificati (src/content/grants/)
| Slug | Stato al 26/10 | Scadenza |
|---|---|---|
| `smart-start-italia-invitalia` | aperto, a sportello | nessuna (`deadline_note`) |
| `investimenti-ia-quantum-simest` | aperto dal 21/09/2026, a sportello | nessuna (fino a esaurimento Fondo 394/81) |
| `sviluppo-competenze-pmi-invitalia-2026` | aperto (secondo sportello), graduatoria | 21/12/2026 ore 12:00 |
| `voucher-cloud-cybersecurity-mimit-2026` | in apertura: compilazione dal 20/10, invio dal 10/11/2026 | 20/01/2027 ore 12:00 |
| `call-partnerships-idea-fondo-repubblica-digitale-2026` | aperto, call per enti non profit | 12/11/2026 ore 14:00 |

## In _pending (5)
- `resto-al-sud-20-invitalia`, `on-oltre-nuove-imprese-tasso-zero-invitalia`: dati verificati su Invitalia, ma misure generaliste di autoimpiego, AI non nominata (solo spese ICT/software). Scelta editoriale.
- `digital-transformation-invitalia`: scheda «Attivo» dal 2020 senza fondi residui, AI non nominata; decreto 9/6/2020 solo su MIMIT (irraggiungibile).
- `polaris-plus-fondo-repubblica-digitale-2026`: AI solo in una nota esemplificativa STEM, destinatari scuole e non profit.
- `iperammortamento-2026-gse`: MIMIT irraggiungibile, allegato V e decreto 7/5/2026 non letti; `aid_types` non ha «maggiorazione dell'ammortamento».

## Scartati
- Fondo impresa femminile (Invitalia): sportello chiuso dal 7/6/2022.
- Accordi per l'innovazione (sportello 14/01-18/02/2026, progetti da 5 milioni) e IPCEI IA (chiuso 30/01/2026): chiusi da oltre 6 mesi, dati solo da stampa di settore. Voucher innovation manager: nessun bando 2026 trovato.
- Contratti di sviluppo (sportello PN RIC/STEP, aperto dal 15/04/2025): investimento minimo 20 milioni, la pagina Invitalia non nomina l'AI (solo «tecnologie digitali e deeptech»).
- Investimenti sostenibili 4.0 (chiuso 07/10/2026 per esaurimento fondi, notizia solo da stampa di settore): ambito manifatturiero, AI non nominata nelle pagine Invitalia.
- Credito d'imposta ZES unica: finestra 31/03-30/05/2026 chiusa; integrativa 3-17/01/2027 solo per chi ha già comunicato; beni strumentali, AI forzata.
- Fondo Nuove Competenze (FNC3, lavoro.gov.it): nessuna finestra aperta trovata, AI non nominata.
- INAIL ISI 2025 (domande 13/04-28/05/2026, click day 24/06): chiuso da 4 mesi, nessuna AI.
- Brevetti+ 2026 (dal 25/11), Disegni+ (dal 17/12), Marchi+ (dal 03/12): fonte Unioncamere, AI non nominata.
- CDP Venture Capital: Fondo Artificial Intelligence, polo SophIA (22/09/2026) e Fondo Acceleratori II (19/10/2026) sono veicoli di investimento senza call aperta; portale pitch.cdpventurecapital.it senza testo leggibile.
- Dipartimento per la trasformazione digitale, Agenzia per la Coesione, Unioncamere/PID nazionali: nessun bando per imprese con AI aperto trovato.
- Nuova Sabatini: solo fonti secondarie (MIMIT/MCC non leggibili), AI non nominata. Non scritto.

## Piste non scritte da ricontrollare
- Cofinanziamento MIMIT per la call europea DIGITAL-2026-AI-DATA-10-COMPLIANCE (decreto 22/09/2026, 1 milione di euro, domanda nazionale con scadenza indicata al 30/10/2026): solo stampa di settore, decreto non letto. Da assegnare anche all'agente europeo.
- Fondo Repubblica Digitale: canale di cofinanziamento 2 (idee entro 31/12/2026, per non profit e cofinanziatori) senza AI nominata.

## Fonti non raggiungibili o limitate
- www.mimit.gov.it: connessione interrotta dal server (curl 35 e WebFetch 503), anche il 26/10; il relay del proxy segnala chiusura del tunnel dopo 12 s. Sostituito con Invitalia, SIMEST, GSE (via WebFetch), Camera dei deputati, Unioncamere.
- gse.it: 403 (Akamai) a curl, non aggirato; pagine lette con lo strumento WebFetch. incentivi.gov.it, agenziacoesione.gov.it, fondonuovecompetenze.anpal.gov.it, anpal.gov.it: nessuna risposta o DNS non risolto.
- normattiva.it: allegati IV e V della legge 199/2025 non caricati nella pagina; gazzettaufficiale.it: testo non ottenuto.
- robots.txt letto per invitalia.it, simest.it, mcc.it, fondorepubblicadigitale.it, lavoro.gov.it, unioncamere.gov.it; non letto per gse.it, camera.it, normattiva.it, agenziaentrate.gov.it.

## Dubbi per l'utente
1. `investimenti-ia-quantum-simest`: `issuer_type` messo su «altro ente pubblico» (SIMEST è società del Gruppo CDP che gestisce un fondo del MAECI); requisito export (3%) escludente per molte micro imprese siciliane.
2. `call-partnerships-idea-...`: riservata a enti non profit, non a imprese; `aid_types` «fondo perduto» è un'approssimazione (risorse per partner operativi).
3. `smart-start-italia-invitalia`: il DM 13/07/2026 cambia le regole dalla circolare attuativa, non ancora vista.
4. `voucher-cloud-...`: a sportello cronologico, rischio di esaurimento in poche ore (è successo a Investimenti sostenibili 4.0).
5. Pagina ufficiale citata come `official_url` per il voucher: Invitalia (la pagina MIMIT non era raggiungibile).
