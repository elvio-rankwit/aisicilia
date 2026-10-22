# Spec: guide /impara/ v2 ("guide di alto livello")

Richiesta dell'utente (22/10/2026): riscrivere tutti i contenuti della sezione Impara come **guide di alto livello**, con tono professionale, senza scendere troppo nel tecnico e con un buon equilibrio, applicando le skill `copywriter-umano` e `seo-geo-optimizer`.

Questa spec sostituisce, per i 10 articoli, le parti di `docs/specs/content-writer.md` su lunghezza, struttura e FAQ. Restano valide le regole del progetto: zero dati inventati, fonti linkate, YMYL, link interni, slug invariati.

## Leggi (in quest'ordine)
1. Questa spec.
2. La skill di scrittura, per intero: `/root/.claude/skills/synced/30cb4036-b2c0-48e5-a408-a8b7b96fb2b9_3c89d9d6-9673-4fa7-8111-027b8e900396/copywriter-umano/SKILL.md` (priorità delle regole, modalità **2D** articoli e **2E** guide, formattazione, lista bandita).
3. Il playbook GEO: `/root/.claude/skills/synced/30cb4036-b2c0-48e5-a408-a8b7b96fb2b9_3c89d9d6-9673-4fa7-8111-027b8e900396/seo-geo-optimizer/references/content-optimization.md`.
4. `docs/copy-rules.md` e `src/content.config.ts` (schema `articles`).
5. L'articolo attuale da riscrivere: è la base dei **fatti** (fonti, date, numeri, link). La forma va rifatta.

## Che cosa vuol dire "guida di alto livello"
È la guida che un imprenditore siciliano salva e gira al socio: completa, ordinata, autorevole e leggibile in 10 minuti.
- **Equilibrio**: il registro è quello di un consulente esperto che spiega a un imprenditore. I termini tecnici si spiegano in una riga la prima volta (RAG, LLM, API, GEO, DPIA…). Niente gergo da sviluppatori, nessun codice, nessuna procedura da tecnico informatico.
- **Professionale**: prima persona usata con misura (Elvio, consulente e docente). Si dà del tu al lettore. Niente battute forzate, niente tono da chat. Le frasi che aprono con "E", "Ma", "Quindi" vanno usate con parsimonia (sono guide, non post).
- **Utile**: ogni sezione lascia al lettore una decisione da prendere o un'azione da fare.

## Struttura obbligatoria
1. Frontmatter `answer` (risposta diretta, 2–3 frasi, 40–80 parole): risponde alla domanda principale del titolo e regge da sola, quindi è citabile da un motore AI.
2. In apertura del corpo, un box **"In breve"** con 4–5 punti concreti, ciascuno con un fatto o una decisione (niente punti vaghi). Formato:
   ```
   <aside class="in-breve">

   **In breve**

   - …

   </aside>
   ```
   È l'unico riepilogo ammesso: niente paragrafo riassuntivo in fondo.
3. **6–9 sezioni H2**. Circa metà formulate come domande reali dell'imprenditore ("Quanto costa davvero…?", "Da dove si comincia…?"), le altre come titoli di contenuto. Ogni sezione si capisce da sola, senza "come detto sopra", e si apre con una frase che risponde subito; i dettagli vengono dopo.
4. Almeno **un elemento strutturato** per guida, dove serve davvero: tabella decisionale o comparativa (es. compito → strumento → rischio → tempo), checklist, sequenza numerata di passi, matrice "conviene / non conviene".
5. Almeno un box **"In pratica"** (formato invariato: `<aside class="in-pratica">`) con le azioni da fare questa settimana.
6. Una sezione sui **limiti e rischi** (cosa l'AI non fa bene, quando non conviene, costi reali in tempo e denaro).
7. FAQ nel frontmatter: **6–8 domande** reali (formulate come le scriverebbe un imprenditore a ChatGPT), risposte di **40–60 parole** ciascuna, autosufficienti. Le FAQ non cominciano con "Sì." o "No.".
8. Lunghezza del corpo: **1.600–2.600 parole**. Più corto e preciso batte più lungo e gonfio: arriva alla lunghezza con contenuto, mai con riempitivi.

## Regole di contenuto
- **Fatti**: tieni tutti i fatti verificati dell'articolo attuale (fonti, date, numeri). Puoi aggiungere dati citabili solo da fonti ufficiali o autorevoli che apri davvero (Istat, Eurostat, Commissione europea, Garante, Banca d'Italia, documentazione ufficiale dei produttori), con link nel testo e nel frontmatter `sources`, e la data se il dato cambia nel tempo. Nessuna statistica senza fonte.
- **Esempi**: conflitto tra skill e progetto. La skill chiede "esempi veri"; il progetto vieta di presentare casi inventati come reali. Vale la regola del progetto: gli esempi siciliani restano **dichiaratamente esempi** ("prendiamo un B&B a Ortigia…"), concreti e verosimili, con numeri plausibili presentati come ipotesi ("se ricevi 40 email al giorno…"). Mai clienti, mai "un mio cliente", mai risultati attribuiti a aziende reali.
- **Strumenti** (ChatGPT, Claude, Gemini, Copilot…): solo come esempi, con la nota "situazione a ottobre 2026" quando citi funzioni o prezzi. Prezzi solo se verificati sulla pagina ufficiale.
- **Prendi posizione**: consigli chiari ("io partirei da…", "qui l'AI non la userei"), dicendo quando sei incerto.
- **Lista bandita**: quella della skill (§4) più `scripts/validate/blacklist.mjs`. Niente trattini lunghi (—), niente puntini di sospensione, numeri in cifre, grassetto al massimo 1–2 volte per sezione.
- **Entità**: nomi di enti, norme, province e strumenti scritti sempre allo stesso modo (Regolamento (UE) 2024/1689, Garante per la protezione dei dati personali, Camera di Commercio di Palermo ed Enna…).

## SEO e GEO
- `title` ≤ 110 caratteri con la keyword principale all'inizio; se supera 60, `seo_title` ≤ 60. `description` 120–155 caratteri, concreta.
- `updated_at: 2026-10-22`; `published_at` invariato.
- Link interni (assoluti, con slash finale, anchor descrittivi): almeno 2 verso `/prompt/<settore>/` o pagine di prompt (`/prompt/<settore>/<slug>/`, usa gli slug di `related_prompts` dell'articolo), almeno 1 verso `/aziende/` o `/eventi/` (o una pagina provincia), almeno 2 verso altre guide `/impara/<slug>/`. I link a guide in revisione sono ammessi (la build li rende testo).
- Link esterni alle fonti dove citi il dato.
- `related_prompts`: mantieni quelli esistenti (puoi aggiungerne di pertinenti, slug esistenti in `src/content/prompts/`).
- Slug, `order`, `author`, `sectors` invariati.

## YMYL (articoli 5, 6, 10)
`needs_human_review: true` resta. Date, importi, riferimenti normativi e stati dei bandi si toccano solo per aggiornarli dopo averli riverificati sulla fonte ufficiale (con data di verifica). Nessuna consulenza legale: dove serve, rimanda al professionista.

## Controlli
`npm run validate -- --content` con 0 errori (il validatore controlla lunghezza 1.600–2.600, box In breve e In pratica, link interni, FAQ, lista nera). Rileggi ogni guida per intero prima del report: niente frasi da metronomo, niente sezioni che si ripetono tra guide (ogni guida ha esempi suoi).
