// Lista nera del copy (sezione 10.1 del brief). Regex case-insensitive, confini di parola.
// Ogni voce: [regex, suggerimento]. Usata da validate e dal copy-editor.
export const BLACKLIST = [
  [/nel panorama (attuale|odierno|digitale)/i, 'apertura di rito'],
  [/in un mondo sempre più/i, 'apertura di rito'],
  [/l['’]?(ai|intelligenza artificiale) sta rivoluzionando/i, 'hype'],
  [/\bin conclusione\b/i, 'chiusura di rito'],
  [/\bin sintesi\b/i, 'chiusura di rito'],
  [/(?<!diritti )(?<!libertà )\bfondamental[ei]\b/i, 'parola gonfia (ammesso solo "diritti fondamentali")'],
  [/\bcrucial[ei]\b/i, 'parola gonfia'],
  [/\brivoluzionari[oae]\b/i, 'parola gonfia'],
  [/\bpotenzia(re|ndo|to|ta|ti|te|no)?\b/i, 'parola gonfia'],
  [/sfruttare (al meglio )?il (suo |loro )?potenziale/i, 'parola gonfia'],
  [/\bsinergi[ae]\b/i, 'parola gonfia'],
  [/a 360 gradi/i, 'parola gonfia'],
  [/game[ -]?changer/i, 'parola gonfia'],
  [/non (è|e') solo [^.]{1,60}, ma/i, 'costruzione "non è solo X, ma Y"'],
  [/non si tratta solo di/i, 'costruzione "non è solo X, ma Y"'],
  [/\bsvolta epocale\b/i, 'hype'],
  [/\bal giorno d['’]oggi\b/i, 'apertura di rito'],
  [/\bimmergiamoci\b|\baddentriamoci\b/i, 'tic da AI'],
  [/\bun viaggio (nel|alla scoperta)/i, 'tic da AI'],
  [/\bsenza precedenti\b/i, 'hype'],
  [/raddoppia(re)? (le )?vendite/i, 'promessa irrealistica'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'emoji'],
];
// "ecosistema" è ammesso solo come termine tecnico: segnalato come avviso, non errore.
export const WARNLIST = [
  [/\becosistem[ai]\b/i, '"ecosistema": ok solo se è il termine giusto'],
  [/ — /, 'trattino lungo: verificare che non sia un tic'],
];
