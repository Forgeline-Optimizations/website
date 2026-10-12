import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildTokensCss, resolve } from '../../scripts/sync-tokens.mjs';

const tokens = JSON.parse(readFileSync('design/design-system/tokens.json', 'utf8'));

/** Inhoud van het eerste blok dat met `selector` begint. */
const block = (css: string, selector: string) => {
  const start = css.indexOf(`${selector} {`);
  expect(start, `${selector} ontbreekt`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
};

describe('resolve', () => {
  it('resolves aliases to var()', () => {
    expect(resolve('{smeedzwart}')).toBe('var(--smeedzwart)');
  });

  it('keeps plain values', () => {
    expect(resolve('#ff8700')).toBe('#ff8700');
  });
});

describe('buildTokensCss', () => {
  const css = buildTokensCss(tokens);

  it('dark is the root theme', () => {
    expect(css).toContain(':root, [data-theme="dark"] {');
  });

  it('light overrides ink with an alias to smeedzwart', () => {
    expect(block(css, '[data-theme="light"]')).toContain('--ink: var(--smeedzwart);');
  });

  it('single-theme token falls back', () => {
    expect(block(css, ':root, [data-theme="dark"]')).toContain('--logo-main: #ff8700;');
  });

  it('emits type styles', () => {
    expect(css).toMatch(/\.text-style-display \{[^}]*font-size: 72px/);
  });

  it('real tokens.json builds', () => {
    expect(() => buildTokensCss(tokens)).not.toThrow();
    expect(css).toContain('--forge:');
    expect(css).toContain('--space-32: 128px;');
  });
});
