# Module: components

**Verantwoordelijkheid:** herbruikbare bouwstenen. `ui/` = componenten uit het design system; `site/` = site-chrome die één keer per pagina voorkomt. Niet: hoofdstukinhoud (dat is `src/sections/`).
**Fase:** 1–3 — 🔨

## Inventaris

| Component | Map | Design-system-bron | Props | Fase |
|---|---|---|---|---|
| `Button.astro` | ui | Button | `variant: 'primary' \| 'secondary' \| 'link'`, `size?: 'sm'`, `href?`, `type?`, `arrow?: boolean` | 1 |
| `SectionHeader.astro` | ui | SectionHeader | `kicker`, `title`, `lead?`, `number?` (toont `numeral`) , `level?: 2 \| 1` | 2 |
| `ProcessNode.astro` | ui | ProcessNode | `name`, `index?`, `state: 'chaos' \| 'mapped' \| 'standard' \| 'automated'`, `port?: boolean`, `rotate?: number` | 2 |
| `Badge.astro` | ui | VerdictCard (badge) | `verdict: 'go' \| 'wait' \| 'no'` | 2 |
| `Icon.astro` | ui | Iconografie | `name: 'arrow' \| 'pause' \| 'no' \| 'check' \| 'alert'` | 2 |
| `Field.astro` | ui | ContactForm (veld) | `id`, `name`, `label`, `type?`, `required?`, `autocomplete?`, `hint?`, `textarea?: boolean`, `optionalLabel?` | 3 |
| `ServiceCard.astro` | ui | ServiceStep | `num`, `kicker`, `title`, `text`, `items: string[]`, `meta`, `entry?: boolean`, `compact?: boolean` | 2 |
| `NavBar.astro` | site | NavBar | `locale` | 1 |
| `Footer.astro` | site | Footer | `locale` | 1 |
| `ForgeLine.astro` | site | ForgeLine | geen; rendert de SVG-laag + ticks | 2 (statisch), 4 (beweging) |
| `NextSteps.astro` | site | ContactForm (zijblok) | `locale` | 3 |
| `Analytics.astro` | site | — | geen; rendert Plausible alleen in productie | 6 |
| `StructuredData.astro` | site | — | geen; JSON-LD op `/` | 6 |
| `SkipLink.astro` | site | — | `locale` | 1 |

## Ontwerpkeuzes
- **Markup volgt het design system letterlijk.** Klassennamen en structuur uit `design/design-system/components/<Naam>/preview.html`; richtlijnen uit de bijbehorende `README.md`. Bij twijfel wint het design system, daarna het storyboard.
- **Geen tekst in componenten.** Alles komt binnen via props of `t()`; de enige uitzondering zijn ARIA-labels die je óók via `t()` haalt.
- **Iconen inline als SVG** met `aria-hidden="true"` en `currentColor`; definities in `Icon.astro`, gekopieerd uit `VerdictCard/preview.html` en `ContactForm/preview.html`.
- **Logo's als `<img>`** uit `public/brand/`, met `width`/`height`-attributen tegen layout shift. In de nav: wit op donker, zwart op licht, gewisseld met `fl-only-dark`/`fl-only-light`.
- **`ProcessNode` met `rotate`:** zet `style="--fl-rotate: Ndeg"` en laat CSS `transform: rotate(var(--fl-rotate))` doen, zodat GSAP later kan animeren zonder inline transforms te overschrijven.

## Afhankelijkheden
- Gebruikt: `src/styles/`, `src/i18n/`, `src/data/site.ts`.
- Gebruikt door: `src/sections/`, `src/layouts/`, `src/pages/`.
