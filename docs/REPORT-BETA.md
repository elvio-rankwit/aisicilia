# AI Sicilia: report della beta (21 ottobre 2026)

## 1. URL
- Beta (non indicizzata): **https://aisicilia.pages.dev**
- Repository: https://github.com/elvio-rankwit/aisicilia. Ogni push su `main` pubblica automaticamente (workflow `deploy.yml`).

## 2. Numeri
| Modulo | Pubblicati | Note |
|---|---|---|
| Aziende e startup AI | **34** | Palermo 13, Catania 14 (RankWit in evidenza), Messina 5, Siracusa 1, Trapani 1. Agrigento, Caltanissetta, Enna e Ragusa: 0 |
| Eventi in programma | **11** | Palermo 6, Catania 4, Agrigento 1 (al 21/10; l'archivio si aggiorna a ogni build) |
| Eventi in archivio | **22** | aprile–ottobre 2026; 2 eventi online organizzati da realtà siciliane |
| Articoli | **7 visibili + 3 in revisione** | i 3 in revisione non sono pubblicati (vedi §3) |
| Prompt | **48** | 8 settori × 6, ognuno testato su un input di esempio |

Fonti principali della directory: siti ufficiali, spin-off e laboratori di UniPa, UniCT e UniMe, CNR, e l'elenco ufficiale delle startup innovative (estrazione del 19/10/2026 fornita da te). Delle 666 startup innovative siciliane, il prescreening dei siti ne ha segnalate 66 come candidate; ne sono state incluse 14 dopo la verifica manuale.

Qualità: Lighthouse 100/100/100/100 su 15 tipi di pagina, mobile e desktop (LCP ≤ 1,4 s, CLS 0, JS ≤ 5 KB gzip). `npm run validate` dà 0 errori sia in beta sia in production. Il QA ha controllato a campione il 30% dei record e il 100% dei link esterni (nessuno rotto). Report in `docs/qa/`.

## 3. Cosa richiede la tua revisione
1. **Articoli YMYL da approvare** (`needs_human_review: true`, non pubblicati):
   - `ai-act-gdpr-cosa-deve-sapere-impresa` (AI Act aggiornato al Digital Omnibus, Reg. UE 2026/1744; GDPR; legge 132/2025)
   - `incentivi-finanziamenti-digitalizzazione-ai-sicilia` (bandi verificati il 21/10. **Attenzione:** il voucher della Camera di Commercio del Sud Est scade il 31/10)
   - `ai-studi-professionali-dati-clienti` (GDPR e deontologia: messo in revisione dal QA, D-026)

   Per pubblicarli: in ciascun file `needs_human_review: false` e `reviewed_at: AAAA-MM-GG`.
2. **Record in pending**: 34 aziende e 10 eventi in `data/_pending/`, ognuno con `pending_reason`. Tra questi ci sono DevFest Catania (15/11, programma non ancora pubblicato) e startup con sede o AI da confermare.
3. **Casi borderline pubblicati**, da confermare o togliere: Keplera (studio legale con il prodotto AI LexHero), Aitho (AI più cloud e integrazione), i laboratori universitari classificati come "centro di ricerca", Zaiera (fonti: solo il sito e il registro).
4. **Segnaposto `[DA COMPLETARE]`** (evidenziati in giallo nelle pagine):
   - Chi siamo: foto, link LinkedIn, ruolo esatto in Google / Liu Jo / Plenitude, email di contatto
   - Contatti: email di contatto
   - Privacy: dati del titolare, fornitore dei moduli (Formspree/Tally), tempo di conservazione
   - Note legali: licenza dei contenuti
   - Rimozione: tempi di risposta. Metodologia: frequenza di revisione delle schede
5. **Moduli** (Segnala, Rimozione, Contatti): oggi disattivati con un avviso. Crea i form su Formspree e imposta gli URL come variabili del repository GitHub `PUBLIC_FORM_SEGNALA_URL`, `PUBLIC_FORM_RIMOZIONE_URL`, `PUBLIC_FORM_CONTATTI_URL` (Settings → Secrets and variables → Actions → Variables).
6. **Traduzioni nei prompt**: i prompt che producono testi in inglese, tedesco o francese andrebbero fatti rileggere a un madrelingua.

## 4. Decisioni prese in autonomia
Tutte in `docs/DECISIONS.md` (D-001 → D-027). Le principali:
- Astro 7 con schemi in `src/content.config.ts`
- Lighthouse misurato sulla build production (D-007)
- Design v2 "Basalto e maiolica digitale" con Familjen Grotesk e IBM Plex Mono (D-024)
- Link verso articoli non pubblicati resi come testo (D-023)
- RankWit in evidenza con nota di trasparenza (D-025)
- Articolo 5 in revisione (D-026)

## 5. Automazione
- **Attivi**: `ci.yml` (validazione, build e Lighthouse a 100 su ogni push e PR) e `deploy.yml` (Cloudflare Pages).
- **Predisposti ma spenti** (si lanciano a mano da Actions → Run workflow; per l'esecuzione automatica si toglie il commento allo `schedule`): `update-events.yml` (settimanale), `update-directory.yml` (mensile), `linkcheck.yml`, `rebuild.yml` (giornaliero, aggiorna prossimi eventi e archivio).
- **Servono**: il secret `ANTHROPIC_API_KEY` e, in Settings → Actions → General, l'opzione "Allow GitHub Actions to create and approve pull requests". Dettagli in `docs/automation.md`.
- **Consiglio**: attivare `rebuild.yml` subito, perché gli eventi passano in archivio solo quando il sito viene ricostruito.

## 6. Dominio e passaggio a production
1. **DNS su Cloudflare.** Aggiungi aisicilia.it a Cloudflare (piano free) e, su Register.it, sostituisci i nameserver con quelli indicati da Cloudflare.
2. **Dominio sul progetto.** In Cloudflare: Workers & Pages → `aisicilia` → Custom domains → aggiungi `aisicilia.it` e `www.aisicilia.it`.
3. **Redirect www → apex.** Rules → Redirect Rules, regola "www to apex": `https://www.aisicilia.it/*` → `https://aisicilia.it/${1}`, 301.
4. **Uscita dalla beta.** Nel repository GitHub crea la variabile `PUBLIC_SITE_MODE` con valore `production` (Settings → Secrets and variables → Actions → Variables), poi rilancia il deploy (Actions → Deploy → Run workflow) o fai un push. Senza la variabile il sito resta in beta. In automatico:
   - spariscono noindex e `X-Robots-Tag`;
   - `robots.txt` consente i crawler, compresi quelli AI;
   - si generano le sitemap.
5. **Search Console.** Verifica il dominio e invia `https://aisicilia.it/sitemap-index.xml`.

Il canonical usa già `https://aisicilia.it` (`PUBLIC_SITE_URL`), quindi non serve nessun'altra modifica.
