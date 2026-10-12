# Module: styles

**Verantwoordelijkheid:** alle CSS van de site: tokens, Tailwind-koppeling, componentstijlen, layoutraster. Niet: animatie (dat is `src/scripts/motion/`).
**Fase:** 1 — 🔨

## Bestanden
| Bestand | Rol | Met de hand bewerken? |
|---|---|---|
| `tokens.css` | Gegenereerd uit `design/design-system/tokens.json` door `scripts/sync-tokens.mjs` | **Nee** |
| `global.css` | Ingang: `@import "tailwindcss"`, tokens, fonts, `@theme inline`, base | Ja |
| `components.css` | Port van `design/design-system/components/bundle.css` (`fl-`-klassen) | Ja, maar in sync met het design system houden |
| `layout.css` | `.chapter`, `.chapter__inner`, rail-kolom, thema-secties, raster-achtergrond | Ja |

## Ontwerpkeuzes
- **Thema's via attributen:** `:root, [data-theme="dark"]` en `[data-theme="light"]` definiëren dezelfde variabelen. Een sectie wordt licht door `data-theme="light"` op het `<section>`-element. Componenten weten niets van thema's.
- **Tailwind leest tokens, niet andersom.** In `global.css`:
  ```css
  @theme inline {
    --color-surface: var(--surface);
    --color-surface-raised: var(--surface-raised);
    --color-ink: var(--ink);
    --color-ink-muted: var(--ink-muted);
    --color-forge: var(--forge);
    /* … één regel per kleurtoken … */
    --font-heading: var(--font-display); /* niet --font-display: dat zou naar zichzelf verwijzen */
    --font-body: var(--font-sans);
  }
  ```
  `inline` zorgt dat utilities `var(--surface)` gebruiken en dus mee wisselen met het thema. Volledige versie: `.claude/docs/fase-1-fundament.md`, stap 6.
- **Tailwind-standaardpalet uit:** zet `--color-*: initial;` en `--font-*: initial;` in `@theme` zodat alleen tokenkleuren en -fonts bestaan; voorkomt per ongeluk `text-gray-500`.
- **De `.dc.html`-hulpklassen (`sb-*`)** uit `design/storyboard/styles/site.css` zijn storyboard-hulpjes. Neem alleen over wat de site echt nodig heeft (raster-achtergrond, rail, tick, tag, chip, wires) en hernoem ze naar `fl-`: `sb-grid` → `fl-grid-bg`, `sb-rail` → `fl-rail`, `sb-tick` → `fl-tick`, `sb-tag` → `fl-tag`, `sb-chip` → `fl-chip`, `sb-wire*` → `fl-wire*`.
- **Fluid koppen:** `display`, `numeral` en `h2` schalen met `clamp()` tussen de mobiele en desktopmaat uit het design system (bijv. `font-size: clamp(44px, 3.2vw + 26px, 72px)`).

## Afhankelijkheden
- Gebruikt: `design/design-system/tokens.json` (via script), `@fontsource/saira`.
- Gebruikt door: alles.

## Bekende valkuilen
- **Themalogo's (ADR-012).** `bundle.css` verbergt ze via `html:not([data-theme="light"])`, maar op de site staat het thema per blok. Een selector-paar als `[data-theme="dark"] .fl-only-light, [data-theme="light"] .fl-only-dark` verbergt in een licht blok binnen de donkere `<body>` **beide** logo's. Daarom: per thema `--fl-show-dark/--fl-show-light`, en `.fl-only-*` gebruikt `display: var(--fl-show-*, revert-layer)`, ongelaagd in `global.css`. `components.css` en `layout.css` staan in `@layer components`.
- **Specificiteit binnen de componentlaag.** `.fl-nav__logo img` (0,1,1) wint van een losse klasse (0,1,0). Site-aanvullingen die een logo-`img` raken schrijf je als `.fl-nav .fl-…`.
- **Tailwind-scan.** `global.css` sluit `design/`, `docs/`, `.claude/` en alle `*.md` uit (`@source not`); anders maakt Tailwind utilities aan voor klassennamen die alleen in documentatie staan.
