# Fonti candidate

Punti di partenza, **tutti da verificare** prima dell'uso. Gli URL indicati sono ingressi di ricerca, non fonti già controllate. Ogni agente che usa una fonte aggiorna la colonna "Stato" (`ok`, `vietato dai termini`, `non raggiungibile`, `non pertinente`) con la data.

Regole (brief §3.4): niente scraping di LinkedIn, Crunchbase o siti che lo vietano; rispettare `robots.txt`; max 1 richiesta al secondo per dominio; preferire open data, siti ufficiali, pagine evento pubbliche, feed RSS/iCal.

## Aziende e startup

| Fonte | Tipo | Ingresso | Note | Stato |
|---|---|---|---|---|
| Registro startup e PMI innovative (InfoCamere / MIMIT) | open data | https://startup.registroimprese.it | Elenchi scaricabili; filtrare regione Sicilia e cercare AI, machine learning, dati, visione nell'oggetto sociale/descrizione. Conferma poi sul sito aziendale. | da verificare |
| Spin-off Università di Palermo | sito istituzionale | https://www.unipa.it | Elenco spin-off accreditati | da verificare |
| Spin-off Università di Catania | sito istituzionale | https://www.unict.it | Elenco spin-off | da verificare |
| Spin-off Università di Messina | sito istituzionale | https://www.unime.it | Elenco spin-off | da verificare |
| Università Kore di Enna | sito istituzionale | https://www.unikore.it | Spin-off e laboratori | da verificare |
| Istituti CNR con sede in Sicilia | sito istituzionale | https://www.cnr.it | Solo istituti/sedi con attività AI dichiarata | da verificare |
| Incubatori e acceleratori siciliani | siti ufficiali | ricerca web | Incubatori universitari, hub d'innovazione, coworking con programmi di accelerazione | da verificare |
| Digital Innovation Hub ed EDIH attivi in Sicilia | siti ufficiali | ricerca web | Spesso elencano partner e aziende tech | da verificare |
| Community tecniche locali | siti/pagine pubbliche | ricerca web | GDG, gruppi Python/ML, associazioni: solo pagine pubbliche, niente nomi di persone | da verificare |
| Stampa locale e di settore | articoli | ricerca web | Solo per scoprire nomi: ogni dato va poi confermato sul sito dell'azienda | da verificare |

## Eventi

| Fonte | Tipo | Ingresso | Note | Stato |
|---|---|---|---|---|
| Eventbrite | pagine evento pubbliche | https://www.eventbrite.it | Ricerca "intelligenza artificiale" per città siciliane. Rispettare rate limit (risponde 429 se si esagera). | da verificare |
| Meetup | pagine gruppo/evento pubbliche | https://www.meetup.com | Gruppi tech di Palermo, Catania, Messina | da verificare |
| GDG (Google Developer Groups) | pagine pubbliche | https://gdg.community.dev | Capitoli siciliani | da verificare |
| Università siciliane | sezioni eventi | siti istituzionali | Convegni, seminari aperti | da verificare |
| Camere di Commercio e Punti Impresa Digitale (PID) | sezioni eventi | siti istituzionali | Webinar e seminari su AI per le imprese | da verificare |
| Associazioni di categoria | sezioni eventi | siti ufficiali | Confesercenti, Confcommercio, Confartigianato, CNA, Sicindustria (sedi siciliane) | da verificare |
| Incubatori, coworking, DIH/EDIH | sezioni eventi | siti ufficiali | | da verificare |

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
| Camere di Commercio siciliane (PID, voucher digitali) | bandi locali |
| ISTAT, Eurostat | statistiche su imprese e uso dell'AI |
| ISTAT, confini amministrativi | GeoJSON delle province (map-engineer) |
