---
title: "Scrivere prompt efficaci senza essere tecnici: il metodo per chi ha un'attività"
seo_title: "Prompt efficaci per chi non è tecnico: metodo pratico"
slug: scrivere-prompt-efficaci-senza-essere-tecnici
description: "Chi sei, a chi scrivi, cosa vuoi, cosa evitare, in che forma: il metodo in cinque pezzi per ottenere bozze utili da ChatGPT, Claude e Gemini."
answer: "Un prompt efficace è una richiesta scritta come la faresti a un collaboratore nuovo: dici chi sei, a chi ti rivolgi, cosa vuoi ottenere, cosa evitare e in che forma vuoi la risposta. Se il primo risultato non va bene, non ricominci da capo: correggi la richiesta e riprovi."
sectors:
  - tutti
level: base
reading_time: 8
order: 8
published_at: 2026-10-21
updated_at: 2026-10-21
author: elvio-leonardi
sources:
  - url: https://ai.google.dev/gemini-api/docs/prompting-strategies
    title: "Google, Prompt design strategies (Gemini API)"
  - url: https://developers.openai.com/api/docs/guides/prompt-engineering
    title: "OpenAI, Prompt engineering"
  - url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
    title: "Anthropic, Prompt engineering overview"
  - url: https://www.garanteprivacy.it/temi/intelligenza-artificiale
    title: "Garante per la protezione dei dati personali, sezione Intelligenza artificiale"
needs_human_review: false
faq:
  - question: "Devo imparare i comandi speciali per scrivere un buon prompt?"
    answer: "No. Per un uso da impresa bastano frasi normali, scritte con ordine. Funziona meglio una richiesta lunga tre righe e precisa di una breve e vaga. I comandi e i trucchi servono a chi costruisce applicazioni, non a chi scrive una risposta a una recensione."
  - question: "Scrivere \"sei un esperto di marketing\" migliora il risultato?"
    answer: "A volte cambia il registro, ma da solo non basta e non sostituisce le informazioni. Conta di più dire per chi scrivi, in che tono e con quali limiti. Una riga sul ruolo va bene se serve a fissare lo stile, poi dai all'assistente i fatti concreti della tua attività."
  - question: "Posso riusare lo stesso prompt con ChatGPT, Claude e Gemini?"
    answer: "Di solito sì, perché i principi sono gli stessi: istruzioni chiare, contesto, esempi, formato. Le risposte però non saranno identiche, e le funzioni di ogni strumento cambiano spesso. Prova il prompt sullo strumento che usi davvero e correggilo in base al risultato."
  - question: "Posso incollare nel prompt il testo di un cliente?"
    answer: "Non se contiene dati personali, a meno che tu non abbia una base giuridica, un'informativa corretta e accordi adeguati con il fornitore dello strumento. Per cominciare sostituisci nomi, telefoni e indirizzi con segnaposto. Se hai dubbi sul tuo caso, chiedi a chi segue la privacy della tua impresa."
related_prompts: []
---

In aula c'è sempre qualcuno che alza la mano e dice: "Io ci ho provato, ma mi risponde cose generiche". Gli chiedo di mostrarmi cosa ha scritto. Quasi sempre è una riga: "scrivi una descrizione per la mia cantina". Se la scrivi a un copywriter che non ti conosce, ottieni la stessa cosa: una pagina che potrebbe andare bene per qualsiasi cantina del mondo.

Il problema non è l'assistente, e non è nemmeno la tua capacità tecnica. È che ti manca un metodo per dare le informazioni giuste, nell'ordine giusto. Si impara in una sera. In questo articolo trovi il metodo in cinque pezzi, due esempi siciliani, e gli errori che vedo più spesso. Se parti da zero, prima leggi [da dove cominciare con l'AI in una PMI siciliana](/impara/ai-pmi-siciliane-da-dove-cominciare/).

## Il prompt è una richiesta a un collaboratore appena arrivato

Prompt significa semplicemente "la richiesta che scrivi allo strumento". Niente di più. Pensa a una persona intelligente, veloce, che oggi è al primo giorno nella tua attività: non conosce i tuoi clienti, non sa come parli, non sa cosa ti ha fatto arrabbiare l'anno scorso. Se le dici "rispondi a questa recensione", scriverà una risposta educata e anonima. Se le dici chi sei e cosa vuoi, scrive molto meglio.

Le guide pubblicate dai fornitori stessi dicono cose molto simili. Google, nella sua pagina sulle strategie di prompt, indica istruzioni chiare, esempi, contesto, formato della risposta e il fatto che si procede per tentativi ([Google, Prompt design strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)). OpenAI descrive un buon prompt come fatto di identità, istruzioni, esempi e contesto ([OpenAI, Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)), e Anthropic rimanda alla propria guida alle buone pratiche ([Anthropic, Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)). Sono pagine scritte per sviluppatori, ma i principi si traducono bene nel lavoro di tutti i giorni (consultate il 21 ottobre 2026).

## I cinque pezzi

Io li chiamo così, e li uso sempre nello stesso ordine.

Prima di tutto, chi sei. Una o due frasi sulla tua attività: tipo, luogo, clientela, tono. "Gestisco un B&B con quattro camere a Ortigia, clientela per lo più straniera, tono caldo ma sobrio."

Poi il contesto: il materiale su cui deve lavorare. Il testo della recensione, i dati della scheda del vino, l'elenco dei servizi inclusi. Se l'assistente non ha il fatto, lo inventa. Orari, prezzi e politiche di cancellazione glieli scrivi tu, ogni volta.

Poi il compito, detto in modo specifico. "Scrivi una risposta" è debole. "Scrivi una risposta di massimo 90 parole, che riconosca il problema del rumore, non prometta rimborsi e inviti a scrivermi in privato" è un compito.

Poi i vincoli, cioè cosa non deve fare. Niente aggettivi come "magico" o "unico", niente scuse eccessive, niente promesse che non puoi mantenere. I vincoli sono la parte che tutti dimenticano e che più cambia il risultato.

Infine il formato: un testo unico, un elenco, una tabella, tre versioni da confrontare, in italiano e in inglese. Se non lo dici, decide lui.

### Prima e dopo, su un caso concreto

Prendiamo il B&B di Ortigia (esempio inventato, ma la situazione è comune). Una coppia ha lasciato tre stelle: la camera era bella ma di notte si sentiva il locale in piazza.

Prompt debole:

> Rispondi a questa recensione: "Camera bella, ma troppo rumore di notte."

Prompt scritto con il metodo:

> Gestisco un B&B con quattro camere a Ortigia. Clientela internazionale, tono caldo e sobrio, do del lei. Scrivi la risposta pubblica a questa recensione da tre stelle: "{testo_recensione}". Riconosci il problema del rumore senza difenderti e senza scuse eccessive. Non promettere sconti o rimborsi. Menziona che le camere sul cortile sono più silenziose e che le consigliamo a chi ha il sonno leggero. Massimo 90 parole, in italiano. Dammi due versioni, una più breve e una più calda.

La seconda richiesta costa due minuti in più. La risposta che ottieni è utilizzabile con ritocchi, e la prima quasi mai. Resta una bozza: la rileggi, controlli che il fatto sul cortile sia vero (l'assistente non lo sa, glielo hai detto tu), e la pubblichi con la tua firma. Se lo rifai ogni settimana, nella [prompt library per l'ospitalità](/prompt/ospitalita/) trovi testi pronti, tra cui quelli per rispondere alle recensioni negative.

## Mostra un esempio: vale più di dieci spiegazioni

I tecnici lo chiamano few-shot, "pochi esempi". In pratica: incolli uno o due testi che ti piacciono e dici "scrivi nello stesso stile".

Immagina una cantina sull'Etna che deve scrivere venti schede vino con lo stesso tono. Il titolare ne ha una che considera riuscita, breve, concreta, senza metafore da sommelier. La incolla nel prompt e scrive: "Questa è una scheda che mi piace. Scrivi la scheda del vino seguente con la stessa lunghezza, lo stesso ordine delle informazioni e lo stesso tono. Usa solo i dati che ti do, non aggiungere altro." Fatto questo, passa i dati di ogni vino uno alla volta.

Due avvertenze. Gli esempi devono somigliarsi nel formato, altrimenti l'assistente si confonde. E troppi esempi uguali producono risposte clonate: due o tre bastano. Anche Google lo segnala nella pagina citata sopra.

## Chiedi il formato, e chiedi di segnalare i dubbi

Quando il risultato deve finire in un foglio di calcolo, in un'email o in un gestionale, dillo: "Rispondi con una tabella: nome del piatto, allergeni, prezzo". Quando il risultato è un testo per il pubblico, chiedi una cosa in più: "Se ti manca un'informazione, scrivi tra parentesi quadre cosa manca, non inventarla". Funziona sorprendentemente bene, anche se non al cento per cento. Ti ritrovi con una bozza piena di buchi evidenti invece che piena di errori nascosti.

## Correggi la richiesta, non ricominciare

Il primo risultato è un tentativo. Il secondo prompt di solito è migliore del primo, perché ora sai cosa non va. Non scrivere "non mi piace". Scrivi "troppo lungo, dimezza", "troppo formale, togli il lei", "il secondo paragrafo promette un rimborso, toglilo". Ogni correzione precisa vale più di tre tentativi vaghi.

Quando una correzione funziona, salvala. Scrivi su un documento il prompt finale, quello che ha dato il risultato giusto: la volta dopo lo copi, cambi le parti in parentesi graffe e hai già il novanta per cento del lavoro. È così che si costruisce, senza accorgersene, una libreria di prompt per la propria attività.

Un trucco che uso spesso: a fine richiesta aggiungo "prima di rispondere, fammi tre domande se qualcosa non ti è chiaro". Sulle richieste complesse (un preventivo, un piano per il personale stagionale) fa risparmiare un giro di correzioni.

<aside class="in-pratica">

**In pratica**

- Scegli un testo che scrivi spesso, per esempio la risposta a una richiesta di preventivo.
- Scrivi il prompt con i cinque pezzi: chi sei, contesto, compito, vincoli, formato.
- Incolla un esempio di testo che ti piace e chiedi lo stesso stile.
- Correggi il risultato con istruzioni precise, non con "non mi piace".
- Salva il prompt che ha funzionato in un documento, con le parti variabili tra parentesi graffe.

</aside>

## Gli errori che vedo più spesso

Il più comune è chiedere troppo in una volta sola. "Fammi il piano marketing dell'anno" produce un elenco generico, perché la richiesta è generica. Spezza il lavoro: prima chiedi di analizzare la clientela, poi le idee, poi il calendario di due mesi.

Il secondo è credere che la formula magica esista. Scrivere "sei un esperto mondiale di marketing" può spostare lo stile della risposta, ma non aggiunge conoscenze sulla tua attività. Se l'assistente non sa che il tuo ristorante chiude il martedì, non lo saprà nemmeno con il titolo di esperto mondiale.

Il terzo è fidarsi del tono sicuro. Un assistente scrive con la stessa sicurezza quando ha ragione e quando sbaglia. Si chiama "allucinazione" (una risposta inventata ma plausibile). Per questo i fatti li controlli sempre: prezzi, orari, norme, nomi, date. Un prompt scritto bene riduce gli errori, non li elimina.

Il quarto riguarda i dati. Non incollare nel prompt nomi, telefoni, email o altri dati dei clienti senza aver chiarito base giuridica, informativa e accordi con il fornitore dello strumento, con particolare attenzione a quelli con sede fuori dall'Unione europea. Il Garante raccoglie indicazioni sul tema nella sua [sezione dedicata all'intelligenza artificiale](https://www.garanteprivacy.it/temi/intelligenza-artificiale). Per cominciare, sostituisci i nomi con segnaposto: "{cliente}", "{data_arrivo}". È una buona abitudine che costa dieci secondi.

## Cosa non aspettarti, e quanto costa

Un buon prompt non rende l'assistente più bravo di quello che è. Sul testo se la cava bene. Sui calcoli, sulle norme e sulle notizie recenti no, o non sempre. Sulle cose molto locali (la denominazione di un'area vitivinicola, il regolamento del tuo comune, la sagra del paese vicino) ha dati di partenza scarsi: tutto ciò che serve devi scriverlo tu.

Quanto costa? Soldi, poco: per cominciare basta la versione gratuita di uno strumento tra ChatGPT, Claude, Gemini e Copilot (elenco aggiornato a ottobre 2026; funzioni, limiti e prezzi cambiano spesso, quindi leggi le condizioni sul sito del fornitore). Tempo, di più di quanto si pensi: calcola un paio d'ore per scrivere i primi tre o quattro prompt buoni, e qualche minuto di controllo ogni volta che li usi. Per un testo che scrivi una volta all'anno non conviene. Per uno che scrivi ogni settimana sì.

C'è poi un limite che si nota solo dopo qualche settimana: se tutti in azienda scrivono i prompt a modo proprio, i testi escono con toni diversi. Conviene che chi li usa si accordi su uno o due prompt condivisi, e che qualcuno li tenga aggiornati.

## Dove allenarsi

La palestra migliore è il lavoro vero, con un compito per volta. Se vuoi partire da testi già impostati, la [libreria dei prompt](/prompt/) ha schede per otto settori, ognuna con variabili da compilare, esempio d'uso e limiti. Se preferisci imparare in compagnia, nel calendario degli [eventi sull'AI in Sicilia](/eventi/) trovi incontri e seminari, e nella [directory delle aziende](/aziende/) chi in Sicilia lavora con questi strumenti.

Quando i prompt giusti li hai, il passo successivo è smettere di rifarli a mano: l'articolo su come [automatizzare le attività ripetitive](/impara/automatizzare-attivita-ripetitive/) spiega come. E se la tua domanda è come far trovare la tua attività quando un cliente chiede consiglio a un assistente, c'è quello su come [farsi trovare da ChatGPT, Gemini e Perplexity](/impara/geo-farsi-trovare-chatgpt-gemini-perplexity/).
