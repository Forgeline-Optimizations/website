# ADR-014: Mobiel hoofdstukraster volgt het storyboard (lijn x = 16, inhoud x = 40)

**Datum:** 2026-10-13
**Fase:** 2
**Status:** Geaccepteerd

## Context
Fase 1 legde in `layout.css` het mobiele raster vast als `padding-inline: 16px`, kolommen `16px | 1fr`, `column-gap: 24px`. Daarmee staat de forge line op x = 24 en begint de inhoud op x = 56. Het storyboard (`MobielHero`, `MobielOordeel`, `MobielAanbod`) en `docs/storyboard.md` → Mobiel zetten de lijn op x = 16 en de inhoud op x = 40, met 16px rechtermarge (inhoud 334 breed op 390). Het fase-1-plan noemt het raster een contract dat alleen met een ADR mag wijzigen.

Verder liet het fase-1-raster open waar het hoofdstuknummer op mobiel staat. Volgens het storyboard staat het boven de kop, in dezelfde kolom als de inhoud.

## Beslissing
Onder 900px:
- `.chapter__inner`: `padding-inline: var(--space-2) var(--space-4)` (8 / 16px), kolommen `16px minmax(0, 1fr)`, `column-gap: var(--space-4)` (16px). Lijn op 8 + 8 = **16**, inhoud op 8 + 16 + 16 = **40**, rechtermarge 16.
- `.chapter__rail` beslaat beide rijen (`grid-row: 1 / span 2`). `.chapter__num` staat in rij 1 en `.chapter__body` in rij 2, allebei in kolom 2.

Vanaf 900px blijft alles zoals in fase 1: `40px 160px 1fr`, nummer in kolom 2 en body in kolom 3, op dezelfde rij.

De kolomnamen (`chapter__rail`, `chapter__num`, `chapter__body`) blijven gelijk.

## Onderbouwing
Het storyboard is leidend voor maten (CLAUDE.md). De wijziging raakt alleen de mobiele padding en gap; desktop en de klassennamen blijven ongewijzigd, dus fase 4 (de SVG-lijn meet de rail-posities) merkt er niets van.

## Overwogen alternatieven
- **Fase-1-raster houden:** 16px minder tekstbreedte op een telefoon, en het wijkt zichtbaar af van de mobiele frames.

## Gevolgen
- `src/styles/layout.css` past de mobiele waarden aan.
- De hero gebruikt hetzelfde mobiele raster voor zijn lijn (x = 16), zodat de lijn op mobiel ononderbroken langs alle hoofdstukken loopt.
