---
title: "GEO: come farsi trovare (e consigliare) da ChatGPT, Gemini e Perplexity"
seo_title: "GEO: come farsi consigliare da ChatGPT, Gemini e Perplexity"
slug: geo-farsi-trovare-chatgpt-gemini-perplexity
description: "Come ChatGPT, Gemini e Perplexity scelgono le fonti e cosa può fare una piccola impresa siciliana per comparire nelle risposte, senza promesse impossibili."
answer: "Nessuno può garantirti di essere citato da ChatGPT, Gemini o Perplexity. Puoi però aumentare le probabilità con pagine che rispondono a domande precise, dati identici ovunque, recensioni vere, schede aggiornate e crawler non bloccati. Quasi tutto passa dalle basi della SEO, applicate con più disciplina."
sectors:
  - tutti
level: intermedio
reading_time: 8
order: 7
published_at: 2026-10-21
updated_at: 2026-10-21
author: elvio-leonardi
sources:
  - url: https://developers.google.com/search/docs/appearance/ai-features
    title: "Google Search Central, AI features and your website (ultimo aggiornamento 10 dicembre 2025), consultata il 21 ottobre 2026"
  - url: https://developers.openai.com/api/docs/bots
    title: "OpenAI, documentazione sui crawler (OAI-SearchBot, GPTBot, ChatGPT-User), consultata il 21 ottobre 2026"
  - url: https://docs.perplexity.ai/guides/bots
    title: "Perplexity, documentazione sui crawler (PerplexityBot, Perplexity-User), consultata il 21 ottobre 2026"
  - url: https://support.google.com/business/answer/7091
    title: "Google Business Profile, come migliorare il posizionamento locale, consultata il 21 ottobre 2026"
  - url: https://developers.google.com/search/docs/appearance/structured-data/local-business
    title: "Google Search Central, dati strutturati LocalBusiness, consultata il 21 ottobre 2026"
needs_human_review: false
faq:
  - question: "Si può pagare per comparire nelle risposte di ChatGPT o Gemini?"
    answer: "Per le risposte generate non esiste un modo di comprare la citazione. Per il posizionamento locale su Google la guida ufficiale dice espressamente che non si può chiedere né pagare un posizionamento migliore. Diffida di chi ti vende una posizione garantita."
  - question: "Servono dati strutturati o un file speciale per l'AI?"
    answer: "Google dichiara che per apparire nelle AI Overviews e in AI Mode non servono requisiti aggiuntivi, né markup o file dedicati. I dati strutturati restano utili per dare ordine alle informazioni, purché coincidano con il testo visibile della pagina. Non garantiscono nulla."
  - question: "Devo bloccare i crawler delle AI nel robots.txt?"
    answer: "Dipende da cosa vuoi. Bloccare OAI-SearchBot o PerplexityBot ti toglie dalle risposte di ricerca di quei servizi. Bloccare GPTBot, invece, dice a OpenAI che non vuoi i tuoi contenuti nell'addestramento dei modelli. Sono scelte separate: decidile una per una."
  - question: "Quanto tempo ci vuole perché una modifica si veda?"
    answer: "Non c'è una risposta unica. OpenAI indica circa 24 ore perché i suoi sistemi recepiscano una modifica al robots.txt, mentre Google dice che una nuova scansione può richiedere da alcuni giorni a diversi mesi. Conta le settimane, non i giorni."
  - question: "Come faccio a sapere se compaio nelle risposte AI?"
    answer: "Fai tu le domande che farebbe un cliente e annota quali fonti compaiono, ripetendo la prova ogni mese. Su Google, le visite che arrivano dalle funzioni AI sono incluse nel rapporto Prestazioni di Search Console. Le risposte cambiano da persona a persona, quindi considera il risultato un indizio, non una misura esatta."
related_prompts: [descrizione-camere-sito-ospitalita, storia-laboratorio-artigiano-sito, descrizione-itinerario-tour-sicilia-agenzia, risposta-recensione-negativa-booking-ospitalita]
---

Una frase che sento in aula quasi ogni volta: «voglio comparire su ChatGPT». La risposta che do è meno entusiasmante di quella che molti sperano: non si compra, non si garantisce e non si fa in un pomeriggio. Si lavora, ed è lavoro in gran parte già noto a chi si occupa di SEO.

Questo articolo spiega come questi motori scelgono le fonti, cosa può fare davvero una piccola impresa siciliana (una cantina dell'Etna, un B&B a Ortigia, uno studio a Ragusa) e dove finisce ciò che si può promettere.

## Prima prova: chiediti come ti vede un cliente

Apri ChatGPT, Gemini e Perplexity (strumenti citati come esempi, aggiornato a ottobre 2026) e scrivi le domande che farebbe un cliente vero. Non «B&B Ortigia», ma «un posto tranquillo dove dormire a Ortigia a settembre, con colazione senza glutine». Leggi la risposta, apri le fonti, annota chi compare e chi no.

Spesso scopri due cose. Che i nomi consigliati non sono quelli che pensavi. E che le fonti citate sono pagine che puoi influenzare, almeno in parte: il tuo sito, la tua scheda su Google, un portale, un articolo di un blog locale. Da lì parte il lavoro.

## Come questi motori scelgono le fonti

Semplifico, perché i dettagli cambiano e i fornitori non li pubblicano tutti. Ci sono due strade.

La prima è la memoria del modello: ciò che ha imparato durante l'addestramento. Su questa, come piccola impresa, non hai leva diretta. Se il modello «sa» che esisti ma sbaglia l'indirizzo, non puoi correggerlo scrivendogli: devi sistemare le fonti pubbliche da cui impara.

La seconda è la ricerca in tempo reale. Lo strumento riformula la domanda, cerca pagine, le legge e compone una risposta citando alcune fonti. Su questa strada puoi fare molto, perché dipende da pagine che esistono oggi.

Le singole piattaforme dichiarano questo:

- **Google.** Nella guida [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), aggiornata il 10 dicembre 2025, Google scrive che per apparire nelle AI Overviews e in AI Mode non ci sono requisiti aggiuntivi né ottimizzazioni speciali. Una pagina deve essere indicizzata e idonea a mostrare uno snippet. Le funzioni usano la tecnica del «query fan-out»: eseguono più ricerche correlate su sottotemi diversi, quindi il tuo contenuto può essere pescato per una domanda secondaria che nemmeno avevi previsto.
- **ChatGPT.** Secondo la [documentazione di OpenAI](https://developers.openai.com/api/docs/bots), OAI-SearchBot serve a far comparire i siti nei risultati di ricerca di ChatGPT; GPTBot raccoglie contenuti che possono servire all'addestramento; ChatGPT-User entra in gioco quando una persona chiede di visitare una pagina, e non decide se compari nella ricerca.
- **Perplexity.** La [documentazione](https://docs.perplexity.ai/guides/bots) dice che PerplexityBot serve a far emergere e collegare i siti nei risultati, mentre Perplexity-User visita le pagine su richiesta dell'utente e di norma ignora il robots.txt, perché l'azione parte da una persona.

Nessuna delle tre promette una citazione. Permettono di essere trovati, che è un'altra cosa.

## Cosa può fare una piccola impresa siciliana

### Dati identici ovunque

Prendiamo una cantina sull'Etna che si presenta come «Cantina Rossi», «Rossi Società Agricola» e «Azienda Rossi Vini» a seconda del sito. Per una persona sono la stessa cosa. Per un sistema che incrocia fonti, no, o non sempre. Scegli una forma del nome, un indirizzo scritto sempre uguale, un telefono, gli orari, la categoria. Poi allinea tutto: sito, scheda Google, pagine social, directory di settore, portali turistici, camera di commercio.

Una scheda completa e aggiornata conta. Nella [guida di Google Business Profile](https://support.google.com/business/answer/7091) il posizionamento locale dipende da pertinenza, distanza e notorietà, e le attività con dati completi e accurati hanno più probabilità di comparire. Google precisa che non esiste un modo di chiedere o pagare un posizionamento migliore.

### Pagine che rispondono

Gli utenti non scrivono «ristorante»: chiedono se c'è un menu senza glutine, se si può parcheggiare vicino, quanto costa la degustazione, se i cani sono ammessi. Se la risposta non è scritta da nessuna parte, nessun motore può citarla.

Il metodo è semplice. Una pagina per ogni domanda reale. Risposta nelle prime due righe, dettagli sotto. Prezzi, orari e condizioni nel testo, con la data dell'ultimo aggiornamento. Non nascondere informazioni in PDF scansionati o in immagini: Google indica tra le buone pratiche il testo accessibile. È lo stesso schema che usiamo qui sul portale, con il paragrafo di risposta diretta in apertura di ogni articolo.

Se non sai come scrivere queste pagine, i [prompt della libreria](/prompt/) servono a ricavare bozze di FAQ e schede da rivedere a mano, e [scrivere prompt efficaci senza essere tecnici](/impara/scrivere-prompt-efficaci-senza-essere-tecnici/) spiega come ottenere meno testo generico. Il testo, però, deve contenere informazioni tue: se la bozza è piena di frasi vere ovunque, per il motore e per il cliente vale zero.

### Recensioni vere

Google include nella notorietà il numero di recensioni e le valutazioni positive. Rispondere alle recensioni mostra attenzione e aiuta a distinguerti, dice la stessa guida. Non comprarle e non pilotarle: oltre al rischio con le piattaforme, un motore che incrocia fonti diverse trova prima o poi le incoerenze. Per le risposte, hai già i [prompt per gestire le recensioni](/prompt/ospitalita/) del settore ospitalità.

Nota di prudenza sui dati: se incolli recensioni in uno strumento AI per rispondere, ci sono nomi di persone. Non inserire dati dei clienti senza una base giuridica e senza accordi adeguati con il fornitore.

### Dati strutturati, senza illusioni

I dati strutturati sono un modo di scrivere le stesse informazioni in un formato che le macchine leggono senza ambiguità. Per un'attività locale Google chiede almeno nome e indirizzo, e consiglia coordinate, orari, telefono, URL e fascia di prezzo, come descrive la [pagina sul markup LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).

Due avvertenze. Google dice di non garantire che le funzioni basate sui dati strutturati compaiano, e per le funzioni AI dichiara che non serve nessun markup speciale. Inoltre i dati devono corrispondere a ciò che l'utente vede nella pagina. Servono, quindi, per ordine e coerenza. Non sono un trucco.

### Lasciare entrare i crawler

È la verifica più rapida e più sottovalutata. Controlla il file robots.txt del sito e le protezioni attive: alcuni servizi di sicurezza e alcuni plugin bloccano i crawler per default. Se OAI-SearchBot, PerplexityBot o Googlebot non possono leggerti, per quei servizi non esisti. Le impostazioni di ogni bot sono indipendenti: puoi consentire la ricerca e rifiutare l'addestramento, o viceversa. OpenAI indica circa 24 ore perché una modifica al robots.txt venga recepita.

Se il sito lo gestisce un'agenzia, chiedi per iscritto cosa è consentito e cosa no.

### Essere citati anche da altri

Quando provi le domande, guarda se le fonti sono siti terzi: portali di settore, directory, giornali locali, associazioni. Se è così, esserci lì pesa quanto sistemare il tuo sito. Una scheda corretta in una directory di settore, per esempio, o l'iscrizione all'associazione di categoria quando ha un elenco soci online. Se la tua azienda lavora con l'AI, c'è anche l'[elenco delle aziende AI siciliane](/aziende/) o la pagina della [tua provincia](/aziende/provincia/catania/), per esempio quella di Catania.

## Come misurare, con onestà

Le risposte dei motori variano da persona a persona e da un giorno all'altro. Quindi non aspettarti un numero preciso.

Un metodo ragionevole è una lista di dieci domande reali, ripetute ogni mese sugli stessi strumenti, con una tabella in cui annoti se compari, in che modo e con quali fonti. Per Google, le visite che arrivano dalle funzioni AI sono comprese nel rapporto Prestazioni di Search Console, nel tipo di ricerca «Web». Esistono anche servizi a pagamento di monitoraggio: possono far risparmiare tempo se hai molte pagine, ma non sostituiscono la prova manuale e vanno valutati sul costo.

## Cosa non si può garantire

Il quadro, in poche righe:

- non si può garantire la citazione: nessun fornitore la promette, e chi la vende ti racconta una storia;
- non si controlla cosa dice il modello su di te: si corregge la fonte, poi si aspetta. Google parla di giorni o mesi per una nuova scansione;
- non esiste una scorciatoia tecnica: né un file, né un tag, né un markup speciale per «sbloccare» le funzioni AI di Google;
- i risultati dipendono dal concorrente: se il ristorante accanto ha pagine più chiare delle tue, ti supera, a prescindere da quanto hai lavorato.

Il costo vero è la manutenzione. Orari che cambiano, menu stagionali, nuove regole di cancellazione: ogni modifica va riportata ovunque. Se non hai nessuno che lo faccia, parti dalla scheda Google e dal sito, e tralascia il resto. Se il tuo settore è l'ospitalità, trovi esempi concreti in [AI per hotel, B&B e strutture ricettive](/impara/ai-hotel-bb-strutture-ricettive/); per chi produce vino e cibo, c'è [AI per cantine e aziende agroalimentari](/impara/ai-cantine-aziende-agroalimentari/).

Un ultimo punto, perché è facile dimenticarlo. Se usi l'AI per produrre i contenuti con cui vuoi farti citare, ricordati che le regole sulla trasparenza dei testi e delle immagini sintetiche cambiano: ne parlo in [AI Act e GDPR: cosa deve sapere un'impresa](/impara/ai-act-gdpr-cosa-deve-sapere-impresa/).

<aside class="in-pratica">

**In pratica**

- Scrivi cinque domande che farebbe un cliente e provale su ChatGPT, Gemini e Perplexity: annota le fonti citate.
- Riscrivi nome, indirizzo, telefono e orari in una forma sola e correggi sito, scheda Google e directory.
- Pubblica una pagina per ogni domanda ricorrente, con la risposta nelle prime due righe.
- Controlla robots.txt e protezioni del sito: OAI-SearchBot, PerplexityBot e Googlebot devono poter leggere.
- Rispondi alle recensioni delle ultime settimane, senza incollare dati dei clienti negli strumenti AI.
- Ripeti la prova ogni mese e tieni la tabella.

</aside>
