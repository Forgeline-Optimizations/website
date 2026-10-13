// 07 · Over mij: rustig. Foto en tekst faden eenmalig in; de oranje streep onder de foto groeit aan.
import { gsap } from 'gsap';
import type { MotionContext } from '../context';

export function setup(c: MotionContext): void {
  const root = document.querySelector<HTMLElement>('[data-motion="over-mij"]');
  if (!root) return;
  const photo = root.querySelector<HTMLElement>('.fl-profile__photo');

  const tl = gsap.timeline({
    defaults: { duration: c.tokens.durSlow, ease: 'power2.out' },
    scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none none' },
  });
  tl.from(root.children, { autoAlpha: 0, y: 16, stagger: 0.12 });
  if (photo) tl.fromTo(photo, { '--fl-stripe': 0 }, { '--fl-stripe': 1 }, '-=0.3');
}
