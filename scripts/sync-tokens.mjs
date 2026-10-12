// Genereert src/styles/tokens.css uit design/design-system/tokens.json.
// Nooit tokens.css met de hand bewerken: pas tokens.json aan en draai `npm run tokens`.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const SRC = new URL('../design/design-system/tokens.json', import.meta.url);
const OUT = new URL('../src/styles/tokens.css', import.meta.url);

/** "{naam}" → "var(--naam)"; alle andere waarden ongewijzigd. */
export const resolve = (v) => {
  const m = /^\{([A-Za-z0-9_.-]+)\}$/.exec(String(v));
  return m ? `var(--${m[1]})` : String(v);
};

/** Waarde voor een thema; ontbreekt die, dan die van het eerste thema, dan de eerste die er is. */
export const pick = (value, theme, first) =>
  typeof value === 'string' ? value : (value[theme] ?? value[first] ?? Object.values(value)[0]);

/** @param {any} t tokens.json @returns {string} CSS */
export function buildTokensCss(t) {
  const themes = t.color.themes.map((th) => th.id);
  const first = themes[0];
  const perTheme = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];

  const themeBlocks = themes.map((id) => {
    const selector = id === first ? `:root, [data-theme="${id}"]` : `[data-theme="${id}"]`;
    const lines = perTheme.map((tok) => `  --${tok.name}: ${resolve(pick(tok.value, id, first))};`);
    lines.push(`  color-scheme: ${id === 'light' ? 'light' : 'dark'};`);
    return `${selector} {\n${lines.join('\n')}\n}`;
  });

  const flat = ['spacing', 'radius', 'duration', 'easing', 'size']
    .flatMap((family) => t[family]?.tokens ?? [])
    .map((tok) => `  --${tok.name}: ${tok.value};`);
  const families = Object.entries(t.type.families).map(([k, stack]) => `  --font-${k}: ${stack};`);

  const styles = t.type.groups.flatMap((g) =>
    g.styles.map((s) => {
      const fam = s.family ?? g.family;
      const decl = [
        `font-family: var(--font-${fam});`,
        `font-size: ${s.fontSize};`,
        s.lineHeight && `line-height: ${s.lineHeight};`,
        s.fontWeight && `font-weight: ${s.fontWeight};`,
        s.letterSpacing && `letter-spacing: ${s.letterSpacing};`,
      ].filter(Boolean);
      return `.text-style-${s.name} { ${decl.join(' ')} }`;
    }),
  );

  return [
    '/* GENERATED from design/design-system/tokens.json by scripts/sync-tokens.mjs — do not edit */',
    ...themeBlocks,
    `:root {\n${[...flat, ...families].join('\n')}\n}`,
    ...styles,
    '',
  ].join('\n\n');
}

async function main() {
  const tokens = JSON.parse(await readFile(SRC, 'utf8'));
  await writeFile(OUT, buildTokensCss(tokens));
  console.log('tokens.css bijgewerkt');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
