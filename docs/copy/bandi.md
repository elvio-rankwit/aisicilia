# Copy deck: Bandi e finanziamenti (D-042)

Versione 1, 26 ottobre 2026. Autore: copy agent. Testi pronti da incollare nelle pagine `/bandi/`, `/bandi/[slug]/`, `/bandi/chiusi/`, `/metodologia/`, `/segnala/`, nel menu e nel footer. Dopo l’inserimento passano dal copy-editor.

## 0. Convenzioni

- Apostrofi e virgolette come nel resto del sito: ’ e « ». Le parole evidenziate negli H1 usano il tag `<mark class="blk">`, come nelle altre testate.
- Nessun dato di bando è scritto qui: nomi, importi e date arrivano dai file `src/content/grants/*.json`. Dove il testo è un campo dei dati (descrizione, `ai_note`, `max_amount`, `deadline_note`) lo si stampa così com’è.
- Singolare e plurale: `{bando|bandi}` si legge «prima forma se n = 1, seconda negli altri casi (0 compreso)». Dove la frase cambia di più ci sono varianti scritte per esteso.
- «Ometti se 0» vuol dire che la frazione di frase tra parentesi quadre sparisce quando il numero è zero.

### Segnaposto

| Segnaposto | Significato | Calcolo |
|---|---|---|
| `{n_aperti}` | bandi con stato «aperto» | `grantStatus === 'aperto'` |
| `{n_apertura}` | bandi «in apertura» | `grantStatus === 'in apertura'` |
| `{n_elenco}` | aperti più in apertura | `getOpenGrants().length` |
| `{n_30}` | aperti con scadenza entro 30 giorni da oggi (oggi compreso) | `daysLeft` tra 0 e `NEXT_DAYS` |
| `{n_senza_scadenza}` | aperti senza `deadline` | sportelli con `deadline_note` |
| `{n_chiusi}` | bandi chiusi (anche in anticipo) | `getClosedGrants().length` |
| `{n_chiusi_anticipo}` | chiusi con `closed_early` | |
| `{n_dedicati}`, `{n_spese}`, `{n_digitale}` | bandi dell’elenco per ogni valore di `ai_fit` | |
| `{n_startup}` | bandi dell’elenco con «startup innovative» tra i beneficiari | |
| `{n_tutta}`, `{n_prov}` | bandi validi in tutta la Sicilia (scope regionale, nazionale, europeo) e bandi provinciali | |
| `{n_sportello}`, `{n_fp}`, `{n_voucher}`, `{n_agevolato}` | bandi dell’elenco per procedura «a sportello» e per tipo di aiuto | |
| `{data}` | oggi, nel formato di `formatDate` («26 ottobre 2026») | |
| `{data_agg}` | la `last_verified` più recente tra i bandi pubblicati | |
| `{data_fine_30}` | oggi più 30 giorni | |
| `{data_prima}`, `{titolo_prima}`, `{ente_prima}`, `{ora_prima}` | scadenza, titolo, ente e ora del primo bando aperto con scadenza | |
| `{data_apertura_prima}` | la prima `opens_at` futura | |

---

## 1. `/bandi/`

### 1.1 Testata

- Eyebrow: `Bandi · dati al {data_agg}`
- H1: `Bandi e finanziamenti <mark class="blk">AI</mark> in Sicilia`

**Risposta diretta** (primo paragrafo, 2 frasi: scegli la prima frase in base a aperti e in apertura, la seconda in base a `{n_30}`).

Prima frase:

- aperti ≥ 1, in apertura = 0: «**{n_aperti} {bando aperto|bandi aperti}** per chi ha una sede in Sicilia e un progetto di AI da finanziare.»
- aperti ≥ 1, in apertura ≥ 1: «**{n_aperti} {bando aperto|bandi aperti}** e {n_apertura} in apertura per chi ha una sede in Sicilia e un progetto di AI da finanziare.»
- aperti = 0, in apertura ≥ 1: «Oggi nessun bando è aperto, ma {n_apertura} {ha già una data di apertura|hanno già una data di apertura}: il primo apre il {data_apertura_prima}.» (qui niente seconda frase)
- aperti = 0, in apertura = 0: «Oggi nel nostro elenco non c’è nessun bando aperto o in apertura.» (niente seconda frase)

Seconda frase (solo se aperti ≥ 1):

- `{n_30}` = 1: «Uno scade entro 30 giorni, il {data_prima}.»
- `{n_30}` ≥ 2: «{n_30} scadono entro 30 giorni, il primo il {data_prima}.»
- `{n_30}` = 0 e c’è almeno una scadenza: «Nessuno scade entro 30 giorni: il primo chiude il {data_prima}.»
- nessun bando aperto ha una scadenza: «Sono sportelli senza data finale: chiudono quando finiscono i fondi.»

**Secondo paragrafo** (se c’è almeno un bando aperto o in apertura):
«Ogni scheda rimanda all’avviso ufficiale e dice quando l’abbiamo controllato. I bandi chiusi restano nell’[archivio]({n_chiusi > 0: " ({n_chiusi})"}); i criteri con cui scegliamo sono nella [metodologia].»
Link: archivio → `/bandi/chiusi/`, metodologia → `/metodologia/#h-bandi`.

**Secondo paragrafo se l’elenco è vuoto:**
«Intanto puoi guardare l’[archivio dei bandi chiusi]: serve a capire quali tornano e cosa preparare prima. Ne conosci uno aperto? [Segnalalo].»

**Cifre della testata** (`dl.figs`, etichetta sotto, numero sopra):

- `{n_aperti}` · «aperti»
- `{n_apertura}` · «in apertura» (ometti se 0)
- `{n_30}` · «scadono entro 30 giorni»
- `{n_chiusi}` · «in archivio»

**Riquadro laterale «Prossima scadenza»** (stile Panel, come «Prossimi 30 giorni» degli eventi):

- k: «Prossima scadenza»
- v: `{data_prima}`
- d: «{titolo_prima}, {ente_prima}.»
- link: «Apri la scheda»
- Se nessun aperto ha una scadenza, v: «Nessuna data fissa» e d: «Gli sportelli aperti chiudono quando i fondi finiscono.»
- Se non ci sono bandi aperti: non mostrare il riquadro.

### 1.2 Avvertenza (sobria, subito dopo la testata)

- Titolo: «Leggi l’avviso prima di spendere»
- Testo, paragrafo 1: «Questa pagina informa e non sostituisce l’avviso ufficiale. Date e condizioni sono quelle che abbiamo letto alla data di verifica scritta su ogni scheda: nel frattempo l’ente può averle cambiate, e gli sportelli chiudono anche prima della scadenza, quando i fondi finiscono.»
- Testo, paragrafo 2: «Prima di comprare o firmare qualcosa, apri l’avviso ufficiale (il link è in ogni scheda). Se hai dubbi sul tuo caso, chiedi al commercialista o all’ufficio incentivi della tua associazione di categoria. Noi non facciamo consulenza e non presentiamo domande.»

### 1.3 Sezione «In scadenza nei prossimi 30 giorni»

- Eyebrow: `{n_30} {bando|bandi}`
- Titolo: «In scadenza nei prossimi 30 giorni»
- Sottotitolo: «Dal {data} al {data_fine_30}, prima chi scade prima. Uno sportello può chiudere anche prima della data indicata.»
- Stato vuoto (`{n_30}` = 0, ma l’elenco non è vuoto): «Nessun bando scade nei prossimi 30 giorni.» Poi, secondo i dati: se esiste una scadenza oltre i 30 giorni, «Il primo chiude il {data_prima}.»; se ci sono sportelli senza data finale, «Gli sportelli senza data finale chiudono quando finiscono i fondi.»

### 1.4 Sezione «Tutti i bandi aperti»

- Eyebrow: «Elenco»
- Titolo: «Tutti i bandi aperti e in apertura»
- Sottotitolo: «Filtra per provincia, chi può chiedere, tipo di aiuto, procedura o rapporto con l’AI. In ordine di scadenza: in fondo gli sportelli senza una data finale, che chiudono quando finiscono i fondi.»
- Riga sotto il titolo, prima dei filtri (legenda del «rapporto con l’AI», in un `details` chiuso): sommario «Cosa vuol dire il rapporto con l’AI», poi:
  - «**Dedicato all’AI.** Il bando riguarda l’intelligenza artificiale, in modo esplicito.»
  - «**AI tra le spese ammesse.** Finanzia più tecnologie e il testo nomina l’AI nell’elenco.»
  - «**Innovazione digitale.** Non è pensato per l’AI: finanzia progetti digitali o di innovazione, e un progetto di AI può rientrarci. Se la tua spesa sia ammessa lo decide l’ente.»

### 1.5 Filtri (`ListFilters`, tutti etichette di campo)

| Chiave | Etichetta | Voce «tutti» | Opzioni |
|---|---|---|---|
| ricerca | «Cerca per titolo, ente o parola chiave» | | |
| provincia | «Provincia della sede» | «Tutte le province» | nomi di `provinces.ts` |
| ambito | «Ambito del bando» | «Tutti gli ambiti» | «Una o più province», «Tutta la Sicilia», «Nazionale», «Europeo» |
| chi | «Chi può chiedere» | «Tutti» | valori di `GRANT_BENEFICIARIES`, con l’iniziale maiuscola |
| aiuto | «Tipo di aiuto» | «Tutti» | valori di `GRANT_AID_TYPES`, con l’iniziale maiuscola |
| procedura | «Procedura» | «Tutte» | valori di `GRANT_PROCEDURES`, con l’iniziale maiuscola |
| stato | «Stato» | «Aperti e in apertura» | «Aperto», «In apertura» |
| ai | «Rapporto con l’AI» | «Tutti» | valori di `GRANT_AI_FIT`, con l’iniziale maiuscola |

- Nome del conteggio (`noun`): `['bando', 'bandi']`.
- Nota sotto il filtro provincia (hint): «Scegliendo una provincia vedi anche i bandi validi in tutta la Sicilia.»
- Nessun risultato con i filtri: «Nessun bando con questi filtri. Togline qualcuno, oppure [segnala il bando che manca].» (il componente oggi scrive «segnala ciò che manca»: va bene anche quello se non si vuole un prop in più.)

### 1.6 Scheda nell’elenco (`BandoCard`)

- Riga ente: `{ente}`
- Titolo: titolo del bando (link alla scheda)
- Scadenza, in ordine di priorità:
  - scade oggi: «Scade oggi» (con ora: «Scade oggi alle {ora}»)
  - scade domani: «Scade domani»
  - da 2 a 30 giorni: «Scade il {data} (tra {giorni} giorni)»
  - oltre 30 giorni: «Scade il {data}»
  - senza scadenza: `{deadline_note}` (es. «fino a esaurimento delle risorse»)
  - in apertura: «Apre il {data}» (e se c’è la scadenza, sotto: «Scade il {data}»)
- Importo: «Fino a:» seguito dal campo `max_amount` così com’è. Non anteporre «Fino a» se il testo della fonte già comincia con «fino a»: in quel caso stampare solo il campo. Se manca, non scrivere nulla.
- Etichetta AI: il valore di `ai_fit` con l’iniziale maiuscola.
- Azione: «Apri la scheda»
- Etichetta di stato: vedi sezione 2.2.

### 1.7 Stati vuoti

**Nessun bando aperto né in apertura** (`EmptyList`)

- Titolo: «Nessun bando aperto, per ora»
- Testo: «Nel nostro elenco oggi non c’è nessun bando aperto o in apertura. Succede: gli avvisi escono a ondate e molti si esauriscono in fretta. L’archivio dice quali sono già passati e quali potrebbero tornare. Se ne conosci uno aperto, mandaci il link.»
- Azioni: «Vai all’archivio» (solo se `{n_chiusi}` > 0), «Segnala un bando» (principale)

**Nessun risultato con i filtri**: vedi 1.5.

### 1.8 Sezione «Come leggere un bando in 10 minuti»

Ancora `#come-leggere`. Eyebrow: «Prima di partire». Titolo: «Come leggere un bando in 10 minuti».

Introduzione: «Leggilo nell’ordine in cui un avviso può escluderti: così capisci presto se puoi andare avanti.»

Lista numerata (titolo in grassetto, poi una o due frasi):

1. **Chi può partecipare.** Dimensione dell’impresa, sede o unità locale in Sicilia, da quanto sei iscritto al Registro delle imprese. Se un requisito manca, è inutile andare avanti.
2. **Cosa finanzia.** Cerca l’elenco delle spese ammesse e quello delle escluse. Controlla se l’AI è nominata: se non lo è, chiedi all’ente per iscritto se la tua spesa rientra, prima di acquistare.
3. **Da quando contano le spese.** In molti avvisi vale solo ciò che spendi dopo una certa data, come la pubblicazione dell’avviso o l’invio della domanda. Un ordine firmato prima può restare fuori. Finché non sai la data, non firmare.
4. **Forma dell’aiuto e importo.** Fondo perduto, finanziamento agevolato, voucher, credito d’imposta. Guarda l’importo massimo e la percentuale sulle spese: il resto lo paghi tu, e in molti casi il contributo arriva dopo che hai speso e rendicontato.
5. **De minimis.** È il regime degli aiuti di importo limitato: ogni impresa ha un tetto agli aiuti ricevuti in 3 esercizi, e un nuovo contributo ne consuma una parte. Chiedi al commercialista quanti ne hai già avuti.
6. **Sportello o graduatoria.** A sportello conta l’ordine di arrivo e si può chiudere in un giorno, se i fondi sono pochi. Con la graduatoria si valuta dopo la scadenza: non serve correre, serve un progetto che prenda punti. Il click day si apre a un’ora precisa e vince chi invia prima.
7. **Cosa preparare prima.** Firma digitale, PEC, SPID o un’altra identità digitale se la piattaforma la chiede, visura camerale aggiornata, preventivi dei fornitori, DURC regolare se richiesto. Parti da ciò che dipende da altri: preventivi e documenti di terzi.

Chiusura: «Se un punto resta oscuro, scrivi all’ente prima di comprare. Una risposta scritta ti serve anche dopo, quando rendiconti.»

### 1.9 Sezione archivio (anteprima in fondo a `/bandi/`)

- Eyebrow: «Archivio»
- Titolo: «Bandi chiusi»
- Link «more»: «Archivio: {n_chiusi} {bando chiuso|bandi chiusi}» (senza numero se 0: «Archivio dei bandi chiusi»)
- Sottotitolo: «Non puoi più presentare domanda, ma molti tornano: leggere l’edizione scorsa ti aiuta a prepararti.»

### 1.10 Domande e risposte calcolate

Eyebrow: «Domande». Titolo della sezione: «Domande sui bandi». Le risposte sono testo semplice (finiscono anche nel JSON-LD `FAQPage`), senza HTML e senza link. Le prime 5 vanno sempre; le altre 3 si aggiungono se c’è spazio. In ogni risposta, «Al {data}» si riferisce alla data di build.

**D1. Quanti bandi per l’AI sono aperti oggi in Sicilia?**

- Se `{n_elenco}` > 0, la risposta si compone di una frase fissa, fino a tre frasi sui livelli di AI e una chiusura.
  - Apertura: «Al {data} ne risultano {n_aperti} aperti.» Se ci sono bandi in apertura: «Al {data} ne risultano {n_aperti} aperti e {n_apertura} in apertura.» Se gli aperti sono 0: «Al {data} nessuno è ancora aperto, ma {n_apertura} {ha già una data di apertura|hanno già una data di apertura}.»
  - Livelli di AI, solo quelli con numero maggiore di 0 (1: «Uno è dedicato all’AI.»; 2 o più: «{n_dedicati} sono dedicati all’AI.»):
    - dedicati: «Uno è dedicato all’AI.» / «{n_dedicati} sono dedicati all’AI.»
    - spese ammesse: «Uno nomina l’AI tra le spese ammesse.» / «{n_spese} nominano l’AI tra le spese ammesse.»
    - innovazione digitale: «Uno finanzia progetti di innovazione digitale in cui un progetto di AI può rientrare.» / «{n_digitale} finanziano progetti di innovazione digitale in cui un progetto di AI può rientrare.»
  - Chiusura: «Il numero cambia in fretta, perché gli sportelli chiudono anche prima della scadenza: ogni bando riporta la data in cui l’abbiamo verificato.»
- Se `{n_elenco}` = 0: «Al {data} nessuno: nel nostro elenco non c’è un bando aperto o in apertura. I {n_chiusi} chiusi sono nell’archivio, e alcuni potrebbero tornare.» (se `{n_chiusi}` = 0, ometti la seconda frase)

**D2. Qual è il prossimo bando in scadenza?**

- Con scadenza: «Al {data} è «{titolo_prima}», di {ente_prima}: scade il {data_prima}, tra {giorni} giorni.» Con ora: «scade il {data_prima} alle {ora_prima}». Se mancano 1 giorno: «scade domani, il {data_prima}». Se è oggi: «scade oggi».
  - Se la procedura è a sportello, aggiungi: «È a sportello: conta l’ordine di arrivo e può chiudere prima, se i fondi finiscono.»
  - Se `{n_30}` ≥ 2, aggiungi: «Altri {n_30 meno 1} scadono nei 30 giorni successivi.» (con 2 in totale: «Un altro scade entro 30 giorni.»)
- Nessun aperto ha una scadenza: «Al {data} nessun bando aperto ha una data finale. Sono sportelli che chiudono quando finiscono i fondi, quindi non c’è un giorno da segnare: conviene presentare la domanda appena hai i documenti pronti.»
- Nessun bando aperto: «Al {data} non ci sono bandi aperti, quindi nessuna scadenza in vista. Le prossime aperture, se annunciate, compaiono in cima all’elenco con la data di apertura.»

**D3. Ci sono bandi per startup innovative?**

- Se `{n_startup}` > 0: «Al {data} {n_startup} {bando|bandi} dell’elenco {è rivolto|sono rivolti} anche alle startup innovative: {elenco_titoli}. Nella scheda trovi i requisiti: spesso contano l’iscrizione alla sezione speciale del Registro delle imprese e da quanto tempo esiste l’impresa.»
  (`{elenco_titoli}`: i titoli uniti da virgole e «e», senza virgolette.)
- Se 0: «Al {data} nessun bando aperto o in apertura indica le startup innovative tra i beneficiari. Se stai per costituire un’impresa, guarda anche quelli per nuove imprese e aspiranti imprenditori: il filtro «Chi può chiedere» li separa.»

**D4. Ci sono bandi della mia provincia?**

- Se `{n_prov}` > 0: «Dipende da dove hai la sede. {n_tutta} {bando vale|bandi valgono} per tutta la Sicilia, o oltre. {n_prov} {vale|valgono} solo in alcune province, di solito perché li emette una Camera di Commercio: {elenco province con il numero, es. «Ragusa (1), Siracusa (2)»}. Scegli la provincia nel filtro e vedi i suoi bandi e quelli validi per tutti. Se la tua Camera non compare, oggi può non avere un bando aperto, oppure non l’abbiamo ancora trovato: chiedi al Punto Impresa Digitale.»
- Se `{n_prov}` = 0: «Al {data} tutti i bandi dell’elenco valgono per tutta la Sicilia: nessuno è limitato a una sola provincia. Le Camere di Commercio pubblicano spesso bandi propri per il territorio: se la tua non compare, chiedi al Punto Impresa Digitale.»
  (Nella prima variante, se `{n_tutta}` = 0 sostituisci la seconda frase con «Nessun bando vale per tutta la Sicilia.»)

**D5. Ogni quanto aggiornate l’elenco?**

«Il sito si ricostruisce ogni notte e lo stato di ogni bando (aperto, in apertura, chiuso) si ricalcola da solo sulle date, quindi un bando scaduto non resta tra gli aperti. I dati dei bandi, cioè importi, condizioni e scadenze, li ricontrolliamo sulla fonte ufficiale e a ogni scheda scriviamo la data dell’ultimo controllo: la più recente è del {data_agg}. Se un ente proroga o chiude lo sportello, lo scopriamo al controllo successivo: per questo l’avviso ufficiale resta la fonte che fa fede.»

**D6. Un bando può chiudere prima della scadenza?**

«Succede con gli sportelli: le domande si valutano in ordine di arrivo e, quando i fondi sono finiti, l’ente chiude. Al {data} {n_sportello} dei {n_elenco} bandi dell’elenco {è a sportello|sono a sportello}[. In archivio, {n_chiusi_anticipo} {ha chiuso|hanno chiuso} prima della data prevista]. Per questo la scadenza scritta è un limite massimo, non una garanzia.»
(Se `{n_sportello}` = 0: «Al {data} nessun bando aperto è a sportello, quindi il rischio è basso, ma una proroga o una modifica restano possibili: controlla l’avviso.»)

**D7. Quali bandi sono a fondo perduto?**

«Al {data} {n_fp} dei {n_elenco} bandi dell’elenco {è|sono} a fondo perduto[, {n_voucher} {è un voucher|sono voucher}][ e {n_agevolato} {è un finanziamento agevolato|sono finanziamenti agevolati}]. I conti si sovrappongono, perché un bando può combinare più forme di aiuto. Fondo perduto vuol dire che quella parte non la restituisci. Copre comunque solo una percentuale delle spese, e l’importo massimo e la percentuale sono scritti nella scheda.»
(Ometti ciascuna voce a zero. Se `{n_fp}` = 0: «Al {data} nessun bando dell’elenco è a fondo perduto: gli aiuti sono voucher, finanziamenti e altre forme. Le trovi nella scheda, alla voce «Agevolazione».»)

**D8. Posso comprare adesso e chiedere il contributo dopo?** (risposta fissa)

«Quasi mai conviene. In molti avvisi le spese contano solo se sostenute dopo una certa data, spesso quella di pubblicazione dell’avviso o di presentazione della domanda. Una fattura precedente può restare fuori dal contributo. Cerca la data nell’avviso prima di firmare ordini o contratti.»

**D9. Serve un consulente per presentare la domanda?** (risposta fissa)

«Dipende. Aiuta quando l’avviso richiede firma digitale, PEC, rendicontazione e verifica dei limiti de minimis. Diffida di chi garantisce il contributo o chiede una percentuale prima di aver letto l’avviso con te. Per i dubbi sul tuo caso, rivolgiti al commercialista o all’ufficio incentivi della tua associazione di categoria.»

### 1.11 CTA «Segnala»

(`CtaSegnala`, variante box)

- text: «Conosci un bando che manca? Mandaci il link alla pagina dell’ente: lo controlliamo sulla fonte ufficiale e, se un progetto di AI ci può stare, lo aggiungiamo.»
- label: «Segnala un bando»

---

## 2. `/bandi/[slug]/`

### 2.1 Testata e dati chiave

- Eyebrow: `Bando · {ente}`
- H1: titolo del bando (dai dati).
- Lead: `description` dei dati.
- Riga di verifica sotto il lead: «Verificato il {data_verifica} su fonte ufficiale.»

Titolo del blocco dati: «Il bando in breve».

Etichette (`dt`) e valori (`dd`):

| Etichetta | Valore |
|---|---|
| «Ente» | `issuer` |
| «Territorio» | regionale: «Tutta la Sicilia»; nazionale: «Nazionale, vale anche in Sicilia»; europeo: «Europeo, aperto alle imprese italiane»; provinciale: «Province di {elenco}» (es. «Province di Catania, Ragusa e Siracusa»); una sola provincia: «Provincia di {nome}» |
| «Chi può chiedere» | `beneficiaries` unite da virgole, iniziale maiuscola sulla prima |
| «Agevolazione» | `aid_types` unite da virgole, iniziale maiuscola sulla prima |
| «Dotazione» (solo se c’è `budget`) | `budget` |
| «Importo massimo» | `max_amount`; se manca: «Non indicato nella fonte» |
| «Intensità» | `aid_intensity`; se manca: «Non indicata nella fonte» |
| «Procedura» | vedi sotto |
| «Apertura» | `opens_at` nel formato di `formatDate`; se manca: «Già aperto» (solo se lo stato è aperto) oppure «Non indicata» |
| «Scadenza» | `{data}`, e se c’è l’ora `{data}, ore {ora}`; senza `deadline`: `deadline_note` (es. «fino a esaurimento delle risorse»); se ci sono entrambe, aggiungi la nota in una riga sotto |

Valori di «Procedura» (etichetta più mezza riga di spiegazione):

- a sportello: «A sportello. Conta l’ordine di arrivo delle domande.»
- graduatoria: «Graduatoria. Le domande si valutano dopo la scadenza.»
- click day: «Click day. Si apre a un’ora precisa e conta l’ordine di invio.»
- call con scadenza: «Call con scadenza. Le domande si valutano dopo la chiusura.»

Nota sotto «Scadenza», solo per i bandi a sportello ancora aperti: «Può chiudere prima, se i fondi finiscono.»

### 2.2 Etichette di stato (badge)

- Aperto: «Aperto»
- In apertura: «In apertura dal {data}»
- Chiuso: «Chiuso»
- Chiuso prima della scadenza (`closed_early`): «Chiuso in anticipo»

Riga di dettaglio accanto al badge (opzionale):

- Aperto con scadenza: «Scade il {data}»
- Chiuso in anticipo: «L’ente ha chiuso o sospeso lo sportello prima della scadenza prevista.»

### 2.3 Giorni alla scadenza

Per `daysLeft` (solo bandi aperti con `deadline`):

- ≥ 2: «Mancano {n} giorni»
- 1: «Scade domani»
- 0: «Scade oggi» (se c’è l’ora: «Scade oggi alle {ora}»)

Per i bandi in apertura:

- Apertura tra 2 o più giorni: «Apre tra {n} giorni»
- Apertura tra 1 giorno: «Apre domani»

Senza scadenza (sportello): «Nessuna scadenza fissa»

### 2.4 Riquadro «Perché c’entra l’AI»

- Titolo: «Perché c’entra l’AI»
- Introduzione: «Un bando entra nell’elenco solo se un progetto di AI può starci. Qui vedi in che modo, con il riferimento al testo ufficiale.»
- Riga per ogni valore di `ai_fit` (si mostra solo quella del bando, in evidenza, con il nome dell’etichetta in grassetto):
  - `dedicato all'AI`: «**Dedicato all’AI.** Il bando riguarda l’intelligenza artificiale, in modo esplicito.»
  - `AI tra le spese ammesse`: «**AI tra le spese ammesse.** Il bando finanzia più tecnologie e il testo nomina l’AI nell’elenco.»
  - `innovazione digitale`: «**Innovazione digitale.** Il bando non è pensato per l’AI: finanzia progetti digitali o di innovazione, e un progetto di AI può rientrarci. Se la tua spesa sia ammessa lo decide l’ente: chiedi per iscritto prima di comprare.»
- Etichetta davanti al testo di `ai_note`: «Cosa dice il testo»

### 2.5 Azioni

- Pulsante principale (verso `official_url`): «Vai all’avviso ufficiale»
- Nota sotto il pulsante (aperto): «Si apre il sito dell’ente, con l’avviso aggiornato e le istruzioni per presentare la domanda.»
- Nota sotto il pulsante (in apertura): «Le domande si presentano dal {data}. Intanto prepara i documenti: l’elenco è in «Come leggere un bando in 10 minuti».»
- Pulsante calendario (bandi con `deadline`): «Aggiungi la scadenza al calendario»
- Pulsante calendario per bandi in apertura, secondario: «Aggiungi l’apertura al calendario»
- Testo del file ICS (campo titolo): «Scadenza bando: {titolo}»
- Testo del file ICS (descrizione): «{titolo}, {ente}. Scadenza: {data}[, ore {ora}]. Verificata il {data_verifica}: l’ente può prorogare o chiudere prima, quindi ricontrolla l’avviso ufficiale: {official_url}»
- Link al metodo: «Come leggere un bando in 10 minuti» → `/bandi/#come-leggere`
- Titolo del blocco documenti: «Documenti ufficiali»
- Titolo del blocco fonti: «Fonti consultate»
- Riga finale: «Ultima verifica: {data_verifica}.»

### 2.6 Avvertenza breve

«Date e condizioni sono quelle lette sulla fonte ufficiale il {data_verifica}. L’ente può cambiarle, e uno sportello può chiudere prima se i fondi finiscono. Prima di spendere leggi l’avviso o chiedi al commercialista: questa scheda è informazione, non consulenza.»

### 2.7 Avviso «Bando chiuso»

- Titolo: «Bando chiuso»
- Testo, scadenza passata: «Questo bando ha chiuso il {data_scadenza} e non accetta più domande. Lo teniamo online perché alcuni bandi tornano ogni anno e conoscere condizioni e tempi dell’edizione scorsa aiuta a prepararsi. Non dare per scontato che le regole restino uguali: quando ne esce uno nuovo, conta l’avviso nuovo.»
- Testo, chiuso in anticipo: «L’ente ha chiuso o sospeso lo sportello prima della scadenza prevista, e il bando non accetta più domande. Lo teniamo online perché alcuni bandi tornano ogni anno e conoscere condizioni e tempi dell’edizione scorsa aiuta a prepararsi. Non dare per scontato che le regole restino uguali: quando ne esce uno nuovo, conta l’avviso nuovo.»
- Link: «Guarda i bandi chiusi» → `/bandi/chiusi/` e «Vedi i bandi aperti» → `/bandi/`
- Il pulsante «Vai all’avviso ufficiale» resta, con questa nota: «Controlla sul sito dell’ente se è uscita una nuova edizione.»
- Sul pulsante calendario: non mostrarlo.

### 2.8 Blocco «Altri bandi aperti»

- Titolo: «Altri bandi aperti»
- Sottotitolo (scheda di un bando aperto): «Prima quelli che scadono prima.»
- Sottotitolo (scheda di un bando chiuso): «Questi accettano domande adesso.»
- Link: «Tutti i bandi aperti»
- Stato vuoto: «Oggi non ci sono altri bandi aperti. Guarda l’[archivio] oppure [segnala un bando].»

### 2.9 CTA in fondo alla scheda

- text: «Un dato non torna con l’avviso ufficiale? Scrivici: lo controlliamo e lo correggiamo.»
- label: «Chiedi una correzione» → `/rimozione/` (la pagina che le altre schede usano per le correzioni; da verificare che il modulo accetti anche i bandi)

---

## 3. `/bandi/chiusi/`

- Eyebrow: «Bandi chiusi»
- H1: `Archivio dei bandi <mark class="blk">AI</mark> in Sicilia`

**Intro con bandi** (due paragrafi):

1. «**{n_chiusi} {bando chiuso|bandi chiusi}**, dal più recente. Non puoi più presentare domanda, ma conviene tenerli sotto mano.»
2. «Molti bandi tornano ogni anno, con regole simili ma mai uguali. Leggere l’edizione scorsa ti dice cosa chiedono, quanto tempo passa prima del pagamento e cosa devi avere pronto (firma digitale, preventivi, visura) quando apre la prossima. Quelli ancora aperti li trovi tra i [bandi aperti].»

**Riquadro laterale**

- k: «In archivio»
- v: `{n_chiusi}`
- d: «{bando chiuso|bandi chiusi} tra il {data_min} e il {data_max}.[ {n_chiusi_anticipo} {ha chiuso|hanno chiuso} prima della scadenza, per fondi finiti o sospensione.]»
- link: «Vai ai bandi aperti»

**Sezione**

- Eyebrow: «Archivio»
- Titolo: «Bandi chiusi»
- Sottotitolo: «I più recenti per primi. Le schede restano online come memoria: non servono per presentare domanda.»

**Stato vuoto (`EmptyList`)**

- Titolo: «Nessun bando in archivio, per ora»
- Testo: «Un bando arriva qui quando scade o quando l’ente chiude lo sportello. Per ora quelli che abbiamo sono tutti ancora aperti, o in apertura.»
- Azione: «Vai ai bandi aperti»

**Intro con archivio vuoto** (testata): «L’archivio è vuoto: nessun bando risulta ancora chiuso.» e, nel secondo paragrafo: «I bandi scaduti finiscono qui in automatico. Intanto guarda i [bandi aperti].»

**CTA**

- text: «Ti risulta che un bando sia tornato con una nuova edizione? Mandaci il link alla pagina ufficiale.»
- label: «Segnala un bando»

---

## 4. `/metodologia/`

Inserire una sezione dopo «Quali eventi entrano». Anchor `h-bandi`.

### Modifiche alle parti esistenti

- Paragrafo di apertura: sostituire la prima frase («Ogni azienda e ogni evento di AI Sicilia nasce da fonti pubbliche che abbiamo davvero consultato, e riporta la data dell’ultima verifica.») con «Ogni azienda, ogni evento e ogni bando di AI Sicilia nasce da fonti pubbliche che abbiamo davvero consultato, e riporta la data dell’ultima verifica.» Il resto del paragrafo resta com’è.
- Description (meta): «Da dove prendiamo aziende, eventi e bandi, quali criteri usiamo per includerli, cosa vuol dire “verificato” e come chiedere una correzione.» (141 caratteri circa, dentro il limite)
- Sezione «Le fonti che usiamo»: aggiungere in fondo al primo paragrafo, dopo «i calendari di università, camere di commercio e associazioni.»: «Per i bandi, l’ente che li emette o il soggetto che li gestisce.»

### Sezione nuova

**H2:** «Bandi e finanziamenti». Segue una serie di paragrafi, ciascuno con un grassetto iniziale al posto dell’H3 (le altre sezioni della pagina non hanno sottosezioni).

Paragrafo 1 (criterio): «Un bando entra nell’elenco se vale per chi ha una sede o un’unità locale in Sicilia, se è aperto oppure ha una data di apertura già pubblicata in un atto ufficiale, e se un progetto di AI ci può stare. Su quest’ultimo punto usiamo 3 livelli, che vedi come etichetta su ogni scheda.»

Elenco (3 voci, ognuna con titolo in grassetto):

- **Dedicato all’AI.** Il bando riguarda l’intelligenza artificiale in modo esplicito.
- **AI tra le spese ammesse.** Il testo del bando nomina l’AI tra le tecnologie, i progetti o le spese che finanzia. Nella scheda scriviamo dove.
- **Innovazione digitale.** Il bando finanzia progetti digitali o di innovazione e un progetto di AI ci rientra senza forzature, ma il testo non è pensato per l’AI. Lo usiamo con parsimonia e spieghiamo ogni volta perché.

Paragrafo 2: «Se non c’è nessuna AI plausibile (un bando solo per l’efficienza energetica, per esempio), non lo pubblichiamo. Teniamo anche qualche bando chiuso e ricorrente, nell’archivio, perché serve a prepararsi alla prossima edizione.»

**Solo fonti ufficiali.** «Date, importi e beneficiari li leggiamo sul sito dell’ente che emette il bando o del gestore, o sul testo dell’avviso, e mai da una notizia che li riporta. Blog, consulenti e portali che raccolgono bandi li usiamo solo come pista: se un bando compare lì, andiamo a verificarlo alla fonte, e se non la troviamo non lo pubblichiamo. Gli importi sono scritti come nell’avviso, senza stime nostre.»

**Data di verifica e stato.** «Ogni scheda ha la data in cui abbiamo controllato il bando sulla fonte. Lo stato (aperto, in apertura, chiuso) non lo scriviamo a mano: lo calcola il sito dalle date dell’avviso a ogni aggiornamento, cioè ogni notte, così un bando scaduto non resta tra quelli aperti. Il giorno della scadenza il bando risulta ancora aperto: guarda l’ora scritta nella scheda, perché l’avviso può fissarla prima di sera. Se un ente chiude lo sportello in anticipo, lo segniamo chiuso quando la fonte lo dice. Tra la chiusura e il nostro controllo può passare del tempo.»

**Una persona controlla prima della pubblicazione.** «I bandi sono informazioni che toccano i soldi di chi legge, quindi hanno una regola in più. Un agente AI cerca e prepara la bozza, poi una persona confronta ogni dato con la fonte e decide se pubblicare: la responsabilità è di Elvio Leonardi. Finché il controllo non è fatto, il bando non compare sul sito.»

**Cosa non facciamo.** «Non facciamo consulenza sui bandi e non prepariamo né presentiamo domande. Non diciamo se la tua impresa rientra nei requisiti, quanto otterresti o se la domanda sarà accolta: nessuna previsione sugli esiti, nessuna percentuale. Non siamo l’ente che emette il bando. Per il tuo caso serve l’avviso ufficiale e, se vuoi un parere, il commercialista o l’ufficio incentivi della tua associazione di categoria.»

Frase facoltativa da aggiungere dopo «Non siamo l’ente che emette il bando.», solo se Elvio la conferma (vedi sezione 8, punto 3): «Non incassiamo nulla da chi presenta domanda.»

**Se trovi un errore.** «Per correggere un bando usa il modulo [Richiedi modifica o rimozione](/rimozione/). Se ne manca uno, vai su [Segnala](/segnala/).»

---

## 5. `/segnala/`

### Testata

- Eyebrow: invariato («Contribuisci»)
- H1: `Segnala un’azienda, un evento o un <mark class="blk">bando</mark>`
- Paragrafo: «Se conosci un’azienda siciliana che lavora con l’intelligenza artificiale, un evento sul tema o un bando che può finanziare un progetto di AI, scrivicelo qui. Prima di pubblicare controlliamo le fonti: la segnalazione da sola non basta, ci vuole qualcosa di verificabile.»
- Title SEO: «Segnala un’azienda, un evento o un bando AI in Sicilia» (53 caratteri)
- Description SEO: «Manca un’azienda, un evento o un bando sull’intelligenza artificiale in Sicilia? Segnalalo: controlliamo le fonti e lo aggiungiamo se rispetta i criteri.» (150 caratteri circa)

### Sezione «Cosa pubblichiamo»

Aggiungere dopo la riga degli eventi:

«**Bandi:** avvisi di un ente pubblico o del suo gestore, aperti o con apertura già annunciata, a cui può partecipare chi ha sede in Sicilia, con l’AI nominata tra le spese ammesse o un progetto di AI che ci rientra senza forzature. Serve il link alla pagina ufficiale dell’ente: un bando trovato solo su un blog o su un portale non basta.»

E aggiornare la riga che rimanda alla metodologia: «I dettagli sono nella pagina [Come verifichiamo i dati](/metodologia/). Pubblichiamo solo dati aziendali, mai dati di persone.» (invariata; il link porta già alla pagina che ha la sezione bandi)

### Modulo

- Etichetta del gruppo: «Cosa vuoi segnalare» (invariata)
- Opzioni: «Un’azienda», «Un evento», «Un bando» (valore `bando`)
- Etichetta campo nome: «Nome dell’azienda, titolo dell’evento o del bando»
- Etichetta campo sito: «Sito o link» (invariata)
- Hint sotto «Sito o link»: «Per un bando, il link alla pagina dell’ente che lo emette.»
- Opzione extra nella select provincia: «Tutta la Sicilia» (valore `tutta-sicilia`), da mostrare accanto a «Evento online» e «Non lo so»
- Hint sotto «Che cosa c’entra l’AI» (aggiungere in coda a quello esistente): «Per un bando, dove nomina l’AI o perché un progetto di AI ci può stare.»
- Hint sotto «Dove l’hai letto» (aggiungere in coda): «Per un bando, scrivi anche la scadenza se la conosci: la controlliamo noi sull’avviso.»
- Pulsante: «Invia la segnalazione» (invariato)
- Etichetta del form (`label`): «Segnala azienda, evento o bando»

### Riga di aiuto (sotto il titolo «Cosa pubblichiamo» o sopra il modulo)

«Per un bando basta il link alla pagina ufficiale: date, importi e requisiti li leggiamo noi sull’avviso.»

### CTA a banda della home e box delle pagine

- `title` della banda: «Conosci un’azienda, un evento o un bando che non c’è?»
- testo di default del box: «Manca un’azienda, un evento o un bando? Segnalalo. Controlliamo le fonti e, se rispetta i criteri, lo aggiungiamo.»
- label di default del box: «Segnala»

(Facoltativo: se si preferisce non toccare la CTA delle altre sezioni, usare queste solo nelle pagine bandi.)

---

## 6. Menu, footer e home

- Menu principale: «Bandi», dopo «Eventi» (`/bandi/`).
- Footer, colonna «Esplora»: «Bandi» (`/bandi/`) dopo «Prossimi 30 giorni», poi «Bandi chiusi» (`/bandi/chiusi/`).
- Barra dei numeri della home (facoltativa): etichetta «Bandi aperti», numero `{n_aperti}`, link `/bandi/`.
- Link a «Bandi» anche nella pagina `/impara/incentivi-finanziamenti-digitalizzazione-ai-sicilia/`: fuori dal mio perimetro, lo segnalo nel report.

---

## 7. Title e description per l’agente SEO

Limiti: title ≤ 60, description 70–155. I conteggi sono fatti con valori d’esempio (`{n}` = 12, `{c}` = 5).

### `/bandi/`

**Proposta A** (consigliata)
- Title: «Bandi AI in Sicilia: aperti, in scadenza, archivio»
- Description (con bandi): «{n} bandi aperti in Sicilia per finanziare un progetto di AI: scadenze, importi e link all’avviso ufficiale. Fonti verificate, stato aggiornato ogni notte.»
- Description (elenco vuoto): «Oggi nessun bando AI aperto in Sicilia. Qui trovi l’archivio dei chiusi, che spesso tornano, e come segnalarne uno nuovo con il link ufficiale.»

**Proposta B**
- Title: «Bandi e finanziamenti per l’AI in Sicilia: elenco aggiornato»
- Description: «Bandi, voucher e incentivi per le imprese siciliane che vogliono usare l’AI: {n} aperti, scadenze in evidenza, importi e fonte ufficiale di ciascuno.»

**Proposta C**
- Title: «Finanziamenti per l’intelligenza artificiale in Sicilia»
- Description: «Quali bandi per l’intelligenza artificiale sono aperti in Sicilia oggi: {n} schede con ente, scadenza, importo massimo e link all’avviso ufficiale.»

### `/bandi/chiusi/`

**Proposta A** (consigliata)
- Title: «Archivio dei bandi AI in Sicilia: quelli chiusi»
- Description (con bandi): «{c} bandi per l’AI in Sicilia già chiusi, con condizioni e date. Molti tornano ogni anno: leggere l’edizione scorsa aiuta a preparare la prossima.»
- Description (vuoto): «L’archivio dei bandi AI in Sicilia è vuoto: nessun bando risulta ancora chiuso. Intanto guarda quelli aperti, con scadenze e link ufficiali.»

**Proposta B**
- Title: «Bandi AI in Sicilia già chiusi: archivio»
- Description: «L’archivio dei bandi sull’intelligenza artificiale in Sicilia: {c} schede con scadenza passata, utili per capire quando tornano e cosa preparare.»

**Proposta C**
- Title: «Bandi chiusi per l’AI in Sicilia: l’archivio»
- Description: «Bandi per l’AI in Sicilia che hanno già chiuso, dal più recente: ente, importi e condizioni dell’ultima edizione, per prepararti alla prossima.»

### Scheda `/bandi/[slug]/` (indicazione per il template)

- Title: «{titolo breve}: bando {ente breve}» (≤ 60, taglia il titolo se serve; con stato chiuso: «{titolo breve}: bando chiuso»)
- Description: «{ente}: {agevolazione}, {importo massimo se c’è}. Scadenza {data}. Chi può chiedere, procedura e link all’avviso ufficiale.» (accorciare se supera 155)

---

## 8. Dubbi e punti da confermare

1. **«Molti bandi tornano ogni anno»**: è la tesi dell’archivio, ma i dati non la provano. Ho usato «molti», «alcuni», «con regole simili ma mai uguali». Se l’orchestratore vuole un numero, serve un campo (es. `recurring`) che oggi non esiste.
2. **Frequenza di verifica**: non ho scritto «ricontrolliamo ogni mese» (vale per aziende ed eventi, non è dichiarato per i bandi). D5 e metodologia dicono solo che a ogni scheda c’è la data dell’ultimo controllo. Se esiste un ritmo fisso, aggiungerlo a D5.
3. **«Non incassiamo nulla da chi presenta domanda»** (metodologia): è un fatto sull’indipendenza di Elvio, che fa il consulente. Va confermato da lui, oppure tolto. Se ha rapporti con consulenti di bandi, serve una nota di trasparenza come quella delle schede azienda.
4. **Filtro per provincia**: il testo promette che scegliendo una provincia si vedono anche i bandi regionali, nazionali ed europei. Va implementato così, altrimenti cambiare l’hint.
5. **ListFilters** ha il messaggio «segnala ciò che manca» fisso: per i bandi preferirei «segnala il bando che manca» (serve un prop).
6. **Archivio e `closed_early`**: la dicitura «Chiuso in anticipo» presume che `closed_early` sia compilato solo quando la fonte lo dice. Così è nella spec del grants-researcher.
7. **Ora della scadenza**: nei testi dico «scade oggi alle {ora}». Se `deadline_time` manca, il componente deve omettere «alle {ora}», non scrivere mezzanotte.
8. **Etichette dei vocabolari**: i valori di `GRANT_BENEFICIARIES` e `GRANT_AID_TYPES` sono minuscoli e a volte con apostrofo («credito d’imposta» è scritto con apostrofo dritto nel file). Per le etichette usare solo la maiuscola iniziale; l’apostrofo dritto non è un problema per il validatore, ma nelle pagine è meglio quello curvo se si può.
9. **Territorio «nazionale»**: la guida sugli incentivi mostra che alcune misure nazionali hanno riserve per il Sud. Il valore «Nazionale, vale anche in Sicilia» non dice altro, e va bene finché non esiste un campo per le riserve.
