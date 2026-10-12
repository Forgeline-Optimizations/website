# ADR-010: Kwaliteitsgate — Lighthouse ≥ 95 in CI

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
De site moet de belofte "production-grade" zelf waarmaken. Scroll-animatie mag niet ten koste gaan van snelheid of toegankelijkheid.

## Beslissing
- Lighthouse ≥ 0,95 op Performance, Accessibility, Best Practices en SEO, op desktop én mobiel profiel, gemeten met Lighthouse CI op de gebouwde site (`/`, `/request-received`, `/privacy`). Faalt de gate, dan faalt de pipeline.
- JavaScript-budget is een richtlijn (± 200 KB gecomprimeerd totaal), geen harde eis.
- Toegankelijkheid daarnaast getest met axe via Playwright: nul overtredingen van niveau "serious" of "critical".

## Onderbouwing
Een meetbare gate voorkomt sluipend verval naarmate er beweging bij komt.

## Overwogen alternatieven
- **Handmatig meten:** wordt vergeten.
- **Strikt JS-budget van 200 KB:** te knellend met GSAP; de Lighthouse-score is de echte maat.

## Gevolgen
- Lighthouse CI wordt in fase 5 aan de workflow toegevoegd en vanaf dan bij elke push gedraaid.
- Afbeeldingen via Astro `<Image>` (AVIF/WebP, juiste maten), GSAP pas na eerste paint laden.
