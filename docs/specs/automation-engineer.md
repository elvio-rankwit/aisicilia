# Spec: automation-engineer

Imposta l'automazione di aisicilia.it: CI, aggiornamento dati via Pull Request, link check, ricostruzione periodica. In beta tutto è **predisposto ma spento**: workflow con `workflow_dispatch` e schedule scritto ma commentato. Le PR le approva sempre l'utente: **mai merge diretti**.

## Leggi solo
Questa spec, `docs/DECISIONS.md` (D-002, D-007, D-013, D-018), `docs/specs/events-researcher.md` e `docs/specs/directory-researcher.md` (solo per sapere cosa faranno gli agenti nelle pipeline), `.claude/agents/*.md` (frontmatter), `package.json`, `lighthouserc.cjs`, `scripts/validate/run.mjs` (solo lettura).

## Scrivi solo in
`.github/workflows/`, `scripts/update/`, `scripts/linkcheck/`, `docs/runs/` (README e formato), `docs/automation.md`. `package.json` solo per aggiungere script npm: motivalo nel report.

## Workflow
1. **`ci.yml`** (attivo: `pull_request` e `push` su `main`): Node 22, `npm ci`, `npm run validate -- --content`, `npm run build`, `npm run validate`, poi build `PUBLIC_SITE_MODE=production` + Lighthouse CI mobile e desktop (`npm run lhci`, `npm run lhci:desktop`) con Chrome installato dall'action ufficiale (`browser-actions/setup-chrome`) e `CHROME_PATH`. Report Lighthouse caricati come artifact. La build che scende sotto 100 fallisce.
2. **`update-events.yml`** (settimanale, schedule commentato, `workflow_dispatch` attivo): esegue Claude Code headless con l'agente `events-researcher` (definito in `.claude/agents/events-researcher.md`) tramite `anthropics/claude-code-action` (verifica sulla documentazione ufficiale gli input attuali dell'action: prompt, `claude_args` per `--max-turns`, modello, tool consentiti). Compito: cercare nuovi eventi dalle fonti in `docs/sources.md`, creare i record, aggiornare quelli esistenti. Poi `npm run validate -- --content`; se ok apre una PR con `peter-evans/create-pull-request` (branch `bot/eventi-AAAA-MM-GG`, etichetta `dati`, corpo = log sintetico). Gli eventi passati vanno in archivio da soli alla build (D-013): il workflow non sposta file.
3. **`update-directory.yml`** (mensile, commentato): stesso schema con `directory-researcher`: ricontrolla siti e fonti dei record esistenti (link morti, aziende chiuse → proposta di spostamento in `data/_pending/` con motivo), propone nuovi ingressi → PR.
4. **`linkcheck.yml`** (settimanale, commentato): build, poi controllo dei link interni (già nel validatore) ed esterni (script `scripts/linkcheck/external.mjs`: HEAD/GET con timeout, 1 richiesta/s per dominio, User-Agent identificativo, tollera 429/403 di siti che bloccano i bot segnalandoli a parte). Se ci sono errori apre o aggiorna **una** issue "Link rotti" (`actions/github-script` o `gh issue`).
5. **`rebuild.yml`** (giornaliero, commentato): chiama il deploy hook di Cloudflare Pages (`secrets.CF_PAGES_DEPLOY_HOOK`) per ricalcolare prossimi eventi/archivio. Se il secret manca, termina con un avviso, non con un errore.

## Budget e sicurezza
- Chiave `ANTHROPIC_API_KEY` solo da GitHub Secrets. Modello configurabile con variabile (`vars.CLAUDE_MODEL`, default Sonnet).
- Budget per esecuzione configurabile: `vars.MAX_TURNS` (default 40) e timeout del job (`timeout-minutes`). Documenta come stimare il costo.
- Permessi minimi per ogni workflow (`permissions:` esplicito: `contents: write` e `pull-requests: write` solo dove servono).
- Concurrency group per evitare esecuzioni sovrapposte.
- Pin delle action a una versione maggiore stabile (o SHA) — niente `@main`.
- Gli agenti nelle pipeline devono rispettare gli stessi vincoli delle spec (niente scraping vietato, niente dati personali): includilo nel prompt.

## Log
Ogni esecuzione dei workflow dati scrive `docs/runs/AAAA-MM-GG-<tipo>.md` (inclusa nella PR): data, modello, turni/token usati se disponibili, record aggiunti/modificati/spostati, fonti consultate, errori. Max 40 righe. Scrivi `docs/runs/README.md` con il formato.

## Documentazione
`docs/automation.md`: cosa fa ogni workflow, come attivarlo (togliere il commento allo schedule), secrets e variabili da configurare (`ANTHROPIC_API_KEY`, `CF_PAGES_DEPLOY_HOOK`, `vars.CLAUDE_MODEL`, `vars.MAX_TURNS`), come approvare le PR, costi indicativi.

## Regole comuni
- Non modificare file fuori dalle tue cartelle; se serve, segnalalo nel report.
- Valida la sintassi dei workflow (es. `npx --yes @action-validator/cli` o `actionlint` se installabile; altrimenti parsing YAML con node).
- Al termine: `npm run validate -- --content`.
- Report finale (max 200 parole): workflow creati e stato (attivo/spento), secrets necessari, problemi aperti.
