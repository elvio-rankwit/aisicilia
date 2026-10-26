# Bandi regionali e locali siciliani, 2026-10-26

- Agente: grants-researcher, ambito enti regionali e locali. Data: 2026-10-26. Modello: sonnet.
- Controlli: `npm run validate -- --content`, 0 errori e 0 avvisi.
- Ritmo richieste: domini diversi in alternanza. Sui siti con `Crawl-delay: 10` (ctrgsr.camcom.gov.it, me.camcom.it, regione.sicilia.it) ho tenuto 5-10 secondi tra una richiesta e l'altra, quindi in alcuni casi sotto i 10 secondi indicati. Nessun login, nessun form compilato.

## Record
- Verificati in `src/content/grants/` (10):
  - `voucher-doppia-transizione-cciaa-sud-est-2026`: aperto, scade 31/10/2026 ore 21:00.
  - `phygital-phygitalab-hub-imprese-2026`: aperto, scade 30/10/2026 ore 12:00.
  - `sicily-open-lab-accelerazione-sogepat-2026`: aperto, scade 23/11/2026 ore 19:00.
  - `seme-accelerazione-incubazione-polo-baps-2026`: aperto, scade 15/11/2026 ore 12:00 (domenica).
  - `oasis-wonderwall-accelerazione-polo-oasis-2026` e `oasis-stand-by-me-incubazione-polo-oasis-2026`: aperti, scadono 13/11/2026 ore 12:00.
  - `ois-open-innovation-as-a-service-futurea-2026`: aperto, scade 27/11/2026 ore 10:00.
  - Archivio (chiusi, voucher Doppia Transizione 2026): `...-cciaa-agrigento-2026` (30/09, ore 11:00), `...-cciaa-messina-2026` (18/09, ore 10:00), `...-cciaa-trapani-2026` (15/09, ore 23:59).
- In `data/_pending/grants/` (3): `inn-so-accelerazione-polo-innsula-2026`, `qanat-polo-innovazione-mediterranea-2026`, `catania-crea-impresa-polo-db-hub-2026` (motivi nei file).

## Fonti consultate
- Camera di Commercio Sud Est Sicilia (ctrgsr.camcom.gov.it): ok. Pagina e testo del bando Doppia Transizione 2026, pagina Voucher Digitali, blog. Nessun avviso di chiusura anticipata, ma lo stato della piattaforma ReStart non è verificabile dal sito.
- Stessa Camera, bando turismo 2026 (delibera 59, scade 30/11/2026): esclusa. L'articolo 6 elenca le spese e non nomina l'AI. L'articolo 1 cita «beni e servizi ICT» ma l'elenco ammesso non li include.
- Stessa Camera, bando turismo per la sicurezza pubblica (delibera 54): escluso. Parla di «software intelligenti» per crowd monitoring e analisi predittive, senza nominare l'AI: sarebbe una forzatura. Il PDF riporta anche date con l'anno 2025 (probabile refuso).
- Camera di Commercio di Palermo ed Enna (paen.camcom.gov.it): ok. Ultimo voucher pubblicato 2022, nessun bando 2026 (pagine PID, promozione, sitemap). La pagina «Bandi, finanziamenti e progetti» si carica senza contenuto.
- Camera di Commercio di Messina (me.camcom.it): ok. Bando Doppia Transizione 2026 trovato (la guida del 22/10 non lo aveva), chiuso il 18/09. Sicily Open Lab trovato qui.
- Camera di Commercio di Trapani (tp.camcom.it): ok. Bando chiuso il 15/09.
- Camera di Commercio di Agrigento (ag.camcom.it): ok. Bando Doppia Transizione 2026 trovato (la guida lo dava per assente), chiuso il 30/09. robots.txt vuoto.
- Camera di Commercio di Caltanissetta: non raggiungibile. Nessun dominio ufficiale risolto (cl.camcom.it e varianti), la ricerca web non ha dato pagine 2026.
- Regione Siciliana (regione.sicilia.it): ok. Pagina Dipartimento attività produttive (elenco avvisi dei Poli del 21 e 26/10, DDG 2457/2026), avviso madre Open Innovation Sicilia, Digit Imprese 1.2.2, elenco bandi generale.
- Euroinfosicilia: ok. «Bandi e avvisi aperti» (4 aperti, 2 in scadenza, 103 chiusi): nessun avviso aperto sulla digitalizzazione delle imprese; aperti solo sanità, impiantistica sportiva, idrogeno, fiere turismo. Letti anche Ripresa Sicilia Plus (chiuso 28/11/2025) e STEP (chiuso 13/06/2026, non ricorrente, 315 milioni, requisiti di fatturato alti): non schedati.
- IRFIS FinSicilia (irfis.it): ok. Misure aperte tutte non AI (calamità, assunzioni, editoria, South Working). Commercio investimenti chiuso il 30/06/2026 e senza AI. FAInSicilia e Cluster chiusi nel 2024. Nessun record.
- Sicilia FSE+ (sicilia-fse.it): ok. Avvisi 2026 su master, ITS, dottorati, formazione per disoccupati. Nessun avviso FSE+ su competenze digitali o AI per imprese. Riqualificazione Capitale Umano (FESR 1.4.1) chiuso il 28/11/2025.
- Poli Open Innovation Sicilia (siti dei Poli): ok per Sicily Open Lab, S.E.M.E., PhygitaLab, OASIS, Futurea, INN-SO, Qanat, Catania Crea Impresa, Naturae, Sud Innovation Sicily, Fondazione Emblema, BI-REX SiLIFE.
- Poli non leggibili senza JavaScript: Growix (siciliarigenera.it) e Fabcube (zenithaccelerator.it). Non verificati, non schedati.
- Comuni capoluogo, università, EDIH: ricerca web senza avvisi pertinenti. Start Cup Catania, Palermo e Messina 2026 sono chiuse (agosto-settembre) e senza AI specifica. MIMIT (elenco EDIH) risponde 503: nessun EDIH siciliano verificato.

## Scartati
- Sud Innovation Sicily Hub (Wave), tutti gli ambiti S3, scade 09/11: l'avviso non nomina l'AI.
- Naturae (Isola Catania), ambiente, scade 22/11: nessun riferimento all'AI.
- BI-REX SiLIFE, scienze della vita, scade 03/11: l'AI compare solo come formazione di un partner (CRIF/BOOM), non come tema.
- Fondazione Emblema In.Sicily: termine 09/10 scaduto, selezione fatta.
- Digit Imprese 1.2.2 e 1.1.2: chiusi a dicembre 2025, oltre i 6 mesi.

## Errori e dubbi
- Aggregatore bandifacile.it dà «Digit Imprese 1.2.2, scadenza 26/11/2026»: è errato. La Regione ha chiuso la piattaforma il 4/12/2025 (DDG 3586/2025). Usata solo come pista, non schedato.
- Messina: la pagina camerale dice «graduatoria per punteggio», il testo del bando (art. 11) dice sportello cronologico. Ho seguito il bando.
- PhygitaLab: l'avviso indica 40.000 euro di de minimis, la pagina del Polo fino a 50.000. Scritta la forma dell'avviso, con la nota.
- INN-SO: servizi 20.373 euro nell'avviso, 21.000 nella pagina del Polo.
- Poli: per l'aiuto ex art. 28 il testo parla di costi «sostenuti e documentati» e liquidazione a saldo. L'impresa può dover anticipare il costo dei servizi (esplicito in Catania Crea Impresa).
- Poli: `issuer_type` impostato a «Regione Siciliana» perché l'aiuto è concesso dalla Regione tramite il Polo, ma il gestore è un soggetto privato (S.E.M.E. è guidato da una banca). L'utente può preferire un'altra classificazione.
- Concessioni dei Poli dell'ottobre 2026 ancora «provvisorie» sul sito Euroinfosicilia; alcuni avvisi ammettono la pubblicazione prima del decreto definitivo.
- `docs/sources.md` non aggiornato (fuori dalle mie cartelle). Da registrare: ctrgsr.camcom.gov.it e me.camcom.it ok con crawl-delay 10; ag.camcom.it e tp.camcom.it ok; paen.camcom.gov.it ok con voucher 2026 assente; Caltanissetta non raggiungibile; MIMIT 503.
