# ADR-011: `@astrojs/check`, `typescript` en `@types/node` als dev-afhankelijkheden

**Datum:** 2026-10-12
**Fase:** 1
**Status:** Geaccepteerd

## Context
`npm run check` draait `astro check` (CLAUDE.md, fase-1-plan stap 5). Dat commando heeft `@astrojs/check` en `typescript` nodig. Staan die er niet, dan vraagt Astro interactief om ze te installeren; in CI is er geen terminal en faalt de stap. Stap 2 van het fase-1-plan noemde ze niet.

## Beslissing
`@astrojs/check`, `typescript` en `@types/node` (major 22, gelijk aan de minimale Node-versie) worden dev-afhankelijkheden. `tsconfig.json` krijgt `"types": ["node"]`: TypeScript 6 laadt standaard geen globale types meer, waardoor `node:fs` in de unit-test niet gevonden werd.

## Onderbouwing
Het zijn de officiële, door Astro voorgeschreven pakketten voor `astro check`. Ze draaien alleen tijdens ontwikkeling en CI en komen niet in de gebouwde site.

## Overwogen alternatieven
- **`astro check` weglaten uit `npm run check`:** dan verdwijnt de typecontrole op `.astro`-bestanden, die CLAUDE.md eist.
- **`npx -p @astrojs/check astro check`:** werkt, maar zonder vaste versie in de lockfile; CI kan dan stil van gedrag veranderen.

## Gevolgen
- **Valkuil:** kan Astro `@astrojs/check` niet importeren, dan meldt het "requires the following dependency", slaat de check over en gaat `npm run check` toch door. Lokaal gebeurde dat door een onvolledige `node_modules` (ontbrekend `@emnapi/core`); `npm ci` loste het op. Staat die melding in de uitvoer, dan is de check níet gedraaid.
- Versies staan vast in `package-lock.json`.
- `tsconfig.json` heeft `"allowJs": true` zodat de unit-test `scripts/sync-tokens.mjs` kan importeren.
