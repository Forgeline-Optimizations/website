/**
 * Rekenwerk voor de forge line, zonder DOM (unit-getest in tests/unit/forge-path.test.ts).
 * Het pad bestaat alleen uit rechte stukken met 90°-hoeken die omlaag of opzij lopen, dus lengtes en punten
 * zijn exact te berekenen; geen getTotalLength/getPointAtLength per scroll-frame.
 *
 * Scroll → lengte: het kopje volgt een vaste hoogte op het scherm (y). Een horizontaal stuk heeft geen
 * hoogte; zonder correctie zou het in één frame verschijnen. Daarom krijgt elk horizontaal stuk een
 * "virtuele" hoogte (`bendSpan` boven en onder de hoek), geleend van de verticale stukken ernaast.
 */
export type Pt = { x: number; y: number };
export type ForgePath = {
  pts: Pt[];
  /** Cumulatieve lengte tot elk punt. */
  lens: number[];
  total: number;
  /** Virtuele y per punt: daar staat de scrollhoogte waarbij het pad tot dat punt getekend is. */
  keys: number[];
};

export function makePath(points: Pt[], bendSpan = 120): ForgePath {
  // Punten die samenvallen (bijv. mobiel: start en rail op dezelfde x) geven stukken van lengte 0.
  const pts = points.filter((p, i) => i === 0 || p.x !== points[i - 1].x || p.y !== points[i - 1].y);
  const lens = [0];
  for (let i = 1; i < pts.length; i++) {
    lens.push(lens[i - 1] + Math.abs(pts[i].x - pts[i - 1].x) + Math.abs(pts[i].y - pts[i - 1].y));
  }
  const keys = pts.map((p) => p.y);
  for (let i = 0; i < pts.length - 1; i++) {
    if (pts[i].y !== pts[i + 1].y) continue;
    const k = Math.min((lens[i + 1] - lens[i]) / 2, bendSpan);
    keys[i] = pts[i].y - k;
    keys[i + 1] = pts[i].y + k;
  }
  // Strikt oplopend houden; een te kort stuk vóór een hoek wordt dan direct getekend.
  for (let i = 1; i < keys.length; i++) keys[i] = Math.max(keys[i], keys[i - 1] + 0.001);
  return { pts, lens, total: lens[lens.length - 1] ?? 0, keys };
}

/** Getekende lengte bij een scrollhoogte y (in dezelfde coördinaten als het pad). */
export function lengthAtY(path: ForgePath, y: number): number {
  const { keys, lens } = path;
  if (!keys.length || y <= keys[0]) return 0;
  if (y >= keys[keys.length - 1]) return path.total;
  let lo = 0;
  let hi = keys.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (keys[mid] <= y) lo = mid;
    else hi = mid;
  }
  const t = (y - keys[lo]) / (keys[hi] - keys[lo]);
  return lens[lo] + t * (lens[hi] - lens[lo]);
}

/** De punten van het pad tot lengte `len`, met het tussenpunt als laatste. */
export function partial(path: ForgePath, len: number): Pt[] {
  const { pts, lens } = path;
  if (!pts.length) return [];
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (lens[i] <= len) {
      out.push(pts[i]);
      continue;
    }
    const t = (len - lens[i - 1]) / (lens[i] - lens[i - 1]);
    if (t > 0) {
      out.push({
        x: pts[i - 1].x + t * (pts[i].x - pts[i - 1].x),
        y: pts[i - 1].y + t * (pts[i].y - pts[i - 1].y),
      });
    }
    break;
  }
  return out;
}

export function toD(pts: Pt[]): string {
  return pts.map((p, i) => `${i ? 'L' : 'M'} ${round(p.x)} ${round(p.y)}`).join(' ');
}

const round = (n: number) => Math.round(n * 10) / 10;
