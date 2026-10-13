// 01 · Chaos: de nodes zweven licht en de gestippelde lijnen lopen langzaam in elkaar (storyboard, bij laden).
// Alleen desktop; mobiel staat het veld stil.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from '../context';

export function setup(c: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-motion="hero-chaos"]');
  if (!c.desktop || !root) return;

  const { random } = gsap.utils;
  const tweens: gsap.core.Tween[] = gsap.utils.toArray<HTMLElement>('.fl-node', root).map((node) => {
    // GSAP schrijft één inline transform; zonder dit zou x/y de CSS-rotatie (--fl-rotate) wissen.
    // Daarom de rotatie eerst overnemen in GSAP; html.forge-js zet de transform-transitie uit.
    const deg = parseFloat(getComputedStyle(node).getPropertyValue('--fl-rotate')) || -3;
    gsap.set(node, { rotation: deg });
    return gsap.to(node, {
      x: random(-2, 2),
      y: random(-3, 3),
      duration: random(2.4, 3.6),
      delay: random(0, 1.5),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });
  // Streep-patroon 4 + 6 = 10: een verschuiving van 40 loopt naadloos rond.
  tweens.push(
    gsap.to(root.querySelectorAll('.fl-wire--chaos'), {
      strokeDashoffset: -40,
      duration: 6,
      ease: 'none',
      repeat: -1,
    }),
  );

  // Buiten beeld stilzetten: scheelt CPU op oudere laptops.
  ScrollTrigger.create({
    trigger: '#chaos',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => tweens.forEach((t) => t.paused(!self.isActive)),
  });
}
