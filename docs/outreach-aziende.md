# Aziende in elenco: rivendicazione della scheda e badge (D-041)

## Come si gestisce una rivendicazione
1. La richiesta arriva via Formspree sul modulo delle modifiche, con il campo `tipo: Rivendicazione scheda`.
2. Controlla che l'email sia sul dominio del sito aziendale (`@rankwit.ai` per rankwit.ai, va bene anche un sottodominio). Se non lo è, rispondi chiedendo un indirizzo aziendale: niente Gmail o simili.
3. Rispondi **da info@aisicilia.it a quell'indirizzo** con il testo qui sotto. La loro risposta è la verifica.
4. Per ogni modifica serve una fonte pubblica: la pagina del loro sito va bene. La descrizione la riscriviamo noi, niente testi promozionali.
5. Aggiorna il JSON in `src/content/companies/<slug>.json`: i campi cambiati, la fonte in `source_urls`, `last_verified` e `claimed_at` con la data di oggi. Poi `npm run validate`, build e commit.
6. Nella risposta finale proponi il badge con il link `https://aisicilia.it/badge/?azienda=<slug>`.
7. Se hanno spuntato «Potete scrivermi per novità», annotalo. Altrimenti l'email si usa solo per questa richiesta e si cancella entro 12 mesi (privacy).

### Risposta di verifica
Oggetto: Conferma della scheda di [AZIENDA] su AI Sicilia

Buongiorno [NOME],

ho ricevuto la richiesta per la scheda di [AZIENDA] su AI Sicilia. Per confermare che arriva da voi, basta rispondere a questa email con un «confermo».

Le modifiche che mi avete indicato le controllo sulle fonti e le pubblico entro pochi giorni.

Elvio Leonardi
AI Sicilia · info@aisicilia.it

### Risposta finale
Oggetto: Scheda di [AZIENDA] aggiornata

Buongiorno [NOME],

la scheda è aggiornata: [LINK ALLA SCHEDA]. Ora riporta «Dati confermati dall'azienda» con la data di oggi.

Se vi va, potete mettere sul vostro sito il badge «Presente su AI Sicilia», che porta alla scheda. Il codice è già pronto qui: https://aisicilia.it/badge/?azienda=[SLUG]. È facoltativo e non cambia nulla nella directory.

Elvio Leonardi
AI Sicilia · info@aisicilia.it

## Messaggio alle aziende in elenco
Da mandare da info@aisicilia.it dopo il lancio, a un indirizzo generico dell'azienda (info@, contatti@) preso dal loro sito. Mai indirizzi personali presi altrove. Un invio per azienda; i centri di ricerca universitari si possono saltare.

Oggetto: [AZIENDA] è nella directory di AI Sicilia

Buongiorno,

sono Elvio Leonardi e curo AI Sicilia (aisicilia.it), un portale indipendente sull'intelligenza artificiale in Sicilia. Nella directory delle aziende c'è anche [AZIENDA]: [LINK ALLA SCHEDA].

La scheda l'ho scritta a partire da fonti pubbliche, che trovate elencate in fondo alla pagina. Se qualcosa è cambiato o manca, potete confermare o aggiornare i dati da qui, in due minuti: https://aisicilia.it/rivendica/?azienda=[SLUG]. È gratis e non cambia la posizione negli elenchi.

Se invece preferite non comparire, me lo scrivete e tolgo la scheda.

Grazie,
Elvio Leonardi
AI Sicilia · info@aisicilia.it

### Note
- Non chiedere il badge nel primo messaggio: lo si propone dopo la rivendicazione.
- Non promettere visite, posizionamenti o citazioni nelle AI.
- RankWit: niente messaggio, la scheda la conosci già. Se vuoi la data di conferma, segui la stessa procedura per coerenza.
