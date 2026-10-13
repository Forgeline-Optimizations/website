// 08 · Contact: zodra de lijn de verzendknop bereikt, gloeit hij één keer kort op. Daarna niets meer.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from '../context';

export function setup(c: MotionContext): void {
  const button = document.querySelector<HTMLElement>('[data-forge-anchor="end"]');
  if (!button) return;
  // De gloed uit het thema van de knop zelf (Contact is licht; daar is --glow-forge een rand).
  const glow = getComputedStyle(button).getPropertyValue('--glow-forge').trim() || c.tokens.glow;

  ScrollTrigger.create({
    trigger: button,
    start: `center ${c.desktop ? 60 : 70}%`, // waar het kopje van de lijn staat (forge-line.ts)
    once: true,
    onEnter: () => {
      gsap.fromTo(
        button,
        { boxShadow: '0 0 0 0 transparent' },
        {
          boxShadow: glow,
          duration: 0.45,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          clearProps: 'boxShadow',
        },
      );
    },
  });
}
