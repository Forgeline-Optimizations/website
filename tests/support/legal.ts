import { readFileSync } from 'node:fs';

// Leest een juridische tekst uit src/i18n/legal/ zoals Sander hem schreef. Vitest en Playwright kunnen geen
// .md importeren, dus de frontmatter (alleen `sleutel: waarde`-regels) lezen we hier zelf.
export function readLegal(name: 'privacy' | 'voorwaarden') {
  const raw = readFileSync(new URL(`../../src/i18n/legal/${name}.nl.md`, import.meta.url), 'utf8');
  const [, head = '', body = ''] = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/) ?? [];
  const meta: Record<string, string> = {};
  for (const line of head.split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*'?(.*?)'?\s*$/);
    if (m) meta[m[1]] = m[2];
  }
  return { meta, body };
}
