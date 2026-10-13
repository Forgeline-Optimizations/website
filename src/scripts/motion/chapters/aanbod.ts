// 06 · Aanbod: "het licht gaat aan" (desktop: lichte laag over de onderrand van Oordeel) en de drie
// kaarten komen binnen (fade + 16px omhoog). Mobiel: alleen de kaarten.
import { gsap } from 'gsap';
import type { MotionContext } from '../context';

export function setup(c: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-motion="aanbod"]');
  const dawn = document.querySelector<HTMLElement>('[data-motion="dawn"]');
  if (!root) return;

  if (c.desktop && dawn) {
    gsap.to(dawn, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: '#aanbod', start: 'top bottom', end: 'top 40%', scrub: true },
    });
  }

  gsap.from(root.querySelectorAll('.fl-service'), {
    autoAlpha: 0,
    y: 16,
    stagger: 0.12,
    duration: c.tokens.durSlow,
    ease: 'power2.out',
    scrollTrigger: { trigger: root, start: 'top 70%', toggleActions: 'play none none none' },
  });
}
