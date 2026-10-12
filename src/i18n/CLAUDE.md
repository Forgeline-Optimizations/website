# Module: i18n

**Verantwoordelijkheid:** alle zichtbare tekst van de site, per taal. Niet: bedrijfsgegevens die niet vertaald worden (`src/data/site.ts`).
**Fase:** 2 — ⏳

## Bestanden
- `nl.ts` — `export const nl = { … } as const` met de sleutels uit `docs/content-nl.md`.
- `types.ts` — `export type Dictionary = Widen<typeof nl>;` (zelfde vorm als `nl`, maar letterlijke strings verbreed tot `string`, anders zou `en.ts` exact de Nederlandse tekst moeten bevatten). Later: `export const en: Dictionary = …`.
- `index.ts` — `export type Locale = 'nl' | 'en'; export function t(locale: Locale): Dictionary` (valt terug op `nl`).

## Ontwerpkeuzes
- Geneste objecten per sectie (`hero`, `inzicht`, …), zoals de sleutels in `docs/content-nl.md`.
- Lijsten (nodes, stappen, beloftes) als arrays van objecten, niet als losse sleutels.
- Tekst met een link (privacy-checkbox) als drie delen: `before`, `linkText`, `after`.
- Na fase 2 is `nl.ts` de bron; `docs/content-nl.md` krijgt bovenaan de regel "Vervangen door `src/i18n/nl.ts`".
- Geen HTML in strings, op `<strong>` na voor de vetgedrukte namen in lijsten: gebruik daarvoor aparte velden (`label`, `text`).
