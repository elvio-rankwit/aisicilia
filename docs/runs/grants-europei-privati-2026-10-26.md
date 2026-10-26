# Bandi europei e privati: 2026-10-26

- Ambito: programmi europei (Funding & Tenders, EIC, EuroHPC/AI Factories) e fondazioni o soggetti privati.
- Metodo: API pubblica di ricerca del portale Funding & Tenders (open e forthcoming, tutte le call), schede dei topic in JSON, testi delle call (PDF), pagine ufficiali. Max 1 richiesta al secondo per dominio.

## Record
- Verificati in `src/content/grants/` (5):
  - `eic-accelerator-eic-2026`: cut-off completo 04/11/2026 17:00, candidatura breve continua
  - `eic-pathfinder-deeprap-eic-2026`: scadenza 28/10/2026 17:00
  - `cybersicurezza-ai-pmi-eccc-2027`: scadenza 14/01/2027 17:00, apertura 01/09/2026
  - `cybersicurezza-basata-su-ai-eccc-2027`: scadenza 14/01/2027 17:00, apertura 01/09/2026
  - `accesso-calcolo-ai-factories-eurohpc`: call permanenti (stato Open sull'elenco ufficiale), senza scadenza
- In `data/_pending/grants/` (1):
  - `servizi-it4lia-ai-factory`: il sito ufficiale non pubblica un bando, date di apertura né regolamento; solo «accesso fino al 31 marzo 2028» nelle FAQ

## Fonti consultate
- Portale Funding & Tenders, API di ricerca e JSON dei topic: ok (la pagina web è un'app JavaScript, letta via JSON)
- EIC, pagina Accelerator e Work Programme 2026 (PDF): ok; Work Programme 2027 non pubblicato, cut-off 2027 non verificabili
- ECCC (cybersecurity-centre.europa.eu), call document DEP 11 (PDF): ok
- EuroHPC JU, pagine AI Factories (elenco call, modalità): ok; portale di accesso access.eurohpc-ju.europa.eu: app JavaScript, non leggibile
- IT4LIA AI Factory (it4lia-aifactory.eu), pagine servizi e FAQ: ok, robots.txt senza divieti sulle pagine usate
- EIT, call startup 2026: ok, ma è EIT Urban Mobility, fuori tema
- eurekanetwork.org (Eurostars): non raggiungibile (protezione anti-bot, 403)
- Fondazione Sicilia (elenco bandi), Fondazione Con il Sud (home): ok, nessun bando aperto per imprese o AI
- Fondazione CDP: pagine non raggiungibili (dominio non risolto, pagina d'errore)
- Aggregatori (cascadefunding.eu, CEIN, ricerche web): usati solo come pista

## Scartati
- Apply AI Challenge-Driven Booster (HORIZON-CL4-2027-04-DIGITAL-EMERGING-04): apre il 17/11/2026, scade il 18/03/2027, ma è per consorzi (14 milioni di euro a progetto); le PMI entrano solo come terze parti nelle open call future del consorzio
- Altre call Horizon Cluster 4 e RAISE 2026-2027 (CL4-2027-02 Human/AI collaboration, RAISE Doctoral Networks, Bridging Frontier AI): per consorzi di ricerca, non per PMI
- EIC STEP Scale Up (HORIZON-EIC-2026-STEP): equity da 10 a 30 milioni di euro, scadenza 08/10/2026 sul portale, fuori portata
- EIC Transition 2026 (chiusa 16/09/2026) e Advanced Innovation Challenge «Physical AI» (seconda fase 2027 riservata a chi ha superato la prima)
- Eurostars: cut-off 11 chiuso il 10/09/2026 (dato da pagine di agenzie nazionali, non dalla fonte ufficiale); date 2027 non trovate
- Digital Europe 2026 (DIGITAL-2026-AI-*, uptake cyber PMI): tutte chiuse (ultime scadenze 03/03, 31/03 e 01/10/2026), nessuna ricorrenza annunciata nei testi
- Open call a cascata: AID4SME OC2 (chiusa 15/07/2026, nessun'altra call annunciata), AI-BOOST (chiusa 25/08/2026), DeployAI (chiusa 08/06/2026), ELIAS (chiusa 31/05/2026); VALLEYS OC1 (14/12/2026) è per intermediari di valorizzazione, non per PMI
- UniCredit Start Lab 2026: chiusa il 25/03/2026
- Fondazione Sicilia SUDdiVISIONI (scaduta 05/07/2026), Fondazione Con il Sud (beni confiscati, volontariato): non AI né imprese
- Programmi a crediti cloud di grandi aziende (Google, AWS, Microsoft, NVIDIA): non cercati nel dettaglio; senza scadenza né regolamento da bando, fuori dal criterio

## Errori e dubbi
- Orari di scadenza: 17:00 ora di Bruxelles (uguale all'ora italiana) da Work Programme EIC 2026 e call document ECCC; il portale riporta solo la data.
- Digital Europe cyber: il budget dipende dall'adozione dell'emendamento al programma di lavoro 2025-2027 (scritto nel call document).
- `docs/sources.md` non aggiornato (fuori dalle cartelle consentite): da aggiungere Funding & Tenders (ok), EuroHPC JU (ok), IT4LIA (ok), eurekanetwork.org (non raggiungibile).
