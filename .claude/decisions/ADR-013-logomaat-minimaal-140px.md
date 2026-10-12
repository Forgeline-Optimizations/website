# ADR-013: Horizontaal logo minimaal 140px breed, ook in nav en footer

**Datum:** 2026-10-12
**Fase:** 1
**Status:** Geaccepteerd

## Context
De huisstijl eist dat het horizontale logo minimaal 140px breed is (`docs/brand.md`, design-system-README). Het storyboard en `bundle.css` zetten het logo in de nav op 34px hoog en in de footer op 32px. Met de verhouding van het bestand (viewBox 1637 × 494,2, dus 3,31 : 1) wordt het dan ± 113px en ± 106px breed: onder het minimum.

## Beslissing
Sander koos de grootste optie: het horizontale logo is overal **140 × 42px** (`width="140" height="42"`). Dat geldt voor de nav (desktop) en de footer. Het losse icoon in de mobiele nav blijft 32 × 32.

## Onderbouwing
De merkregel weegt zwaarder dan een maat op het board. 42px past ruim in de navhoogte van 72px. De `width`/`height`-attributen kloppen met de echte verhouding, zodat de browser de juiste ruimte vrijhoudt (geen layout shift).

## Overwogen alternatieven
- **34px hoog zoals het board:** ± 113px breed, onder het huisstijlminimum.

## Gevolgen
- `components.css` overschrijft `.fl-nav__logo img` en `.fl-footer img` naar `height: 42px`.
- Bij een nieuwe snapshot van het design system deze maat daar ook doorvoeren.
