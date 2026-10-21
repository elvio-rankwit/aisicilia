# Dati geografici

- `sicilia-province.min.geojson`: contorni delle 9 province siciliane, semplificati (tolleranza circa 1 km) e con coordinate a 4 decimali. Serve alla mappa interattiva per evidenziare la provincia selezionata e a `scripts/geocode/batch.mjs` per controllare che le coordinate cadano nella provincia dichiarata. Le Pelagie (Lampedusa e Linosa) ci sono; Lampione e gli isolotti più piccoli sono stati scartati dalla semplificazione.

## Fonte e attribuzione

Confini © ISTAT, "Confini delle unità amministrative a fini statistici", unità territoriali sovracomunali, versione generalizzata al 01/01/2025. Licenza CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Elaborazione: proiezione, filtro sulla regione Sicilia (codice 19) e semplificazione dei tratti (Douglas-Peucker), fatti da `scripts/geocode/build-provinces.mjs`.

## Come rigenerare

```
node scripts/geocode/build-provinces.mjs
```

Lo script scarica lo zip ISTAT in `scripts/geocode/raw/` (non versionato) e riscrive:

- `public/geo/sicilia-province.min.geojson`
- `src/components/map/provinces-paths.ts` (path SVG, viewBox, funzione `project`)
- `src/components/map/province-bounds.ts` (riquadri per `fitBounds`)

Parametri: `--eps` (tolleranza dei path SVG, unità del viewBox), `--eps-geo` (tolleranza del GeoJSON), `--svg-min-lat` (a sud di questa latitudine l'anteprima SVG non disegna: di default esclude le Pelagie, che altrimenti allungherebbero la mappa di un terzo con due puntini).

Nell'anteprima SVG mancano quindi Lampedusa, Linosa e Lampione. Restano nei conteggi di Agrigento e nella mappa interattiva.
