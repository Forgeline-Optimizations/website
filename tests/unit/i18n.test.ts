import { describe, expect, it } from 'vitest';
import { nl } from '../../src/i18n/nl';
import { verdicts, defaultVerdict } from '../../src/data/verdicts';
import { chaosNodes, chaosNodesMobile } from '../../src/data/hero-chaos';

/** Alle strings in een genest object, met hun pad. */
function strings(value: unknown, path = 'nl'): [string, string][] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (value && typeof value === 'object')
    return Object.entries(value).flatMap(([k, v]) => strings(v, `${path}.${k}`));
  return [];
}

const all = strings(nl);

describe('nl dictionary', () => {
  it('no empty strings', () => {
    const empty = all.filter(([, s]) => s.trim() === '').map(([p]) => p);
    expect(empty).toEqual([]);
    expect(all.filter(([, s]) => /TODO/.test(s)).map(([p]) => p)).toEqual([]);
  });

  it('every verdict has text', () => {
    for (const { id } of verdicts) {
      const item = nl.werkwijze.verdict.items[id];
      for (const key of ['title', 'shortTitle', 'reason'] as const) {
        expect(item[key], `${id}.${key}`).toBeTruthy();
      }
    }
    expect(verdicts.map((v) => v.id)).toContain(defaultVerdict);
  });

  it('chaos nodes match', () => {
    expect(chaosNodes.length).toBe(nl.hero.nodes.length);
    for (const { node } of chaosNodes) expect(nl.hero.nodes[node]).toBeTruthy();
  });

  it('mobile hero nodes', () => {
    expect(nl.hero.nodesMobile.length).toBe(3);
    for (const { node } of chaosNodesMobile) expect(nl.hero.nodesMobile[node]).toBeTruthy();
  });

  it('no prices', () => {
    const priced = all.filter(([, s]) => /€\s?\d|\d+\s?euro/i.test(s)).map(([p]) => p);
    expect(priced).toEqual([]);
  });
});
