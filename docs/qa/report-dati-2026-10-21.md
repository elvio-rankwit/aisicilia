# QA dati ed editoriale: report del 21 ottobre 2026

Istanza DATI del qa-factchecker: controlli 2 (fact-check a campione), 3 (link) e 9 (regole editoriali). I controlli 1, 4, 5, 6, 7, 8 e 10 sono dell'altra istanza. Nessun file fuori da `docs/qa/` è stato toccato. Nessun dato è stato corretto.

File prodotti: questo report, `docs/qa/campione-dati.mjs` (campionamento), `docs/qa/campione-dati-2026-10-21.json`, `docs/qa/linkcheck-dati.mjs` (link), `docs/qa/linkcheck-dati-2026-10-21.json` (esiti per URL), `docs/qa/blacklist-dist.mjs` (lista nera sul testo reso).

## Tabella riassuntiva

| Controllo | Esito |
|---|---|
| 2. Fact-check aziende (9 schede) | ROSSO: 2 da correggere, 3 da verificare/decidere, 4 ok |
| 2. Fact-check eventi (10 schede) | GIALLO: 1 da correggere, 2 da decidere, 7 ok |
| 3. Link esterni dei dati e degli articoli (148 URL unici) | VERDE: 148 raggiungibili, 0 rotti, 0 bloccati; 2 non verificabili (EUR-Lex risponde 202 con sfida WAF); 18 con redirect da aggiornare |
| 3. Link interni | VERDE: `PUBLIC_SITE_MODE=production npm run validate` sul dist di produzione, 0 errori e 0 avvisi (151 pagine) |
| 9. Lista nera nel testo pubblico | VERDE: 0 occorrenze in 151 pagine, llms.txt, llms-full.txt, RSS e sorgenti |
| 9. YMYL fuori dalla build | VERDE: `ai-act-gdpr-cosa-deve-sapere-impresa` e `incentivi-finanziamenti-digitalizzazione-ai-sicilia` assenti da HTML, sitemap, llms, RSS, OG, Pagefind; nessun `href` verso di loro |
| 9. Nessun dato fittizio in dist | VERDE: nessun `esempio-` né `[FITTIZIO]`; le occorrenze di `.example` sono solo la classe CSS `.example`. Nessun record di `data/_pending/` in dist |
| 9. Beta: noindex e robots | VERDE: 151/151 pagine con `noindex, nofollow`, `X-Robots-Tag: noindex, nofollow` in `_headers`, `robots.txt` con `Disallow: /` |
| 9. Sitemap solo in production | VERDE sulla presenza (assente in beta; in production indice + 5 segmenti), ma ROSSO sul contenuto: vedi problema SEO-1 |
| 9. llms.txt / llms-full.txt coerenti | VERDE: 20/20 aziende, 11 eventi in programma (23 passati esclusi), 8 guide, 48 prompt, conteggi per provincia corretti |
| 9. Segnaposto `[DA COMPLETARE]` | GIALLO: 11 segnaposto in 6 pagine previste, ma 2 non sono nella spec del frontend-builder; tutti da riempire prima della production |
| 9. Coerenza AI Act tra articoli | VERDE sui fatti (verificati sulle fonti), ROSSO sul processo di revisione YMYL: vedi problema CW-1 |

Nota sul metodo. La beta è stata verificata sullo snapshot `dist-beta` (build delle 12:55, nessun file di `src/` modificato dopo) e la production sul `dist/` delle 12:56. `npm run validate` in modalità beta sul dist di produzione dà 148 errori "manca noindex / robots": è un artefatto atteso (modalità diversa dal dist), non un difetto.

## Problemi per agente responsabile

### content-writer (e orchestratore)

**CW-1 (alta). Contenuti YMYL pubblicati senza revisione umana.** La regola 8 (CLAUDE.md) mette in YMYL "AI Act, GDPR, bandi" e D-012 esclude solo gli articoli con `needs_human_review: true`.
- `src/content/articles/ai-studi-professionali-dati-clienti.md` ha `needs_human_review: false` e nessun `reviewed_at`, ma tratta GDPR (basi giuridiche, trasferimenti extra SEE, art. 49) e legge 132/2025 (artt. 11 e 13) a uso di professionisti. È in build e nella sitemap.
- Cinque articoli pubblicati (`ai-hotel-bb-strutture-ricettive`, `ai-cantine-aziende-agroalimentari`, `ai-ristoranti-bar-locali`, `ai-pmi-siciliane-da-dove-cominciare`, `automatizzare-attivita-ripetitive`) riportano affermazioni normative sull'AI Act: Digital Omnibus in vigore dal 27 luglio 2026, art. 4 riscritto, art. 50 applicabile dal 2 agosto 2026. Le fonti sono ufficiali e i fatti sono giusti (vedi sotto), ma non c'è approvazione umana per quel contenuto, mentre la guida che le approfondisce è nascosta.
- Correzione suggerita: decisione dell'utente. Marcare `ai-studi-professionali-dati-clienti` con `needs_human_review: true` finché non è approvato, oppure far approvare insieme alle due guide YMYL. Per gli altri cinque, o ridurre le affermazioni normative a un rimando, o includerli nella revisione.

**CW-2 (bassa).** Sei articoli pubblicati rimandano con testo semplice ("AI Act e GDPR: cosa deve sapere un'impresa") a una guida che nel sito non esiste (D-023 funziona: nessun link rotto). Il lettore cerca una pagina che non trova. Valutare una formula neutra finché la guida non è approvata.

**CW-3 (bassa). Coerenza AI Act.** I fatti sono uniformi in tutti gli articoli. Differenze minori: solo `ai-pmi-siciliane-da-dove-cominciare` dice che l'art. 4 si applica dal 2 febbraio 2025 e poi è stato riscritto; hotel, cantine, ristoranti dicono solo "riscritto"; hotel e automatizzare non citano la proroga al 2 dicembre 2026 per l'art. 50, par. 2 (irrilevante per chi usa solo, e corretta nella guida YMYL).

Verifiche fatte sull'AI Act:
- Il testo PE-CONS 30/26 (Consiglio, 18 giugno 2026) contiene l'art. 4 identico a quanto riassunto negli articoli (obbligo di "adottare misure", nessun livello specifico garantito, supporto a PMI e esempi pratici).
- Date nel testo e nel calendario AI Act Service Desk: 2 dicembre 2027 (allegato III), 2 agosto 2028 (allegato I), 2 dicembre 2026 (nuovi divieti e art. 50, par. 2), 2 febbraio 2025 (alfabetizzazione e divieti), 2 agosto 2026 (art. 50).
- Reg. (UE) 2026/1744: pubblicato in GUUE il 24 luglio 2026, in vigore dal 27 luglio 2026 (metadati Publications Office); entrata in vigore al terzo giorno, coerente.
- Da controllare a mano: i metadati del Regolamento 2026/1744 rimandano a un corrigendum del 29 settembre 2026; non ne ho letto il contenuto e gli articoli non lo citano.

### seo-geo-engineer

**SEO-1 (media). Pagine noindex dentro la sitemap in production.** `/aziende/provincia/enna/` e `/eventi/provincia/enna/` hanno `noindex, follow` (regola nelle pagine `src/pages/aziende/provincia/[provincia].astro` e analoga eventi: nessuna azienda e nessun evento nella provincia) ma compaiono in `sitemap-pagine.xml`, perché `SitePage.indexable` in `src/lib/seo/pages.ts` è `true` per tutte le province. Correzione: calcolare `indexable` con la stessa condizione delle pagine. Collegato: Agrigento, Caltanissetta, Ragusa e Trapani restano indicizzabili con "nessuna scheda verificata" nell'elenco aziende; è una scelta da confermare (pagine sottili).

### events-researcher

**EV-1 (media). Testo di servizio nella descrizione pubblica.** `vivere-era-algoritmi-ai-educazione-salute-trapani-2026-09`: la descrizione chiude con "Le coordinate indicate sono quelle del centro di Trapani." ed è visibile nella pagina evento. Va tolta dal testo; la precisione delle coordinate si gestisce nei dati.

**EV-2 (media, da decidere). Centralità dell'AI.** `fig-commission-9-ai-immobiliare-ragusa-2026-10` è una conferenza internazionale sulla modellazione del mercato immobiliare; l'AI occupa la giornata del 15 ottobre, mentre il 16 è riservato ai delegati in inglese. Inoltre `event_url` e `source_url` coincidono e sono un articolo di cronaca locale (ragusaoggi.it), non una pagina FIG o CNGeGL; la frase sullo "spazio ad AI e modelli di valutazione automatica" non è emersa dall'articolo. Mantenere solo se si accetta l'AI come tema parziale, e cercare la fonte ufficiale.

**EV-3 (bassa).** `custodire-umano-ai-lavoro-siracusa-2026-09`: la `source_url` (camminosiracusa.it) conferma data (28 settembre 2026), enciclica e organizzatori ma non sede né programma; programma e sede (Salone Giulio Pastore, via Arsenale 22; mattina al Santuario) stanno nell'`event_url` (siracusanews.it), che a sua volta non riporta la data. Le due fonti insieme reggono, ma la parte pomeridiana è un "talk" con moderatrice, non una "tavola rotonda", e i temi elencati (ricerca medica, salute mentale, impianti industriali, comunicazione) non li ho potuti confermare. `venue_address` vale solo per il Salone.

**EV-4 (bassa).** Quattro eventi del campione hanno come unica fonte un articolo di stampa e non la pagina dell'organizzatore (fig, custodire-umano, teologia, vivere-era-algoritmi). Se l'organizzatore ha una pagina, preferirla.

Link da aggiornare (redirect): `generazionidigitali.develhope.co/zen` va a `/it/zen`; `globalai.community/agentcamp/catania` va a `/e/6f3okoy6`; `italpress.com/?p=675606` ha uno slug definitivo; `lumsa.it/` passa da due redirect a `lumsa.it/it/home`.

### directory-researcher

**DIR-1 (alta). `is_innovative_startup` senza fonte ufficiale.** `zaiera`: `is_innovative_startup: true`, ma lo schema (`src/content.config.ts`) dice "true solo se presente nel registro ufficiale delle startup innovative (fonte in source_urls)". Le `source_urls` sono solo il sito dell'azienda (`zaiera.net` e `/trasparenza`, che riporta l'iscrizione alla sezione speciale il 9 febbraio 2026). Aggiungere la fonte del Registro Imprese/startup.registroimprese.it oppure togliere il flag. `founded_year: 2025` è coerente con la data di costituzione (7 novembre 2025) in `/trasparenza`.

**DIR-2 (media). Zaiera, affermazioni più forti della fonte.** La descrizione dice che sensori e modello "rilevano frequenza cardiaca, respiro e cadute"; la pagina avverte che i protocolli clinici sono "in fase di definizione". L'hub per l'elisoccorso ha solo l'autorizzazione dell'Assessorato alla realizzazione (prot. 9112 del 10 febbraio 2026), non risulta operativo. Usare formule come "dichiara" e "autorizzato", e indicare lo stato dei protocolli clinici.

**DIR-3 (media). Kazaam Lab, attività attuale non dimostrata.** `type: startup` si regge solo su citazioni di stampa del 2019-2021 sul sito (premi 2019-2020, articolo del 25 febbraio 2021) e sul footer "Kazaam Inc. 2020"; il sito non ha contenuti più recenti. L'indirizzo (via Biagio Petrocelli 11, Palermo) è confermato, ma `last_verified: 2026-10-21` suggerisce una verifica che l'evidenza non copre. Verificare che l'impresa sia attiva (Registro Imprese) o spostare in `data/_pending/`.

**DIR-4 (media). RoboticsLab UniPa, descrizione troppo vicina alla fonte.** La scheda della fonte (PDF del Dipartimento di Ingegneria) dice "la coscienza artificiale, il senso di sé e il discorso interno nei robot"; la scheda dice "coscienza artificiale, senso di sé e discorso interno delle macchine" (8 parole quasi identiche). Anche "robot per accompagnare l'invecchiamento… fisioterapia" e "robot direttore d'orchestra" ricalcano la fonte. Riscrivere. Inoltre: "Viale delle Scienze" non compare nelle fonti citate (il PDF dice "Ed. 6 2°P"), `geo_precision: indirizzo` poggia quindi su un indirizzo ricavato altrove; `website` punta alla pagina del dipartimento, non al laboratorio.

**DIR-5 (bassa). URL con nome di persona in `source_urls`.** Tre laboratori UniPa (`roboticslab-unipa`, `laboratorio-visione-artificiale-unipa`, `laboratorio-intelligenza-artificiale-unipa`) citano PDF ospitati sotto `.../persone/tecnico-amministrativi/m/mario.minacapilli/...`. Sono pagine pubbliche e il PDF ha dati di contatto di un docente che non sono stati copiati, ma il nome di una persona compare nell'URL pubblicato. Preferire `centri.unipa.it/laboratori/` o la pagina del dipartimento.

**DIR-6 (bassa, da decidere). Keplera, AI non centrale.** È uno studio di consulenza legale: l'AI sta nel prodotto LexHero (lexhero.com, che non nomina il produttore; lo fa l'informativa privacy, titolare Keplera S.r.l., stessa sede). keplera.it presenta LexHero come software per redigere e gestire contratti, senza parlare di AI. Mantenere solo con la descrizione centrata su LexHero come ora; confermare il criterio "AI centrale".

**DIR-7 (bassa). Redirect da aggiornare nei dati.** `www.aitho.it` va a `aitho.it` (website e due `source_urls`); `canonity.com` a `www.canonity.com`; `keplera.it` a `www.keplera.it`; `lexhero.com/privacy-policy` a `/privacy-policy/`; tre PDF `unipa.it/persone/...` a `www.unipa.it`. Non sono rotti. `aitho` ha `address` ma `geo_precision: città`: prudente, ma si potrebbe geocodificare l'indirizzo.

### content-writer / copy-editor, link negli articoli

Redirect da aggiornare: `docs.perplexity.ai/guides/bots` va a `.../docs/resources/perplexity-crawlers` (geo-farsi-trovare…); `euroinfosicilia.it/bandi/` va a `/bandi-e-avvisi-aperti/` (articolo incentivi, YMYL); `garanteprivacy.it/regolamentoue/il-testo-del-regolamento` va a `/il-testo-del-regolamento` (guida AI Act, YMYL). Non verificabili: i due link EUR-Lex (`/eli/reg/2024/1689/oj/ita` e `/eli/reg/2026/1744/oj/eng`) rispondono 202 con sfida WAF; per il Regolamento 2026/1744 ho confermato l'esistenza, la data di pubblicazione e l'entrata in vigore dai metadati del Publications Office.

### frontend-builder

**FE-1 (media, blocco production). Segnaposto `[DA COMPLETARE]`.** 11 occorrenze, tutte su pagine istituzionali previste: `chi-siamo` (foto, email, LinkedIn, ruolo in Google / Liu Jo / Plenitude), `contatti` (email), `rimozione` (tempi di risposta), `note-legali` (licenza), `privacy` (titolare, Formspree/Tally, tempo di conservazione), `metodologia` (frequenza di revisione delle schede). Gli ultimi due (conservazione, frequenza di revisione) non sono elencati nella spec del frontend-builder. In production quelle pagine sono indicizzabili e in sitemap: vanno riempite o le pagine tenute fuori prima del passaggio. Non ci sono segnaposto in altre pagine, né in llms.txt, RSS o dati.

## Campione fact-check

Seme: **20261021**, generatore mulberry32, Fisher-Yates sull'elenco dei file ordinato per nome; script `docs/qa/campione-dati.mjs`. Aziende 20 record, 30% = 6; eventi 34 record, 30% = 10. (Il conteggio eventi è 34, non 35.) Aggiunti d'ufficio: `zaiera`, `selfmotion`, `kazaam-lab`. Tra i borderline richiesti `aitho`, `keplera`, `fcrlab` e un laboratorio UniPa erano già estratti a sorte (i laboratori UniPa estratti sono due). Le fonti sono state aperte con WebFetch e con curl dove la sintesi non bastava.

### Aziende (9)

| Record | Esito | Note |
|---|---|---|
| aitho | ok | Società benefit, Piazza Europa 13 Catania, tecnologie e settori (financial services, trasporti, food; retail, banking, istruzione) confermati; descrizione riscritta. Redirect www→apex da aggiornare |
| fcrlab-future-computing-research-laboratory | ok | Nome, ateneo, aree e applicazioni confermati; nessun indirizzo in fonte, coerente con `geo_precision: città`. Nessun dato personale copiato (la fonte ha email e profili). AI è una delle tre linee: accettabile |
| keplera | da decidere | Dati, sede e prodotto confermati; AI non centrale per lo studio (DIR-6) |
| laboratorio-analisi-immagini-biomedicali-unipa | ok | CAD mammografico, progetto A.I.D.A., spin-off, composizione del gruppo confermati; nessun nome copiato |
| perceive-ai-lab | ok | Indirizzo, linee di ricerca e temi recenti confermati; email e telefono generali non copiati |
| roboticslab-unipa | da correggere | Descrizione troppo vicina alla fonte, indirizzo non nelle fonti (DIR-4, DIR-5) |
| zaiera | da correggere | Flag startup innovativa senza fonte ufficiale; affermazioni da attenuare (DIR-1, DIR-2). Sede, anno 2025, AALisi Engine e radar 60-77 GHz confermati |
| selfmotion | ok | Teleriabilitazione, analisi sul dispositivo, solo dati del movimento, MDR in corso, sede Via Tolomea 70 confermati |
| kazaam-lab | da verificare | Sede e attività descritte confermate sul sito, ma contenuti fermi al 2021 (DIR-3) |

### Eventi (10)

| Record | Esito | Note |
|---|---|---|
| custodire-umano-ai-lavoro-siracusa-2026-09 | ok con riserve | Data, organizzatori, sedi e programma confermati incrociando le due fonti (EV-3) |
| fig-commission-9-ai-immobiliare-ragusa-2026-10 | da decidere | Date, luogo, crediti, traduzione, collegamento remoto confermati; AI non centrale, fonte non ufficiale (EV-2) |
| ia-per-la-didattica-keynote-workshop-palermo-2026-05 | ok | 6 maggio 2026, Aula Dynamo 6, Ed. 7, viale delle Scienze, registrazioni confermati |
| ia-teologia-prolusione-agrigento-2026-10 | ok | 21 ottobre 2026 ore 17, parrocchia San Gregorio Agrigentino, relatore AI4I/Cattolica, conclusioni dell'arcivescovo, anno accademico 2026/2027 confermati |
| intelligenza-aliena-ia-architetti-palermo-2026-06 | ok | 1 giugno, 15-19, Aula Gregotti, gratuito, iscrizione sul portale CNAPPC, 4 CFP in accreditamento confermati |
| marinai-intelligenza-artificiale-palermo-2026-08 | ok | 6 agosto, 18:30-20:00, Lega Navale Arenella, quattro interventi, podcast Vucciria confermati; la fonte lo segna "Evento Terminato" |
| seminario-robot-emozioni-ai-catania-2026-10 | ok | 26 ottobre ore 11, Aula Magna DMI, viale Andrea Doria 6, Teams, libro 2026 confermati |
| sicurezza-informazioni-ia-palermo-2026-10 | ok | 23 ottobre 9-13, ITS Vittorio Emanuele III via Duca della Verdura 48, DIGITALmeet 19-24 ottobre, 40 posti, 5 euro, 3 CFP confermati. Posti riservati a ingegneri iscritti all'albo |
| strumenti-base-didattica-ia-palermo-2026-04 | ok | 23 aprile, 15-17, Sala delle Capriate dello Steri, registrazione e slide, refuso del titolo confermati |
| vivere-era-algoritmi-ai-educazione-salute-trapani-2026-09 | da correggere | Dati confermati (29 settembre, 18:00, Ordine dei Medici, patrocinio Erice); testo di servizio nella descrizione (EV-1) |

Per tutti gli eventi in presenza il criterio "in Sicilia" è rispettato. Nessuna descrizione del campione copia frasi della fonte oltre 8-10 parole, con l'unica eccezione di RoboticsLab. Nessun dato personale (nomi di relatori o contatti) nelle descrizioni del campione. Non ho ricontrollato ora i record fuori campione.

## Link: dettaglio

148 URL unici da `companies` (website, source_urls, same_as), `events` (event_url, source_url, organizer_url), `prompts` e `articles` (sources e link nel corpo, compresi i due articoli YMYL fuori build). Controllo con `docs/qa/linkcheck-dati.mjs`: HEAD con ripiego su GET e un nuovo tentativo su errori 5xx e timeout; una richiesta al secondo per dominio. Esiti: 146 con 200, 2 con 202 (EUR-Lex, non verificabili), nessun 4xx/5xx, nessun timeout, nessun 403/429. Elenco completo con pagina di provenienza in `docs/qa/linkcheck-dati-2026-10-21.json`.
