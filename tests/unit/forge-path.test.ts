import { describe, expect, it } from 'vitest';
import { lengthAtY, makePath, partial, toD } from '../../src/scripts/motion/forge-path';

// Vorm van de echte lijn: start → omlaag → links naar de rail → omlaag → haak naar rechts.
const pts = [
  { x: 720, y: 770 },
  { x: 720, y: 900 },
  { x: 134, y: 900 },
  { x: 134, y: 9000 },
  { x: 300, y: 9000 },
];

describe('forge path', () => {
  const path = makePath(pts, 120);

  it('measures straight segments exactly', () => {
    expect(path.total).toBe(130 + 586 + 8100 + 166);
    expect(path.lens).toEqual([0, 130, 716, 8816, 8982]);
  });

  it('drops zero-length segments (mobile: start already on the rail)', () => {
    const mobile = makePath([
      { x: 16, y: 500 },
      { x: 16, y: 600 },
      { x: 16, y: 600 },
      { x: 16, y: 2000 },
    ]);
    expect(mobile.pts).toHaveLength(3);
    expect(mobile.total).toBe(1500);
  });

  it('is 0 above the start and complete below the end', () => {
    expect(lengthAtY(path, 0)).toBe(0);
    expect(lengthAtY(path, 770)).toBe(0);
    expect(lengthAtY(path, 99999)).toBe(path.total);
  });

  it('never decreases while scrolling down', () => {
    let last = -1;
    for (let y = 0; y <= 9300; y += 7) {
      const len = lengthAtY(path, y);
      expect(len).toBeGreaterThanOrEqual(last);
      last = len;
    }
  });

  it('spreads a horizontal bend over scroll instead of drawing it in one frame', () => {
    // Zonder spreiding zou de hele horizontale 586px tussen y = 899 en 901 verschijnen.
    const jump = lengthAtY(path, 905) - lengthAtY(path, 895);
    expect(jump).toBeLessThan(100);
    // Halverwege de hoek staat het kopje ongeveer halverwege het horizontale stuk.
    expect(lengthAtY(path, 900)).toBeGreaterThan(130);
    expect(lengthAtY(path, 900)).toBeLessThan(716);
  });

  it('keeps the head within bendSpan of the screen point', () => {
    // De hoeken lenen scrollhoogte van de verticale stukken; het kopje mag daardoor hooguit 120px afwijken.
    for (let y = 1020; y <= 8880; y += 37) {
      const drawn = partial(path, lengthAtY(path, y));
      expect(Math.abs(drawn[drawn.length - 1].y - y)).toBeLessThanOrEqual(120);
    }
  });

  it('cuts the path at a length', () => {
    expect(partial(path, 0)).toEqual([pts[0]]);
    expect(partial(path, 65)).toEqual([pts[0], { x: 720, y: 835 }]);
    expect(partial(path, 130 + 100)).toEqual([pts[0], pts[1], { x: 620, y: 900 }]);
    expect(partial(path, path.total)).toEqual(pts);
  });

  it('writes an SVG path', () => {
    expect(toD([pts[0], { x: 720.04, y: 835.26 }])).toBe('M 720 770 L 720 835.3');
  });
});
