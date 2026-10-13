// 02 · Inzicht: de stappen uit de hero vallen op hun plek (rand van gestippeld naar massief), de
// verbindingen trekken zich, daarna verschijnen de knelpunten één voor één. Mobiel: alleen de knelpunten.
import { gsap } from 'gsap';
import type { MotionContext } from '../context';

export function setup(c: MotionContext): void | (() => void) {
  const root = document.querySelector<HTMLElement>('[data-motion="inzicht-map"]');
  if (!root) return;
  const pains = root.querySelectorAll<HTMLElement>('.map__pain');

  if (c.mobile) {
    gsap.from(pains, {
      autoAlpha: 0,
      y: 8,
      stagger: 0.15,
      duration: c.tokens.durSlow,
      ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
    return;
  }

  const nodes = gsap.utils.toArray<HTMLElement>('.map__node', root);
  const links = root.querySelectorAll<HTMLElement>('.map__link');
  // Rij (≥ 1280px) of stapel: bepaalt de richting waarin de verbindingen groeien. Gemeten, geen media query.
  const row = getComputedStyle(root).flexDirection === 'row';
  const { random } = gsap.utils;

  // De chaos-staat (gestippeld, gedimde naam) via data-state, zodat de CSS uit het design system het doet.
  const setState = (node: HTMLElement, chaos: boolean) => (node.dataset.state = chaos ? 'chaos' : 'mapped');

  const tl = gsap.timeline({
    scrollTrigger: { trigger: root, start: 'top 75%', end: 'center 55%', scrub: 0.6 },
    defaults: { ease: 'power2.inOut' },
  });
  nodes.forEach((node, i) => {
    // fromTo met expliciete eindwaarden: GSAP leest beginwaarden lazy, en de chaos-staat draait de node in CSS.
    tl.fromTo(
      node,
      { x: random(-120, 120), y: random(-80, 80), rotation: random(-6, 6) },
      {
        x: 0,
        y: 0,
        rotation: 0,
        onUpdate() {
          setState(node, this.progress() < 0.85);
        },
      },
      i * 0.08,
    );
  });
  tl.from(
    links,
    {
      [row ? 'scaleX' : 'scaleY']: 0,
      transformOrigin: row ? 'left center' : 'center top',
      stagger: 0.08,
      ease: 'none',
    },
    0.4,
  );
  tl.from(pains, { autoAlpha: 0, y: 8, stagger: 0.15, ease: 'power2.out' });
  nodes.forEach((n) => setState(n, true));

  return () => nodes.forEach((n) => setState(n, false));
}
