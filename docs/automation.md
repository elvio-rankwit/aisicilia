# Automazione

Tutto sta in `.github/workflows/`. Le Pull Request dei workflow dati le approva sempre una persona: nessun workflow fa merge.

| Workflow | Stato | Quando parte | Cosa fa |
| --- | --- | --- | --- |
| `ci.yml` | attivo | pull request, push su `main` | Valida i contenuti, build beta, valida il `dist/`, poi build production e Lighthouse CI mobile e desktop (soglia 100). Report Lighthouse come artifact. |
| `deploy.yml` | attivo (D-021) | push su `main`, a mano, `workflow_call` | Build con `PUBLIC_SITE_MODE=beta`, crea il progetto Pages `aisicilia` se manca, pubblica `dist/` su Cloudflare Pages (ramo di produzione `main`). |
| `rebuild.yml` | schedule spento | a mano; giornaliero se attivato | Richiama `deploy.yml`, così "prossimi eventi" e archivio si ricalcolano alla data di build (D-013). |
| `update-events.yml` | schedule spento | a mano; settimanale se attivato | Claude Code headless con `events-researcher`, validazione, PR `bot/eventi-AAAA-MM-GG`. |
| `update-directory.yml` | schedule spento | a mano; mensile se attivato | Come sopra con `directory-researcher`: ricontrolla i record, propone spostamenti in `data/_pending/` con motivo e nuovi ingressi. PR `bot/directory-AAAA-MM-GG`. |
| `linkcheck.yml` | schedule spento | a mano; settimanale se attivato | Build, link interni (validatore) ed esterni (`scripts/linkcheck/external.mjs`), una sola issue "Link rotti". |

## Deploy e rebuild

`deploy.yml` non dipende da `ci.yml`: un push su `main` pubblica anche se Lighthouse fallisce. La concurrency (`deploy-cloudflare-pages`, senza annullamento) mette i deploy in coda e non li sovrappone.

Il rebuild non usa un deploy hook di Cloudflare: `rebuild.yml` chiama `deploy.yml` come workflow riutilizzabile (`uses: ./.github/workflows/deploy.yml` con `secrets: inherit`). Motivi: un solo punto di deploy, nessun secret in più (`CF_PAGES_DEPLOY_HOOK` non serve), esito e log nella stessa esecuzione. L'alternativa `gh workflow run deploy.yml` richiederebbe `actions: write` e non aspetterebbe l'esito.

Il passo "Crea il progetto Pages se non esiste" esegue `wrangler pages project create aisicilia --production-branch main`. L'errore "già esistente" viene ignorato, qualsiasi altro errore ferma il deploy.

Con `workflow_dispatch` da un ramo diverso da `main` il deploy pubblica comunque in produzione (`--branch=main`): lanciarlo da `main`.

## Come attivare un workflow programmato

Aprire il file e togliere il commento al blocco `schedule` (due righe `schedule:` e `- cron:`). Orari predisposti, in UTC:

- `rebuild.yml`: `15 23 * * *`, ogni giorno poco dopo la mezzanotte italiana, estate e inverno.
- `update-events.yml`: `17 5 * * 1`, lunedì.
- `update-directory.yml`: `43 4 1 * *`, primo del mese.
- `linkcheck.yml`: `31 6 * * 3`, mercoledì.

I workflow programmati partono solo dal ramo predefinito. Per provarne uno prima di attivarlo: scheda Actions, scegliere il workflow, "Run workflow".

## Secrets e variabili

Settings > Secrets and variables > Actions.

| Nome | Tipo | Serve a | Note |
| --- | --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | secret | `deploy.yml` | Già configurato. Permesso Cloudflare Pages: Edit (e Account Settings: Read per `wrangler`). |
| `CLOUDFLARE_ACCOUNT_ID` | secret | `deploy.yml` | Già configurato. |
| `ANTHROPIC_API_KEY` | secret | `update-events`, `update-directory` | Solo da GitHub Secrets, mai nel repository. |
| `CLAUDE_MODEL` | variabile | workflow dati | Facoltativa. Default `sonnet` (alias del modello Sonnet più recente). |
| `MAX_TURNS` | variabile | workflow dati | Facoltativa. Default 40 turni per esecuzione. |
| `PUBLIC_FORM_SEGNALA_URL`, `PUBLIC_FORM_RIMOZIONE_URL`, `PUBLIC_FORM_CONTATTI_URL` | variabili | `deploy.yml` | Facoltative. Senza, i form restano disattivati con avviso (D-015). |

Impostazione da abilitare una volta: Settings > Actions > General > Workflow permissions > "Allow GitHub Actions to create and approve pull requests". Senza, `peter-evans/create-pull-request` non può aprire le PR (il workflow non le approva né le unisce).

`CF_PAGES_DEPLOY_HOOK` previsto in origine non serve più (vedi sopra).

## Workflow dati: come funzionano

1. Il job controlla `ANTHROPIC_API_KEY`, installa le dipendenze e calcola la data (Europe/Rome).
2. `anthropics/claude-code-action@v1` lancia Claude Code con `--agent <agente>`, `--model`, `--max-turns` e un elenco chiuso di tool (`--allowedTools`). Il prompt ripete i vincoli delle spec: zero dati inventati, niente dati personali, descrizioni riscritte, robots.txt, 1 richiesta al secondo per dominio, niente scraping vietato, niente git.
3. `npm run validate -- --content`: se fallisce il job si ferma, nessuna PR. I file prodotti restano per 7 giorni come artifact `eventi-AAAA-MM-GG` o `directory-AAAA-MM-GG`.
4. Se ci sono modifiche a `src/content/`, `data/` o `docs/sources.md`, `peter-evans/create-pull-request@v8` apre la PR con etichetta `dati` e corpo uguale al log in `docs/runs/`. Senza modifiche non apre nulla.
5. Gli eventi passati vanno in archivio da soli alla build (D-013): il workflow non sposta file di eventi.

L'action `claude-code-action@v1` non ha input dedicati a modello e turni: si passano in `claude_args` (`--model`, `--max-turns`). L'autenticazione usa `ANTHROPIC_API_KEY` e `github_token: ${{ github.token }}`, quindi non serve `id-token: write`.

## Come approvare una PR dati

1. Aprire la PR, leggere il log (corpo della PR) e la scheda "Files changed".
2. Controllare a campione le `source_urls`, le descrizioni (parole proprie, nessun hype), l'assenza di dati personali, i record spostati in `data/_pending/` con il motivo.
3. Controllare che `ci.yml` sia verde sulla PR. Il commit di un workflow con `GITHUB_TOKEN` non fa partire altri workflow: se la CI non parte sulla PR, chiudere e riaprire la PR, oppure usare un token personale in `token:` di `create-pull-request`.
4. Unire con "Squash and merge". Il push su `main` lancia `deploy.yml`.
5. Se qualcosa non va, commentare e chiudere la PR; il ramo `bot/...` si cancella da solo alla prossima esecuzione senza differenze.

## Budget e costi

- Tetto per esecuzione: `MAX_TURNS` (default 40) e `timeout-minutes` del job (45 eventi, 60 directory).
- Stima del costo: costo = (token in ingresso x prezzo ingresso + token in uscita x prezzo uscita) del modello scelto, vedi la pagina prezzi di Anthropic. Dopo la prima esecuzione leggere i token consumati nella Console Anthropic (Usage, filtrando per chiave API) e moltiplicare per le esecuzioni al mese. Ogni turno rilegge il contesto, quindi il consumo cresce più che linearmente con i turni: se il costo sale, abbassare `MAX_TURNS` prima di cambiare modello.
- Ordine di grandezza da verificare, non misurato: 4 esecuzioni al mese di eventi, 1 di directory, tutte con il tetto di 40 turni.
- `deploy.yml`, `ci.yml`, `linkcheck.yml` e `rebuild.yml` non usano l'API Anthropic. Costano solo minuti di GitHub Actions (gratuiti nei repository pubblici).

## Link check

`scripts/linkcheck/external.mjs` legge i link `http(s)` dei file HTML in `dist/` esclusi quelli del sito. Per ogni URL: HEAD, ripiego su GET, timeout 15 s, un nuovo tentativo per 5xx e timeout; al massimo 1 richiesta al secondo per dominio; User-Agent `aisicilia-linkcheck/1.0` con l'indirizzo della pagina contatti. Risposte 401, 403, 429 e 999 (siti che bloccano i bot) finiscono in una sezione a parte e non sono errori. Esce con codice 1 se ci sono link da correggere.

Prova in locale dopo `npm run build`: `node scripts/linkcheck/external.mjs --limit 20`. Il report va in `.cache/linkcheck/` (`report.md`, `report.json`). Opzioni: `--dist`, `--out`, `--timeout`, `--delay`, `--concurrency`, `--site-host`, `--internal-file`.

`linkcheck.yml` mette i link interni rotti (righe del validatore) e quelli esterni nella stessa issue "Link rotti": la crea, la aggiorna se è già aperta, la chiude con un commento quando non resta nulla.

## Lighthouse in CI

Segue D-007: la CI costruisce una seconda volta `dist/` con `PUBLIC_SITE_MODE=production`, perché in beta il `noindex` fa fallire per scelta l'audit "is-crawlable". Chrome arriva da `browser-actions/setup-chrome` e viene passato con `CHROME_PATH` a `lighthouserc.cjs`. Qualsiasi categoria sotto 100 fa fallire il job. I report sono nell'artifact `lighthouse`.

## Versioni delle action

`actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`, `actions/github-script@v9`, `browser-actions/setup-chrome@v2`, `peter-evans/create-pull-request@v8`, `cloudflare/wrangler-action@v4`, `anthropics/claude-code-action@v1`. Tutte a versione maggiore, nessun `@main`. Wrangler è fissato alla serie 4 (`wrangler@4` nel passo di creazione progetto; l'action usa Wrangler 4 di default).
