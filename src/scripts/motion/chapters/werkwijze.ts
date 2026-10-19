// 02 · Werkwijze (ADR-015): vier stappen, geen pin — elke stap scrubt terwijl hij door het beeld schuift
// (start 'top 80%', end 'center 50%'). Rail-ticks per stap lichten op zodra hun stap bereikt is.
// Mobiel: alleen fades per stap; de flow in "Automatiseren" loopt via CSS, los van JS.
import { gsap } from 'gsap';
import type { MotionContext } from '../context';

export function setup(c: MotionContext): void | (() => void) {
  const root = document.querySelector<HTMLElement>('#werkwijze');
  if (!root) return;

  const ticks = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-forge-tick]')].map((t) => [t.dataset.forgeTick!, t]),
  );
  const lightTick = (id: string, on: boolean) => ticks.get(id)?.toggleAttribute('data-lit', on);

  if (c.mobile) {
    root.querySelectorAll<HTMLElement>('.fl-step__visual').forEach((visual) => {
      gsap.from(visual, {
        autoAlpha: 0,
        y: 16,
        duration: c.tokens.durSlow,
        ease: 'power2.out',
        scrollTrigger: { trigger: visual, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });
    return;
  }

  const { random } = gsap.utils;
  const cleanups: (() => void)[] = [];

  // 01 · In kaart — nodes vallen vanuit een chaos-transform op hun plek, daarna de tags.
  const kaart = root.querySelector<HTMLElement>('[data-step="kaart"]');
  if (kaart) {
    const nodes = gsap.utils.toArray<HTMLElement>('.wk-map__node', kaart);
    const tags = kaart.querySelectorAll<HTMLElement>('.wk-map__pain');
    const setChaos = (node: HTMLElement, chaos: boolean) => (node.dataset.state = chaos ? 'chaos' : 'mapped');
    nodes.forEach((n) => setChaos(n, true));

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: kaart,
        start: 'top 80%',
        end: 'center 50%',
        scrub: 0.6,
        onEnter: () => lightTick('kaart', true),
        onLeaveBack: () => lightTick('kaart', false),
      },
    });
    nodes.forEach((node, i) => {
      tl.fromTo(
        node,
        { x: random(-80, 80), y: random(-60, 60), rotation: random(-6, 6) },
        {
          x: 0,
          y: 0,
          rotation: 0,
          onUpdate() {
            setChaos(node, this.progress() < 0.85);
          },
        },
        i * 0.08,
      );
    });
    tl.from(tags, { autoAlpha: 0, y: 8, stagger: 0.15, ease: 'power2.out' }, 0.5);
    cleanups.push(() => nodes.forEach((n) => setChaos(n, false)));
  }

  // 02 · Standaardiseren — afwijkende chips vervagen, curves trekken recht, standaardstappen krijgen ink-rand.
  const standaard = root.querySelector<HTMLElement>('[data-step="standaard"]');
  if (standaard) {
    const nodes = gsap.utils.toArray<HTMLElement>('.wk-std__nodes .fl-node', standaard);
    const setStandard = (on: (i: number) => boolean) =>
      nodes.forEach((n, i) => (n.dataset.state = on(i) ? 'standard' : 'mapped'));
    const thresholds = nodes.map((_, i) => 0.5 + i * 0.12);
    setStandard(() => false);

    gsap
      .timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: standaard,
          start: 'top 80%',
          end: 'center 50%',
          scrub: 0.6,
          onUpdate: (self) => setStandard((i) => self.progress >= thresholds[i]),
          onEnter: () => lightTick('standaard', true),
          onLeaveBack: () => lightTick('standaard', false),
        },
      })
      .to(standaard.querySelectorAll('[data-deviation]'), { autoAlpha: 0.25 }, 0)
      .to(standaard.querySelectorAll('.wk-std__merge .fl-wire--chaos'), { strokeDasharray: '10 0' }, 0.3);
    cleanups.push(() => setStandard(() => true));
  }

  // 03 · Automatiseren — de oranje lijn tekent zich, nodes met mode "auto" gaan één voor één aan
  // (ook terug bij terugscrollen); de "Mens"-node blijft standard. Daarna wordt de flow zichtbaar.
  const automatisch = root.querySelector<HTMLElement>('[data-step="automatisch"]');
  if (automatisch) {
    const line = automatisch.querySelector<HTMLElement>('.wk-auto__line')!;
    const flow = automatisch.querySelector<HTMLElement>('.wk-auto__flow')!;
    const end = automatisch.querySelector<HTMLElement>('.wk-auto__end')!;
    const autoNodes = [...automatisch.querySelectorAll<HTMLElement>('[data-mode="auto"]')].map((item) =>
      item.querySelector<HTMLElement>('.fl-node')!,
    );
    autoNodes.forEach((n) => (n.dataset.state = 'standard'));

    const isRow = () => line.offsetWidth > line.offsetHeight;
    let thresholds = autoNodes.map(() => 0);
    const measure = () => {
      const row = isRow();
      const scale = gsap.getProperty(line, row ? 'scaleX' : 'scaleY') as number;
      gsap.set(line, { scaleX: 1, scaleY: 1 });
      const l = line.getBoundingClientRect();
      thresholds = autoNodes.map((n) => {
        const r = n.getBoundingClientRect();
        const along = row
          ? (r.left + r.width / 2 - l.left) / l.width
          : (r.top + r.height / 2 - l.top) / l.height;
        return gsap.utils.clamp(0, 1, along);
      });
      gsap.set(line, {
        [row ? 'scaleX' : 'scaleY']: scale,
        transformOrigin: row ? 'left center' : 'center top',
      });
    };
    const apply = (progress: number) =>
      autoNodes.forEach((n, i) => (n.dataset.state = progress >= thresholds[i] ? 'automated' : 'standard'));

    const row = isRow();
    gsap.set(line, { [row ? 'scaleX' : 'scaleY']: 0, transformOrigin: row ? 'left center' : 'center top' });
    gsap.set([flow, end], { autoAlpha: 0 });
    measure();
    apply(0);

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: automatisch,
          start: 'top 80%',
          end: 'center 50%',
          scrub: 0.6,
          onRefresh: () => measure(),
          onUpdate: (self) => apply(self.progress),
          onEnter: () => lightTick('automatisch', true),
          onLeaveBack: () => lightTick('automatisch', false),
        },
      })
      .to(line, { [row ? 'scaleX' : 'scaleY']: 1 }, 0)
      .to(end, { autoAlpha: 1, duration: 0.05 }, 0.75)
      .to(flow, { autoAlpha: 1, duration: 0.2 }, 0.8);
    cleanups.push(() => {
      thresholds = thresholds.map(() => 1);
      apply(1);
    });
  }

  // 04 · Eerlijk advies — geen scroll-animatie; de kaart fadet eenmalig in.
  const advies = root.querySelector<HTMLElement>('[data-step="advies"]');
  if (advies) {
    gsap.from(advies.querySelector('.fl-verdict'), {
      autoAlpha: 0,
      y: 16,
      duration: c.tokens.durSlow,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: advies,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        onEnter: () => lightTick('advies', true),
        onLeaveBack: () => lightTick('advies', false),
      },
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    ticks.forEach((t) => t.removeAttribute('data-lit'));
  };
}
