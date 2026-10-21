// Plugin remark: nei testi Markdown, un link a un articolo non pubblicato (YMYL con
// needs_human_review: true) diventa testo semplice. Quando l'articolo viene approvato il link
// torna da solo alla build successiva. Evita link rotti senza toccare i contenuti (DECISIONS D-023).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { visit, SKIP } from 'unist-util-visit';
import { parse } from 'yaml';

function hiddenArticleSlugs(dir) {
  if (process.env.USE_FIXTURES === '1' || !existsSync(dir)) return new Set();
  const out = new Set();
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const m = readFileSync(join(dir, f), 'utf8').match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const data = parse(m[1]);
    if (data?.needs_human_review === true) out.add(data.slug);
  }
  return out;
}

export default function remarkUnpublishedLinks({ articlesDir = 'src/content/articles' } = {}) {
  return (tree) => {
    const hidden = hiddenArticleSlugs(join(process.cwd(), articlesDir));
    if (!hidden.size) return;
    visit(tree, 'link', (node, index, parent) => {
      const m = /^\/impara\/([a-z0-9-]+)\/?(#.*)?$/.exec(node.url ?? '');
      if (!m || !hidden.has(m[1]) || !parent || index === undefined) return;
      parent.children.splice(index, 1, ...node.children);
      return [SKIP, index];
    });
  };
}
