/**
 * Eén plek die beslist óf en welke beweging draait (ADR-005). Hoofdstukmodules doen nooit zelf media
 * queries of reduced-motion-checks. Geladen vanuit BaseLayout (prop `motion`), lazy na `load`.
 * Reduced motion: geen enkele context matcht, dus niets gebeurt en alles blijft in de eindtoestand.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupForgeLine } from './forge-line';
import { readTokens, type MotionContext, type Setup } from './context';
import * as hero from './chapters/hero';
import * as werkwijze from './chapters/werkwijze';
import * as aanbod from './chapters/aanbod';
import * as overMij from './chapters/over-mij';
import * as contact from './chapters/contact';

gsap.registerPlugin(ScrollTrigger);

// Volgorde = volgorde op de pagina: pins moeten van boven naar beneden worden aangemaakt.
const chapters: { setup: Setup }[] = [hero, werkwijze, aanbod, overMij, contact];

const mm = gsap.matchMedia();
mm.add(
  {
    desktop: '(prefers-reduced-motion: no-preference) and (min-width: 900px)',
    mobile: '(prefers-reduced-motion: no-preference) and (max-width: 899.98px)',
  },
  (ctx) => {
    const { desktop, mobile } = ctx.conditions as { desktop: boolean; mobile: boolean };
    if (!desktop && !mobile) return;
    const c: MotionContext = { desktop, mobile, tokens: readTokens() };
    document.documentElement.classList.add('forge-js');
    // Attributen en klassen die GSAP niet zelf terugdraait (data-state, data-motion-*), ruimen de
    // hoofdstukken op in hun cleanup; tweens en ScrollTriggers ruimt de matchMedia-context op.
    const cleanups = [...chapters.map((ch) => ch.setup(c)), setupForgeLine(c)];
    ScrollTrigger.refresh();
    return () => {
      cleanups.forEach((fn) => fn?.());
      document.documentElement.classList.remove('forge-js');
    };
  },
);

// Saira laadt na de eerste paint; dan verschuift de layout een paar pixels. Daarna alles opnieuw meten.
document.fonts?.ready.then(() => ScrollTrigger.refresh());
