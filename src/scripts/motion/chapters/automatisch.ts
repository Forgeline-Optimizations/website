// 04 · Automatiseren (desktop, gepind): de oranje lijn tekent zich; elke node gaat aan zodra de lijn hem
// bereikt (data-state → automated, met de gloed uit het design system) en zijn chip toont oud → nieuw;
// als alles aan is, verschijnt de flow. Mobiel: de stappen faden in; de flow loopt gewoon (CSS).
import { gsap } from 'gsap';
import type { MotionContext } from '../context';
import { pinIfFits } from './pin';

/** Deel van de tijdlijn waarin de lijn groeit; daarna verschijnt de flow. */
const DRAW = 0.8;

export function setup(c: MotionContext): void | (() => void) {
  const root = document.querySelector<HTMLElement>('[data-motion="automatisch"]');
  if (!root) return;
  const steps = gsap.utils.toArray<HTMLElement>('.auto__step', root);

  if (c.mobile) {
    gsap.from(steps, {
      autoAlpha: 0,
      y: 16,
      stagger: 0.12,
      duration: c.tokens.durSlow,
      ease: 'power2.out',
      scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
    return;
  }

  const line = root.querySelector<HTMLElement>('.auto__line')!;
  const flow = root.querySelector<HTMLElement>('.auto__flow')!;
  const end = root.querySelector<HTMLElement>('.auto__end')!;
  // Alleen de stappen die op het board automatisch zijn; "Controle planner" blijft mensenwerk.
  const auto = steps
    .map((step) => ({
      node: step.querySelector<HTMLElement>('.fl-node')!,
      chip: step.querySelector<HTMLElement>('.auto__result'),
    }))
    .filter(({ node }) => node.dataset.state === 'automated');

  // Waar langs de lijn ligt het midden van elke node (0–1)? Opnieuw bij elke refresh (andere breedte).
  let thresholds = auto.map(() => 0);
  // offsetWidth/-Height negeren transforms: ook een ingeklapte lijn geeft de juiste richting.
  const isRow = () => line.offsetWidth > line.offsetHeight;
  const measure = () => {
    const row = isRow();
    // Gemeten zonder schaal: de lijn kan op dat moment (deels) ingeklapt zijn.
    const scale = gsap.getProperty(line, row ? 'scaleX' : 'scaleY') as number;
    gsap.set(line, { scaleX: 1, scaleY: 1 });
    const l = line.getBoundingClientRect();
    thresholds = auto.map(({ node }) => {
      const n = node.getBoundingClientRect();
      const along = row
        ? (n.left + n.width / 2 - l.left) / l.width
        : (n.top + n.height / 2 - l.top) / l.height;
      return DRAW * gsap.utils.clamp(0, 1, along);
    });
    gsap.set(line, {
      [row ? 'scaleX' : 'scaleY']: scale,
      transformOrigin: row ? 'left center' : 'center top',
    });
  };
  const apply = (progress: number) =>
    auto.forEach(({ node, chip }, i) => {
      const on = progress >= thresholds[i];
      node.dataset.state = on ? 'automated' : 'standard';
      chip?.classList.toggle('is-before', !on);
    });

  const row = isRow();
  measure();
  apply(0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'center 55%',
      end: '+=120%',
      scrub: 0.6,
      pin: pinIfFits(root),
      onRefresh: (self) => {
        measure();
        apply(self.progress);
      },
      onUpdate: (self) => apply(self.progress),
    },
  });
  tl.from(line, { [row ? 'scaleX' : 'scaleY']: 0, duration: DRAW, ease: 'none' }, 0)
    .from(end, { autoAlpha: 0, duration: 0.05 }, DRAW - 0.05)
    .from(flow, { autoAlpha: 0, duration: 1 - DRAW }, DRAW);

  return () => {
    thresholds = thresholds.map(() => 0);
    apply(1);
  };
}
