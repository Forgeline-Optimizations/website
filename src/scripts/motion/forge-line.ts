/**
 * De forge line: één SVG-laag over <main> (ForgeLine.astro, part="layer"). Pad door de anchors uit de
 * markup: start (hero) → omlaag → naar links naar de rail → langs alle hoofdstukken omlaag → haak naar
 * de verzendknop. Het opgelichte deel loopt tot ± 60% van het scherm (mobiel 70%), met een gloeiend kopje.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from './context';
import { lengthAtY, makePath, partial, toD, type ForgePath, type Pt } from './forge-path';

/** Hoe ver onder de bovenkant van het eerste hoofdstuk (Werkwijze) de lijn naar links buigt. */
const BEND_BELOW_FIRST_CHAPTER = 80;
/** Het kopje (12 × 12) stopt met zijn rechterrand tegen de knop. */
const HEAD = 12;

export function buildPoints(main: HTMLElement): Pt[] | null {
  const box = main.getBoundingClientRect();
  const rect = (sel: string) => main.querySelector(sel)?.getBoundingClientRect();
  const start = rect('[data-forge-anchor="start"]');
  const rail = rect('[data-forge-anchor="chapter"]');
  const end = rect('[data-forge-anchor="end"]');
  if (!start || !rail || !end) return null;

  const sx = start.left + start.width / 2 - box.left;
  const sy = start.top + start.height / 2 - box.top;
  const railX = rail.left + rail.width / 2 - box.left;
  const firstChapter = main.querySelector('[data-forge-anchor="chapter"]')!.closest('section')!;
  const bendY = firstChapter.getBoundingClientRect().top - box.top + BEND_BELOW_FIRST_CHAPTER;
  const endY = end.top + end.height / 2 - box.top;
  const endX = end.left - box.left - HEAD / 2;
  return [
    { x: sx, y: sy },
    { x: sx, y: bendY },
    { x: railX, y: bendY },
    { x: railX, y: endY },
    { x: endX, y: endY },
  ];
}

export function setupForgeLine(c: MotionContext): () => void {
  const main = document.querySelector<HTMLElement>('main');
  const track = main?.querySelector<SVGPathElement>('[data-forge-track]');
  const lit = main?.querySelector<SVGPathElement>('[data-forge-lit]');
  const head = main?.querySelector<SVGRectElement>('[data-forge-head]');
  if (!main || !track || !lit || !head) return () => {};

  const screenPoint = c.desktop ? 0.6 : 0.7;
  let path: ForgePath = makePath([]);
  let mainTop = 0;
  let lastLen = -1;

  const measure = () => {
    const pts = buildPoints(main);
    path = makePath(pts ?? [], c.desktop ? 120 : 60);
    mainTop = main.getBoundingClientRect().top + scrollY;
    track.setAttribute('d', toD(path.pts));
    lastLen = -1;
  };

  const render = () => {
    if (!path.pts.length) return;
    const atBottom = scrollY >= document.documentElement.scrollHeight - innerHeight - 2;
    const y = scrollY + innerHeight * screenPoint - mainTop;
    const len = atBottom ? path.total : lengthAtY(path, y);
    if (Math.abs(len - lastLen) < 0.5) return;
    lastLen = len;
    const drawn = partial(path, len);
    lit.setAttribute('d', drawn.length > 1 ? toD(drawn) : '');
    const p = drawn[drawn.length - 1];
    head.setAttribute('x', String(p.x - HEAD / 2));
    head.setAttribute('y', String(p.y - HEAD / 2));
  };

  measure();
  render();
  ScrollTrigger.create({
    trigger: main,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: render,
    onRefresh: () => {
      measure();
      render();
    },
  });

  // Hoogte van <main> verandert (afbeeldingen, fonts, pins): opnieuw meten, één keer per golf.
  let timer = 0;
  let first = true;
  const ro = new ResizeObserver(() => {
    if (first) return void (first = false);
    clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
  });
  ro.observe(main);

  return () => {
    ro.disconnect();
    clearTimeout(timer);
    track.removeAttribute('d');
    lit.removeAttribute('d');
  };
}
