// 03 · Standaardiseren (desktop, gepind): afwijkende chips vervagen, de drie banen schuiven samen, de
// gestippelde curves trekken recht, de standaardstappen krijgen hun ink-rand. Mobiel: alleen die stappen.
import { gsap } from 'gsap';
import type { MotionContext } from '../context';
import { pinIfFits } from './pin';

export function setup(c: MotionContext): void | (() => void) {
  const root = document.querySelector<HTMLElement>('[data-motion="standaard"]');
  if (!root) return;
  const nodes = gsap.utils.toArray<HTMLElement>('.std__nodes .fl-node', root);

  if (c.mobile) {
    gsap.from(nodes, {
      autoAlpha: 0,
      y: 16,
      stagger: 0.12,
      duration: c.tokens.durSlow,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: root.querySelector('.std__nodes') ?? root,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
    return;
  }

  const lanes = gsap.utils.toArray<HTMLElement>('.std__lane', root);
  const middle = (lanes.length - 1) / 2;
  // Vóór de beweging hebben de standaardstappen nog de gewone rand; ze krijgen ink op het eind.
  const setStandard = (on: (i: number) => boolean) =>
    nodes.forEach((n, i) => (n.dataset.state = on(i) ? 'standard' : 'mapped'));
  const thresholds = nodes.map((_, i) => 0.72 + i * 0.08);
  setStandard(() => false);

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: root,
      start: 'center 55%',
      end: '+=100%',
      scrub: 0.6,
      pin: pinIfFits(root),
      onUpdate: (self) => setStandard((i) => self.progress >= thresholds[i]),
    },
  });
  tl.to(root.querySelectorAll('[data-deviation]'), { autoAlpha: 0.25, duration: 0.3 }, 0)
    .to(lanes, { y: (i) => (middle - i) * 40, duration: 0.25 }, 0.2)
    .to(lanes, { y: 0, duration: 0.25 }, 0.45)
    .to(
      root.querySelectorAll('.std__merge .fl-wire--chaos'),
      { strokeDasharray: '10 0', duration: 0.2 },
      0.55,
    )
    .to({}, { duration: 0.25 }); // ruimte voor de ink-randen (via onUpdate)

  return () => setStandard(() => true);
}
