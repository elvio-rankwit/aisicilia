// Campione casuale del 30% di aziende ed eventi. Seme dichiarato: 20261021 (mulberry32 + Fisher-Yates su elenco ordinato per nome file).
import { readdirSync } from 'node:fs';
const SEED = 20261021;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd = mulberry32(SEED);
const pick = (dir, ratio) => {
  const files = readdirSync(dir).filter(f=>f.endsWith('.json')).sort().map(f=>f.replace('.json',''));
  const a=[...files]; for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return {total:files.length, n:Math.round(files.length*ratio), sample:a.slice(0,Math.round(files.length*ratio)).sort()};
};
const root = new URL('../../src/content/', import.meta.url).pathname;
const c = pick(root+'companies',0.3), e = pick(root+'events',0.3);
console.log(JSON.stringify({seed:SEED,companies:c,events:e},null,1));
