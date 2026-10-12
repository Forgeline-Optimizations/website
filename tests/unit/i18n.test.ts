import { describe, expect, it } from 'vitest';
import { nl } from '../../src/i18n/nl';
import { verdicts, verdictsMobile, defaultVerdict } from '../../src/data/verdicts';
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
// Bewust leeg: geen knelpunt na deze stap (zie nl.inzicht.steps).
const mayBeEmpty = /^nl\.inzicht\.steps\[\d\]\.painpoint$/;

describe('nl dictionary', () => {
  it('no empty strings', () => {
    const empty = all.filter(([p, s]) => !mayBeEmpty.test(p) && s.trim() === '').map(([p]) => p);
    expect(empty).toEqual([]);
    expect(all.filter(([, s]) => /TODO/.test(s)).map(([p]) => p)).toEqual([]);
  });

  it('every verdict has text', () => {
    for (const { id } of verdicts) {
      const item = nl.oordeel.items[id];
      for (const key of ['title', 'shortTitle', 'meta', 'reason'] as const) {
        expect(item[key], `${id}.${key}`).toBeTruthy();
      }
    }
    expect(verdicts.map((v) => v.id)).toContain(defaultVerdict);
    for (const id of verdictsMobile) expect(verdicts.map((v) => v.id)).toContain(id);
  });

  it('chaos nodes match', () => {
    expect(chaosNodes.length).toBe(nl.hero.nodes.length);
    for (const { node } of [...chaosNodes, ...chaosNodesMobile]) expect(nl.hero.nodes[node]).toBeTruthy();
  });

  it('no prices', () => {
    const priced = all.filter(([, s]) => /€\s?\d|\d+\s?euro/i.test(s)).map(([p]) => p);
    expect(priced).toEqual([]);
  });
});
