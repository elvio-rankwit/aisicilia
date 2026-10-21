// Lighthouse CI: soglia 100 in tutte e 4 le categorie, mobile e desktop.
//   LHCI_PRESET=mobile|desktop npm run lhci   (default mobile)
// Gli URL si ricavano da dist/: una pagina per ogni tipo richiesto dal brief (sez. 4.1).
const fs = require('node:fs');
const path = require('node:path');
const dist = path.join(__dirname, 'dist');
const firstChild = (dir) => {
  const p = path.join(dist, dir);
  if (!fs.existsSync(p)) return null;
  const skip = new Set(['provincia', 'pagina', 'archivio']);
  const sub = fs.readdirSync(p, { withFileTypes: true }).find((d) => d.isDirectory() && !skip.has(d.name) && fs.existsSync(path.join(p, d.name, 'index.html')));
  return sub ? `/${dir}/${sub.name}/` : null;
};
const promptSector = firstChild('prompt');
const singlePrompt = promptSector ? firstChild(promptSector.slice(1, -1)) : null;
const urls = [
  '/', '/aziende/', firstChild('aziende'), '/aziende/provincia/palermo/', '/eventi/',
  firstChild('impara'), '/prompt/', singlePrompt, '/chi-siamo/',
].filter(Boolean).map((u) => `http://localhost${u}`);

const preset = process.env.LHCI_PRESET === 'desktop' ? 'desktop' : 'mobile';
const cat = (name) => [`categories:${name}`, ['error', { minScore: 1 }]];

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: urls,
      numberOfRuns: 1,
      chromePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      settings: {
        ...(preset === 'desktop' ? { preset: 'desktop' } : {}),
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo'].map(cat)),
    },
    upload: { target: 'filesystem', outputDir: `./docs/qa/lighthouse/${preset}` },
  },
};
