# Log delle esecuzioni

Ogni esecuzione dei workflow dati (`update-events`, `update-directory`) produce un file `docs/runs/AAAA-MM-GG-<tipo>.md`, incluso nella Pull Request. Il corpo della PR è lo stesso file.

- `<tipo>`: `eventi` o `directory`.
- Data: giorno dell'esecuzione, fuso Europe/Rome.
- Lunghezza massima: 40 righe. Solo fatti, niente testi dei record.
- Se l'agente non scrive il log, il workflow ne crea uno minimo con l'elenco dei file toccati.

## Formato

```markdown
# <Eventi|Directory> — AAAA-MM-GG

- Data: AAAA-MM-GG
- Modello: <alias o id>
- Turni / token: <numeri se noti, altrimenti "n.d.">

## Record
- Aggiunti: N (slug, uno per riga se sono pochi)
- Modificati: N (slug: campo cambiato)
- Spostati in `data/_pending/`: N (slug: motivo)

## Fonti consultate
- <URL o nome della fonte> — esito (ok / non raggiungibile / scartata e perché)

## Errori e dubbi
- <problema, o "nessuno">
```
