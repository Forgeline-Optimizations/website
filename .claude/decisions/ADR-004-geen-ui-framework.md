# ADR-004: Geen UI-framework; interactie in vanilla TypeScript

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
Er zijn twee interactieve onderdelen: het verdict-paneel (`#oordeel`) en het contactformulier. Het eerdere stackvoorstel liet ruimte voor Svelte- of Preact-islands.

## Beslissing
Geen UI-framework. Beide onderdelen worden server-side volledig gerenderd door Astro en krijgen gedrag via kleine TypeScript-modules in `src/scripts/` (geladen via een `<script>` in de component). State zit in DOM-attributen (`aria-pressed`, `hidden`).

## Onderbouwing
De interactie is klein (één keuze uit vijf, één formulier). Een framework-runtime kost kilobytes en Lighthouse-punten zonder iets toe te voegen. Server-side gerenderde HTML werkt bovendien zonder JS.

## Overwogen alternatieven
- **Svelte/Preact island:** prima ergonomie, maar onnodige runtime voor deze schaal.
- **Alpine.js:** extra afhankelijkheid voor iets wat 40 regels TS is.

## Gevolgen
- Alle verdict-inhoud staat in de HTML (zichtbaar of `hidden`), dus vindbaar en leesbaar zonder JS.
- Wordt een onderdeel later echt complex (bijv. een interactieve proceskaart), dan eerst een nieuwe ADR.
