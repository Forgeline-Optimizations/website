# ADR-005: Scroll-beweging met GSAP ScrollTrigger, geen 3D

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
De site moet "automatisering laten afspatten" maar professioneel en minimaal blijven, voor een niet-technisch publiek dat ook op oudere laptops en telefoons kijkt.

## Beslissing
GSAP met ScrollTrigger (en DrawSVG of `stroke-dashoffset` voor de lijn). Lenis voor soepel scrollen is optioneel en mag alleen aan als Lighthouse ≥ 95 blijft en nooit bij reduced motion. Geen Three.js, React Three Fiber of WebGL-shaders. Alle animatie in `gsap.matchMedia()`:
- `(prefers-reduced-motion: no-preference) and (min-width: 900px)`: volledige set.
- `(prefers-reduced-motion: no-preference) and (max-width: 899px)`: vereenvoudigde set (alleen lijn + fades).
- `(prefers-reduced-motion: reduce)`: niets; alles in eindtoestand.

## Onderbouwing
GSAP is de standaard voor scroll-verhalen, is gratis inclusief plugins, en met `matchMedia` zijn reduced motion en mobiel netjes af te handelen. 3D trekt de aandacht naar de techniek in plaats van naar het aanbod en kost prestaties.

## Overwogen alternatieven
- **CSS scroll-driven animations:** veelbelovend, maar browsersteun en tijdlijnbesturing nog te beperkt voor de choreografie in hoofdstuk 01–04.
- **Motion One / Framer Motion:** kleiner of React-gebonden; minder sterk in gescrubde tijdlijnen.
- **Three.js-scène:** zwaar, afleidend, slecht op oudere apparaten.

## Gevolgen
- Eén bewegend idee per scherm; de choreografie staat in `docs/storyboard.md`.
- Zonder JS of met reduced motion staat alles in de eindtoestand; de inhoud is nooit afhankelijk van animatie.
- GSAP alleen importeren in `src/scripts/motion/`, nergens anders.
