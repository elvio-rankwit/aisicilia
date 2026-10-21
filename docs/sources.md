# Fonti candidate

Punti di partenza, **tutti da verificare** prima dell'uso. Gli URL indicati sono ingressi di ricerca, non fonti già controllate. Ogni agente che usa una fonte aggiorna la colonna "Stato" (`ok`, `vietato dai termini`, `non raggiungibile`, `non pertinente`) con la data.

Regole (brief §3.4): niente scraping di LinkedIn, Crunchbase o siti che lo vietano; rispettare `robots.txt`; max 1 richiesta al secondo per dominio; preferire open data, siti ufficiali, pagine evento pubbliche, feed RSS/iCal.

## Aziende e startup

| Fonte | Tipo | Ingresso | Note | Stato |
|---|---|---|---|---|
| Registro startup e PMI innovative (InfoCamere / MIMIT) | open data | https://startup.registroimprese.it | Elenchi scaricabili; filtrare regione Sicilia e cercare AI, machine learning, dati, visione nell'oggetto sociale/descrizione. Conferma poi sul sito aziendale. | non raggiungibile 2026-10-21 (nessuna risposta utile da startup.registroimprese.it; usate le pagine «Trasparenza» dei siti aziendali) |
| Spin-off Università di Palermo | sito istituzionale | https://www.unipa.it | Elenco spin-off accreditati | parziale 2026-10-21 (elenco di ateneo non raggiungibile; usata la pagina spin-off del Dipartimento DIID: PerGen e Intelener in `_pending`, nessun altro spin-off AI) |
| Spin-off Università di Catania | sito istituzionale | https://www.unict.it | Elenco spin-off | parziale 2026-10-21 (pagine elenco 404/503; spin-off individuati da siti ufficiali e laboratori: Next Vision, iCTLab) |
| Spin-off Università di Messina | sito istituzionale | https://www.unime.it | Elenco spin-off | non pertinente 2026-10-21 (pagina elenco non trovata, nessuno spin-off AI individuato) |
| Università Kore di Enna | sito istituzionale | https://www.unikore.it | Spin-off e laboratori | non pertinente 2026-10-21 (strutture di ricerca consultate: nessuna dedicata ad AI; spin-off non trovati) |
| Istituti CNR con sede in Sicilia | sito istituzionale | https://www.cnr.it | Solo istituti/sedi con attività AI dichiarata | ok 2026-10-21 (CNR-ICAR sede di Palermo, da icar.cnr.it) |
| Incubatori e acceleratori siciliani | siti ufficiali | ricerca web | Incubatori universitari, hub d'innovazione, coworking con programmi di accelerazione | parziale 2026-10-21 (Palermo: sito Magnisi con 403, Digital Magics Palermo non più attivo come sito proprio; nessun incubatore verificato) |
| Digital Innovation Hub ed EDIH attivi in Sicilia | siti ufficiali | ricerca web | Spesso elencano partner e aziende tech | da verificare |
| Community tecniche locali | siti/pagine pubbliche | ricerca web | GDG, gruppi Python/ML, associazioni: solo pagine pubbliche, niente nomi di persone | ok 2026-10-21 (Global AI Catania; GDG Nebrodi non dedicato all'AI) |
| Stampa locale e di settore | articoli | ricerca web | Solo per scoprire nomi: ogni dato va poi confermato sul sito dell'azienda | ok 2026-10-21 (solo per scoprire nomi: Catania, Messina, Siracusa, Ragusa; Palermo e Sicilia occidentale: Forbes Italia, PalermoToday, Dieci, Balarm, Panorama) |
| Laboratori di ricerca AI dell'Università di Catania (IPLab, PeRCeiVe.AI Lab) | siti dei laboratori | https://iplab.dmi.unict.it, https://www.perceivelab.com | Sedi e attività dichiarate dai laboratori | ok 2026-10-21 |
| Laboratori di ricerca UniPa (repertorio di ateneo e schede dei laboratori del Dipartimento di Ingegneria) | repertorio e schede PDF | https://centri.unipa.it/laboratori/ | Ubicazione e attività di Laboratori di AI, visione artificiale, robotica | ok 2026-10-21 |
| I3P, incubatore del Politecnico di Torino (pagina startup AiDA) | sito istituzionale | https://www.i3p.it | Seconda fonte per AIM Solutions | ok 2026-10-21 |
| Sicily Valley (distretto tecnologico, elenco aziende socie) | elenco aziende | https://www.sicilyvalley.it/aziende-sicily-valley/en/le-aziende/ | Descrizioni troppo generiche, filtro AI non leggibile senza JavaScript | non pertinente 2026-10-21 |

## Eventi

| Fonte | Tipo | Ingresso | Note | Stato |
|---|---|---|---|---|
| Eventbrite | pagine evento pubbliche | https://www.eventbrite.it | Ricerca "intelligenza artificiale" per città siciliane. Rispettare rate limit (risponde 429 se si esagera). | parziale 2026-10-21 (CT/ME/SR/RG): pagine evento ok ma povere di dettagli, elenchi di ricerca non leggibili (405); OVEST: ricerca per città non leggibile (405); solo pagine evento singole 2026-10-21 |
| Meetup | pagine gruppo/evento pubbliche | https://www.meetup.com | Gruppi tech di Palermo, Catania, Messina | non pertinente 2026-10-21 (CT/ME/SR/RG): nessun gruppo AI con eventi trovato; community catanesi usano Luma, Eventbrite e globalai.community; OVEST: ok, trovato solo Panormus Tech (Palermo); l'ID numerico negli URL evento fa scattare il controllo "cellulare" del validatore 2026-10-21 |
| GDG (Google Developer Groups) | pagine pubbliche | https://gdg.community.dev | Capitoli siciliani | ok 2026-10-21 (GDG Catania: DevFest 2026 in `_pending`, programma non ancora pubblicato); OVEST: GDG Palermo ha un solo evento generico (30/09/2026), non pertinente 2026-10-21 |
| Università siciliane | sezioni eventi | siti istituzionali | Convegni, seminari aperti | ok 2026-10-21 (Unict: DMI, Ordine Avvocati/Lex; Unime: eventi; web.dmi.unict.it a volte risponde 503); OVEST: ok UniPA (CIMDU, dipartimenti); unikore.it risponde 503 2026-10-21 |
| Camere di Commercio e Punti Impresa Digitale (PID) | sezioni eventi | siti istituzionali | Webinar e seminari su AI per le imprese | ok 2026-10-21 (CT/ME/SR/RG): Camera di Commercio di Messina senza eventi AI; sito Sud Est Sicilia (ctrgsr.camcom.gov.it) non raggiungibile (503); OVEST: dominio CCIAA Palermo-Enna non raggiungibile 2026-10-21 |
| Associazioni di categoria | sezioni eventi | siti ufficiali | Confesercenti, Confcommercio, Confartigianato, CNA, Sicindustria (sedi siciliane) | ok 2026-10-21 (CT/ME/SR/RG): nessun evento AI futuro trovato; solo edizioni passate; OVEST: ANCE Sicilia ok; sicindustria.eu risponde 410; nessun evento AI futuro trovato per le altre 2026-10-21 |
| Incubatori, coworking, DIH/EDIH | sezioni eventi | siti ufficiali | | parziale 2026-10-21 (OVEST): Innovation Island, Panormus Tech, Faidda Tech Lab ok; nessuna pagina EDIH Sicilia trovata |
| Ordini professionali (Ingegneri e Architetti di Palermo) | sezioni eventi | https://palermo.ordingegneri.it, https://www.ordinearchitettipalermo.it | Seminari con crediti formativi, spesso su AI | ok 2026-10-21 (OVEST) |
| Innovation Island | calendario eventi | https://innovationisland.it/eventi/ | Solo per scoprire eventi: i dati si confermano sulla pagina dell'organizzatore | ok 2026-10-21 (OVEST) |
| Eventitech.it | aggregatore eventi tech | https://eventitech.it | Solo per scoprire eventi | ok 2026-10-21 (OVEST) |

## Fonti ufficiali per gli articoli (YMYL e dati)

| Fonte | Uso |
|---|---|
| EUR-Lex, Regolamento (UE) 2024/1689 (AI Act) | testo normativo |
| Commissione europea, pagine sull'AI Act e sull'AI Office | calendario di applicazione, linee guida |
| Garante per la protezione dei dati personali | GDPR e AI, provvedimenti |
| Gazzetta Ufficiale | legge italiana sull'intelligenza artificiale e decreti attuativi |
| AgID, Dipartimento per la trasformazione digitale | strategie e linee guida nazionali |
| MIMIT, Invitalia | incentivi nazionali |
| Regione Siciliana (PR FESR 2021-2027, Euroinfosicilia), IRFIS | bandi regionali |
| Camere di Commercio siciliane (PID, voucher digitali) | bandi locali; OVEST: dominio CCIAA Palermo-Enna non raggiungibile 2026-10-21 |
| ISTAT, Eurostat | statistiche su imprese e uso dell'AI |
| ISTAT, confini amministrativi | GeoJSON delle province (map-engineer) |
