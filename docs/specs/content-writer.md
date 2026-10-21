# Spec: content-writer

Scrivi gli articoli educazionali di aisicilia.it per imprenditori e PMI siciliane. Ogni articolo: **1.200–2.000 parole** (corpo, frontmatter escluso), utile, concreto, con la voce di Elvio Leonardi.

## Leggi solo
Questa spec, `docs/copy-rules.md` (vincolante), `src/content.config.ts` (schema `articles`), `src/lib/taxonomies.ts`, `docs/sources.md` (sezione fonti ufficiali).

## Scrivi solo in
`src/content/articles/<slug>.md`. Scrivi solo gli articoli che ti sono stati assegnati.

## Gli articoli (slug fissi: servono ai link incrociati)
| # (`order`) | Titolo di lavoro | slug | `sectors` | YMYL |
|---|---|---|---|---|
| 1 | AI per le PMI siciliane: da dove cominciare, in pratica | `ai-pmi-siciliane-da-dove-cominciare` | tutti | no |
| 2 | AI per hotel, B&B e strutture ricettive: casi d'uso concreti | `ai-hotel-bb-strutture-ricettive` | ospitalita, turismo-agenzie | no |
| 3 | AI per ristoranti, bar e locali | `ai-ristoranti-bar-locali` | ristorazione | no |
| 4 | AI per cantine e aziende agroalimentari: schede prodotto, traduzioni, export | `ai-cantine-aziende-agroalimentari` | agroalimentare-vino | no |
| 5 | AI negli studi professionali: cosa fare e cosa evitare con i dati dei clienti | `ai-studi-professionali-dati-clienti` | studi-professionali | no (ma cita solo fonti ufficiali su GDPR e deontologia) |
| 6 | AI Act e GDPR: cosa deve sapere un'impresa | `ai-act-gdpr-cosa-deve-sapere-impresa` | tutti | **sì** |
| 7 | GEO: come farsi trovare (e consigliare) da ChatGPT, Gemini e Perplexity | `geo-farsi-trovare-chatgpt-gemini-perplexity` | tutti | no |
| 8 | Scrivere prompt efficaci senza essere tecnici | `scrivere-prompt-efficaci-senza-essere-tecnici` | tutti | no |
| 9 | Automatizzare le attività ripetitive: email, preventivi, documenti, social | `automatizzare-attivita-ripetitive` | tutti | no |
| 10 | Incentivi e finanziamenti per digitalizzazione e AI in Sicilia | `incentivi-finanziamenti-digitalizzazione-ai-sicilia` | tutti | **sì** |

Il titolo finale puoi migliorarlo (max 110 caratteri); se supera 60 caratteri aggiungi `seo_title` ≤ 60.

## Frontmatter (tutti i campi dello schema)
- `description` 70–155 caratteri, scritta per invogliare a leggere, non riassunto generico.
- `answer`: **paragrafo di risposta diretta** (2–3 frasi, 120–450 caratteri) alla domanda principale dell'articolo. Va in apertura di pagina: deve stare in piedi da solo ed essere citabile da un motore AI.
- `sectors`, `level` (base/intermedio/avanzato), `reading_time` (parole / 200, arrotondato), `order` come da tabella.
- `published_at` e `updated_at`: la data di oggi.
- `author: elvio-leonardi`.
- `sources`: tutte le fonti citate nel testo (url + titolo). Per gli YMYL **solo fonti ufficiali** (EUR-Lex, Commissione europea, Garante privacy, Gazzetta Ufficiale, MIMIT, Invitalia, Regione Siciliana, Camere di Commercio, ISTAT…).
- `needs_human_review`: `true` per gli articoli 6 e 10, `false` per gli altri.
- `faq`: 3–5 domande vere che un imprenditore farebbe, con risposte di 2–4 frasi.
- `related_prompts: []` (li collega l'orchestratore dopo).

## Corpo (Markdown)
- Niente H1 (il titolo è già H1). Struttura con `##` e `###`, senza salti di livello.
- Almeno un box **In pratica** con azioni da fare subito, in questo formato esatto (righe vuote comprese):
  ```
  <aside class="in-pratica">

  **In pratica**

  - azione concreta 1
  - azione concreta 2

  </aside>
  ```
- **Link interni obbligatori** (percorsi assoluti con slash finale):
  - almeno uno alla prompt library del settore: `/prompt/<settore>/` (settori: ospitalita, ristorazione, agroalimentare-vino, commercio-retail, turismo-agenzie, studi-professionali, artigianato-manifattura, edilizia-immobiliare) o `/prompt/`;
  - almeno uno alla directory: `/aziende/`, `/eventi/` o `/aziende/provincia/<provincia>/`;
  - dove ha senso, ad altri articoli: `/impara/<slug>/` (slug in tabella).
  - Anchor descrittivi ("i prompt per rispondere alle recensioni"), mai "clicca qui".
- Link esterni alle fonti nel testo dove citi un dato.
- Esempi siciliani concreti e verosimili, presentati come esempi (mai come casi reali o clienti).
- **Nessuna statistica senza fonte linkata.** Nessuna promessa di risultati. Strumenti (ChatGPT, Claude, Gemini, Copilot…) citati solo come esempi, con la nota "aggiornato a <mese anno>" dove parli di funzioni o prezzi.
- Ammetti i limiti: cosa l'AI non fa bene, quando non conviene, costi in tempo e soldi.
- Dati personali: ricorda dove serve di non inserire dati dei clienti negli strumenti AI senza base giuridica e accordi adeguati.

## Articoli YMYL (6 e 10)
- Solo fonti ufficiali, citate con link e data di consultazione. Date di applicazione, scadenze e importi **solo** se li trovi nella fonte ufficiale: verificali (le norme e i bandi cambiano; scrivi "verificato il <data>").
- Per il 10: se un bando è chiuso o non trovi la fonte ufficiale aggiornata, non citarlo come aperto. Meglio spiegare dove cercare (Regione Siciliana, Camere di Commercio, MIMIT/Invitalia) e come leggere un bando.
- Per il 6: AI Act (Reg. UE 2024/1689) con il calendario di applicazione dalla fonte ufficiale, obblighi rilevanti per una PMI che **usa** strumenti AI (non che li sviluppa), alfabetizzazione AI, trasparenza, GDPR (basi giuridiche, DPIA quando serve, fornitori extra UE), legge italiana sull'AI se pubblicata in Gazzetta Ufficiale. Niente consulenza legale: suggerisci quando rivolgersi a un professionista.
- `needs_human_review: true`: non saranno pubblicati finché Elvio non li approva.

## Articolo 7 (GEO)
È il tema di Elvio: tono da chi lo fa di mestiere, senza citare clienti. Spiega come i motori AI scelgono le fonti, cosa può fare una piccola impresa siciliana (dati coerenti, pagine che rispondono, recensioni, schede aggiornate, dati strutturati), cosa non si può garantire.

## Regole comuni
- Non modificare file fuori dalla tua cartella; se serve, segnalalo nel report.
- Al termine: `npm run validate -- --content` (controlla lunghezza, box In pratica, link interni, lista nera): zero errori sui tuoi file.
- Report finale (max 200 parole): articoli scritti con numero di parole, fonti principali, dubbi sui contenuti, problemi aperti.
