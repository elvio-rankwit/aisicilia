# Messa online su aisicilia.it: passi

Tempo stimato: 30–45 minuti di lavoro, più l'attesa della propagazione DNS (di solito meno di un'ora, al massimo 24–48 ore). Il codice è già pronto: canonical, sitemap, `robots.txt` e header passano a production con una sola variabile.

## 1. Dominio su Cloudflare
1. Cloudflare → **Add a domain** → `aisicilia.it`, piano **Free**. Cloudflare importa i record DNS esistenti: controlla che ci siano e lascia quelli che servono (per esempio la posta, se Register.it ne gestisce una).
2. Cloudflare ti mostra **2 nameserver** (del tipo `xxx.ns.cloudflare.com`).
3. Su **Register.it** → Domini → aisicilia.it → **Gestione DNS / Nameserver** → sostituisci i nameserver con i due di Cloudflare e salva.
4. Aspetta che Cloudflare segni il dominio come **Active** (ti arriva anche un'email).

## 2. Collegare il sito
1. Cloudflare → **Workers & Pages** → progetto `aisicilia` → **Custom domains** → aggiungi `aisicilia.it`, poi aggiungi anche `www.aisicilia.it`.
2. **Rules → Redirect Rules → Create rule** "www → apex": se l'hostname è `www.aisicilia.it`, redirect dinamico `concat("https://aisicilia.it", http.request.uri.path)`, 301, conservando la query string.
3. **SSL/TLS** → modalità **Full (strict)**; Edge Certificates → **Always Use HTTPS** attivo.

## 3. Email info@aisicilia.it (gratis)
1. Cloudflare → `aisicilia.it` → **Email → Email Routing** → Enable. Cloudflare aggiunge da solo i record MX e SPF.
2. **Routing rules** → Custom address `info` → Action *Send to an email* → la tua casella (Gmail o altra). Conferma il link che ti arriva.
3. Prova: scrivi a info@aisicilia.it e controlla che arrivi. Per rispondere *da* info@ con Gmail: Impostazioni → Account → "Invia messaggio come", con un SMTP. Facoltativo.
4. Su **Formspree**, se vuoi, cambia l'email di notifica dei 3 form in info@aisicilia.it.

## 4. Crawler dei motori AI (importante per il GEO)
Il sito in production consente esplicitamente GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended e simili. Cloudflare però ha impostazioni proprie che possono bloccarli o aggiungere segnali al `robots.txt`: online oggi il `robots.txt` inizia già con i "content signals" di Cloudflare.
- Cloudflare → `aisicilia.it` → **Security → Bots** (o **AI Crawl Control**): **disattiva "Block AI bots"**, se attivo.
- **Manage robots.txt / Content signals**: se vuoi farti citare dalle AI, non impostare `ai-input=no`. `search=yes, ai-input=yes`; su `ai-train` decidi tu. Oppure disattiva la gestione di Cloudflare: il nostro `robots.txt` è già completo.

## 5. Uscita dalla beta
1. GitHub → `elvio-rankwit/aisicilia` → **Settings → Secrets and variables → Actions → Variables → New repository variable**: `PUBLIC_SITE_MODE` = `production`.
2. GitHub → **Actions → Deploy → Run workflow** (oppure basta un push). In automatico:
   - sparisce il `noindex`, sia dal meta sia dall'header;
   - `robots.txt` diventa "Allow" con la sitemap;
   - si generano le sitemap;
   - scompare la scritta "Versione beta" dal footer.
3. Controlla `https://aisicilia.it/robots.txt` e `https://aisicilia.it/sitemap-index.xml`, e che la sorgente della home non contenga `noindex`.

## 6. Motori di ricerca
1. **Google Search Console** → Aggiungi proprietà → **Dominio** `aisicilia.it`. La verifica con record TXT si fa in Cloudflare DNS, in un minuto. Poi Sitemap → invia `https://aisicilia.it/sitemap-index.xml`.
2. **Bing Webmaster Tools** → "Importa da Google Search Console". Conta anche per ChatGPT e Copilot. Invia la stessa sitemap.
3. Facoltativo: **Cloudflare Web Analytics** (Analytics & Logs → Web Analytics → aggiungi il sito). È senza cookie e non serve un banner. Se lo attivi, dimmelo e aggiungo una riga nella privacy.

## 7. Dopo il lancio (routine)
- Ogni notte il sito si ricostruisce da solo: gli eventi passati vanno in archivio.
- Ogni mercoledì gira il controllo dei link: se ce ne sono di rotti, apre una issue.
- Ogni 2–3 settimane si fa il giro eventi, ogni mese la revisione della directory, con i messaggi pronti in `docs/automation.md`.
