# Fixture FITTIZIE, solo per lo sviluppo

Si caricano solo con `USE_FIXTURES=1 npm run dev`. Non finiscono mai in produzione:
`npm run validate` fallisce se trova lo slug prefisso `esempio-` in `src/content/`.
Nomi, indirizzi e URL sono volutamente finti (dominio `.example`).
