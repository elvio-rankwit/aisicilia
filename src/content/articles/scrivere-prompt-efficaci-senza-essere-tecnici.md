---
title: "Scrivere prompt efficaci senza essere tecnici: il metodo per chi ha un'attività"
seo_title: "Prompt efficaci per chi non è tecnico: metodo pratico"
slug: scrivere-prompt-efficaci-senza-essere-tecnici
description: "Chi sei, contesto, compito, vincoli, formato: il metodo in cinque pezzi per ottenere bozze utili da ChatGPT, Claude e Gemini, con esempi siciliani."
answer: "Un prompt efficace è una richiesta scritta come la faresti a un collaboratore appena arrivato: dici chi sei, quali fatti ha a disposizione, cosa deve produrre, cosa non deve fare e in che forma vuoi la risposta. Il primo risultato è una bozza: lo correggi con istruzioni precise invece di ricominciare da capo."
sectors:
  - tutti
level: base
reading_time: 10
order: 8
published_at: 2026-10-21
updated_at: 2026-10-22
author: elvio-leonardi
sources:
  - url: https://ai.google.dev/gemini-api/docs/prompting-strategies
    title: "Google, Prompt design strategies, Gemini API (aggiornata il 13 ottobre 2026), consultata il 22 ottobre 2026"
  - url: https://developers.openai.com/api/docs/guides/prompt-engineering
    title: "OpenAI, Prompt engineering, consultata il 22 ottobre 2026"
  - url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
    title: "Anthropic, Prompt engineering overview, consultata il 22 ottobre 2026"
  - url: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
    title: "Google Search Central, indicazioni sull'uso di contenuti generati con AI (aggiornata il 1 ottobre 2026), consultata il 22 ottobre 2026"
  - url: https://www.garanteprivacy.it/temi/intelligenza-artificiale
    title: "Garante per la protezione dei dati personali, sezione Intelligenza artificiale, consultata il 22 ottobre 2026"
needs_human_review: false
faq:
  - question: "Devo imparare comandi speciali per scrivere un buon prompt?"
    answer: "Per un uso da impresa bastano frasi normali, scritte con ordine. Una richiesta di sei righe precise funziona meglio di una riga vaga. I comandi, i parametri e le tecniche avanzate servono a chi costruisce applicazioni, non a chi deve rispondere a una recensione o preparare un preventivo."
  - question: "Scrivere \"sei un esperto di marketing\" migliora il risultato?"
    answer: "A volte sposta il registro, ma da solo non aggiunge nulla di ciò che sai della tua attività. Conta di più dire per chi scrivi, in che tono e con quali limiti. Una riga sul ruolo va bene per fissare lo stile, poi servono i fatti concreti: clienti, orari, condizioni."
  - question: "Posso riusare lo stesso prompt con ChatGPT, Claude e Gemini?"
    answer: "Di solito sì, perché i principi dei tre fornitori coincidono: istruzioni chiare, contesto, esempi, formato. Le risposte però non saranno identiche e le funzioni cambiano spesso. Prova il prompt sullo strumento che usi davvero e correggilo in base al risultato, poi salva la versione che funziona."
  - question: "Posso incollare nel prompt il testo di un cliente?"
    answer: "Solo se hai chiarito base giuridica, informativa e accordi con il fornitore dello strumento, perché nome, telefono e indirizzo sono dati personali. Per cominciare sostituiscili con segnaposto come {cliente} e {data_arrivo}. Se hai dubbi sul tuo caso, chiedi a chi segue la privacy della tua impresa."
  - question: "Quanto deve essere lungo un buon prompt?"
    answer: "Quanto serve a contenere i cinque pezzi: chi sei, contesto, compito, vincoli e formato. Per un'email di risposta bastano da cinque a dieci righe. Un prompt lungo e confuso rende meno di uno breve e preciso: se la richiesta è complessa, spezzala in due o tre passaggi."
  - question: "Quanti esempi servono dentro un prompt?"
    answer: "Ne bastano due o tre. Google consiglia esempi vari ma scritti con lo stesso formato e avverte che troppi possono far copiare lo schema troppo da vicino. Scegli testi che ti piacciono davvero e che somigliano a quello che vuoi ottenere, altrimenti lo strumento si confonde."
  - question: "Come evito che l'AI inventi prezzi, orari e promesse?"
    answer: "Scrivi tu prezzi, orari e condizioni nel prompt, vieta espressamente di aggiungere informazioni e chiedi di segnalare tra parentesi quadre ciò che manca. Il rischio scende molto ma non sparisce: controlla sempre ogni numero e ogni data prima di pubblicare o inviare il testo."
related_prompts: [risposta-recensione-negativa-ristorante, preventivo-pacchetto-sicilia-agenzia-viaggi, annuncio-immobile-vendita, procedura-operativa-apprendista-laboratorio]
---

<aside class="in-breve">

**In breve**

- Un prompt efficace ha cinque pezzi: chi sei, contesto, compito, vincoli, formato. Scrivili sempre nello stesso ordine.
- I fatti li metti tu: prezzi, orari, condizioni di cancellazione. Se mancano, lo strumento li inventa con tono sicuro.
- Mostrare uno o due testi che ti piacciono vale più di dieci spiegazioni. Google consiglia pochi esempi, vari ma con lo stesso formato.
- Il primo risultato è una bozza: correggi con istruzioni precise («dimezza», «togli il lei») e salva il prompt che funziona.
- Nei prompt non entrano dati personali dei clienti senza base giuridica, informativa e accordi con il fornitore: usa segnaposto.

</aside>

«Ci ho provato, ma mi risponde cose generiche». Quando in aula chiedo di vedere cosa è stato scritto, di solito è una riga: «scrivi una descrizione per la mia cantina». A un copywriter che non ti conosce otterresti la stessa pagina, buona per qualsiasi cantina del mondo.

Il metodo che uso io ha cinque pezzi e qualche limite da conoscere. Situazione a ottobre 2026. Se parti da zero, prima leggi [da dove cominciare con l'AI in una PMI siciliana](/impara/ai-pmi-siciliane-da-dove-cominciare/).

## Che cos'è un prompt, e perché le risposte sembrano generiche?

Prompt vuol dire la richiesta che scrivi allo strumento, e le risposte sono generiche quando la richiesta lo è. Pensa a una persona sveglia e veloce che oggi è al primo giorno nella tua attività: non conosce i clienti, non sa come parli, non sa che il martedì sei chiuso. Se le dici «rispondi a questa recensione» scrive una risposta educata e anonima.

I fornitori dicono cose molto simili nelle loro guide per sviluppatori. [Google](https://ai.google.dev/gemini-api/docs/prompting-strategies) (pagina aggiornata il 13 ottobre 2026) indica istruzioni chiare e specifiche, vincoli, formato della risposta, esempi e contesto, e consiglia di procedere per tentativi.

[OpenAI](https://developers.openai.com/api/docs/guides/prompt-engineering) descrive un buon messaggio come fatto di identità, istruzioni, esempi e contesto. [Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview) rimanda alla propria raccolta di buone pratiche e ricorda che non ogni problema si risolve cambiando il prompt.

Sono pagine tecniche, ma i principi valgono per chiunque.

## I cinque pezzi di un prompt efficace

Li uso sempre nello stesso ordine, e funzionano per un'email come per un menu.

| Pezzo | Risponde a | Esempio (agenzia viaggi di Siracusa) |
|---|---|---|
| Chi sei | Chi parla, a chi, con che tono | «Siamo un'agenzia di Siracusa che organizza soggiorni in Sicilia orientale per coppie straniere. Tono cordiale e preciso.» |
| Contesto | Quali fatti ha a disposizione | «Il cliente ha scritto: {testo_richiesta}. Pacchetto base: 4 notti a Ortigia, colazione, transfer dall'aeroporto di Catania.» |
| Compito | Cosa deve produrre | «Scrivi la risposta email che propone il pacchetto e chiede date e numero di persone.» |
| Vincoli | Cosa non deve fare | «Non promettere disponibilità, non inventare servizi, massimo 150 parole.» |
| Formato | Come vuoi il risultato | «Prima l'oggetto, poi il testo, in italiano e in inglese.» |

Il pezzo che tutti dimenticano è il vincolo, ed è quello che cambia di più il risultato. Il pezzo che ti costa più tempo è il contesto, perché ti obbliga a scrivere cose che per te sono ovvie. Orari, prezzi e politiche di cancellazione glieli scrivi ogni volta: lo strumento non li conosce e, se mancano, li inventa.

## Prima e dopo: un preventivo per un'agenzia di Siracusa

Immagina l'agenzia della tabella: arriva una richiesta di una coppia olandese e il titolare ha dieci minuti.

Prompt debole:

```
Scrivi un preventivo per un cliente che vuole andare in Sicilia.
```

Prompt scritto con il metodo:

```
Siamo un'agenzia di Siracusa che organizza soggiorni in Sicilia orientale, soprattutto per coppie straniere. Tono cordiale e preciso, diamo del lei.
Il cliente ha scritto: "{testo_richiesta}".
Il nostro pacchetto base: 4 notti a Ortigia, colazione inclusa, transfer dall'aeroporto di Catania. Il prezzo lo inserisco io: lascia {prezzo} dove serve.
Scrivi la risposta email che propone il pacchetto e chiede date e numero di persone. Non promettere disponibilità e non inventare servizi che non ti ho elencato. Massimo 150 parole. Dammi prima l'oggetto, poi il testo, in italiano e in inglese.
```

La seconda richiesta costa due minuti in più. Il testo che ottieni si usa con pochi ritocchi, quello della prima quasi mai.

Resta una bozza: la rileggi, controlli che il transfer sia davvero incluso (lo strumento lo sa perché glielo hai scritto tu) e invii con la tua firma. Per partire da un testo già impostato c'è il [prompt per il preventivo di un pacchetto in Sicilia](/prompt/turismo-agenzie/preventivo-pacchetto-sicilia-agenzia-viaggi/).

## Quando conviene mostrare un esempio?

Conviene ogni volta che hai già un testo riuscito e ne servono altri nello stesso stile. Si chiama few-shot, «pochi esempi», e la regola pratica è incollare uno o due modelli e scrivere «fai lo stesso con questi dati».

Prendiamo un'agenzia immobiliare di Acireale che deve pubblicare dieci annunci con lo stesso tono. Il titolare ha un annuncio che considera riuscito: breve, con metri quadri, piano, zona e niente «gioiello». Lo incolla così:

```
Questo è un annuncio che mi piace: "{annuncio_modello}".
Scrivi l'annuncio per l'immobile seguente con la stessa lunghezza, lo stesso ordine delle informazioni e lo stesso tono. Usa solo i dati che ti do, non aggiungere altro.
Dati: {dati_immobile}
```

Poi sostituisce i dati di un immobile alla volta. Nella libreria c'è anche il [prompt per l'annuncio di un immobile in vendita](/prompt/edilizia-immobiliare/annuncio-immobile-vendita/).

Google nella sua guida consiglia di includere esempi, vari ma con lo stesso formato, e di sperimentare sul numero perché troppi fanno copiare lo schema troppo da vicino. Io ne uso due o tre, mai di più. Se gli esempi non somigliano tra loro, lo strumento mescola gli stili.

## Come si chiede il formato e come si evitano le invenzioni?

Si dice cosa ti serve in mano e si vieta di inventare. Se il risultato deve finire in un foglio di calcolo, scrivi «rispondi con una tabella: nome del piatto, allergeni, prezzo». Se è un testo per il pubblico, aggiungi una riga: «se ti manca un'informazione, scrivi tra parentesi quadre cosa manca, non inventarla».

Funziona bene, anche se non sempre. Ti ritrovi con una bozza piena di buchi visibili, invece che con errori nascosti dentro frasi scorrevoli. I buchi si riempiono in un minuto, gli errori nascosti si scoprono quando il cliente protesta.

Un'altra riga che uso per le richieste complesse, come un piano per il personale stagionale: «prima di rispondere, fammi tre domande se qualcosa non ti è chiaro». Fa risparmiare un giro di correzioni.

Con compiti lunghi, spezzali: prima chiedi di analizzare, poi di proporre, poi di scrivere. È una tecnica che compare anche nella pagina di Google, sotto «break down complex tasks».

## Come si corregge un risultato senza ricominciare?

Si risponde allo strumento nella stessa conversazione, dicendo cosa non va e cosa vuoi. Il secondo risultato di solito è migliore del primo, perché ora sai cosa manca. «Non mi piace» dice poco allo strumento: servono istruzioni precise.

Immagina una trattoria di Trapani e una recensione a tre stelle: «cibo ottimo, ma abbiamo aspettato 50 minuti per i primi». Il primo testo esce lungo e pieno di scuse. Ecco come correggerlo.

| Cosa non va | Correzione efficace |
|---|---|
| Troppo lungo | «Massimo 70 parole.» |
| Troppe scuse | «Una sola scusa, nella prima frase.» |
| Promette uno sconto | «Togli lo sconto: non offriamo rimborsi.» |
| Tono freddo | «Dai del tu a chi ha scritto, come faresti al bancone.» |
| Manca un fatto | «Aggiungi che il sabato sera consigliamo di prenotare.» |

Ogni correzione precisa vale più di tre tentativi vaghi. Quando il testo è giusto, salva il prompt finale in un documento, con le parti variabili tra parentesi graffe. La volta dopo lo copi, cambi i dati e hai già gran parte del lavoro fatta: così nasce, senza accorgersene, una libreria di prompt per la tua attività.

Per le recensioni parti dal [prompt per rispondere a una recensione negativa di un ristorante](/prompt/ristorazione/risposta-recensione-negativa-ristorante/).

## Quali dati puoi incollare in un prompt?

Nessun dato personale di clienti, finché non hai chiarito base giuridica, informativa e accordi con il fornitore dello strumento. Nome, telefono, email, indirizzo e dettagli di una prenotazione sono dati personali. Attenzione in particolare ai fornitori con sede fuori dall'Unione europea.

Il Garante per la protezione dei dati personali raccoglie nella sua [sezione sull'intelligenza artificiale](https://www.garanteprivacy.it/temi/intelligenza-artificiale) provvedimenti, news e documenti, tra cui le indicazioni del Comitato europeo per la protezione dei dati sui rischi per la privacy dei modelli linguistici (aprile 2025). Non sono istruzioni operative per la tua impresa: per quelle serve chi segue la privacy da te, e la guida su [AI Act e GDPR](/impara/ai-act-gdpr-cosa-deve-sapere-impresa/) spiega il quadro.

La regola pratica, che costa dieci secondi: sostituisci i dati con segnaposto («{cliente}», «{data_arrivo}») e rimettili tu a mano dopo. Un testo senza nomi spesso funziona quanto uno con i nomi.

## Cosa non fa un buon prompt, e quanto costa davvero?

Un buon prompt non rende lo strumento più bravo di quello che è. Sul testo se la cava bene. Sui calcoli, sulle norme e sulle notizie recenti no, o non sempre: la stessa pagina di Google suggerisce di affidare i calcoli all'esecuzione di codice e i fatti recenti alla ricerca, non al solo modello.

Sulle cose molto locali (la denominazione di un'area vitivinicola, il regolamento del tuo comune, la sagra del paese vicino) i dati di partenza sono scarsi: ciò che serve lo scrivi tu.

C'è poi il tono sicuro. Google, nelle sue indicazioni sui contenuti generati con AI, ricorda che questi modelli non recuperano fatti ma prevedono una sequenza probabile di parole, quindi possono produrre errori (le «allucinazioni», risposte inventate ma plausibili). Per questo prezzi, orari, norme, nomi e date si controllano sempre: un prompt scritto bene riduce gli errori e non li elimina.

Quanto costa? In denaro poco: per cominciare provi con la versione dello strumento che hai già a disposizione (ChatGPT, Claude, Gemini e Copilot sono gli esempi più noti, situazione a ottobre 2026) e leggi sul sito del fornitore condizioni, limiti e prezzi, che cambiano spesso. In tempo di più di quanto si pensi: la mia stima è un paio d'ore per scrivere i primi tre o quattro prompt buoni, poi qualche minuto di controllo ogni volta che li usi.

Quando non conviene: un testo che scrivi una volta all'anno si scrive meglio a mano. Per uno che scrivi ogni settimana, il prompt conviene. Se in azienda ognuno scrive i prompt a modo suo, i testi escono con toni diversi: accordatevi su uno o due prompt condivisi e fate tenere l'elenco aggiornato a una persona sola.

Per allenarti scegli un compito vero alla volta. La [libreria dei prompt](/prompt/) ha schede per otto settori, con variabili da compilare, esempio d'uso e limiti. Nel calendario degli [eventi sull'AI in Sicilia](/eventi/) trovi incontri e seminari, e nella [directory delle aziende](/aziende/) chi in Sicilia lavora con questi strumenti.

Quando i prompt giusti li hai, il passo successivo è smettere di rifarli a mano: come si fa lo spiega la guida su come [automatizzare le attività ripetitive](/impara/automatizzare-attivita-ripetitive/). Se invece la domanda è come far trovare la tua attività quando un cliente chiede consiglio a un assistente, c'è la guida su come [farsi trovare da ChatGPT, Gemini e Perplexity](/impara/geo-farsi-trovare-chatgpt-gemini-perplexity/).

<aside class="in-pratica">

**In pratica**

- Scegli un testo che scrivi spesso, per esempio la risposta a una richiesta di preventivo.
- Scrivilo con i cinque pezzi: chi sei, contesto, compito, vincoli, formato.
- Incolla un modello che ti piace e chiedi lo stesso stile.
- Correggi il risultato con istruzioni precise, non con «non mi piace».
- Salva il prompt che ha funzionato, con le parti variabili tra parentesi graffe.
- Sostituisci nomi e telefoni dei clienti con segnaposto prima di incollare.

</aside>
