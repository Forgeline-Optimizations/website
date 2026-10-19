# Module: components

**Verantwoordelijkheid:** herbruikbare bouwstenen. `ui/` = componenten uit het design system; `site/` = site-chrome die één keer per pagina voorkomt. Niet: hoofdstukinhoud (dat is `src/sections/`).
**Fase:** 1–4 — ✓

## Inventaris

| Component | Map | Design-system-bron | Props | Fase |
|---|---|---|---|---|
| `Button.astro` | ui | Button | `variant: 'primary' \| 'secondary' \| 'link'`, `size?: 'sm'`, `href?`, `type?`, `arrow?: boolean` | 1 |
| `SectionHeader.astro` | ui | SectionHeader | `kicker`, `title`, `lead?`, `titleId`, `level?: 2 \| 1` (het nummer staat in `Chapter`) | 2 ✓ |
| `ProcessNode.astro` | ui | ProcessNode | `name`, `index?`, `state: 'chaos' \| 'mapped' \| 'standard' \| 'automated'`, `port?: boolean`, `rotate?: number` | 2 |
| `Badge.astro` | ui | VerdictCard (badge) | `verdict: 'rules' \| 'ai' \| 'wait' \| 'no'` (fase 7: `go` → `rules` + nieuw `ai`, voor het onderscheid automatiseren met/zonder AI, [ADR-015](../../.claude/decisions/ADR-015-verhaal-inkorten.md)) | 2, 7 |
| `Icon.astro` | ui | Iconografie | `name: 'arrow' \| 'ai' \| 'pause' \| 'no' \| 'check' \| 'alert'` (`ai` sinds fase 7) | 2, 7 |
| `Field.astro` | ui | ContactForm (veld) | `id`, `name`, `label`, `type?`, `required?`, `autocomplete?`, `hint?`, `placeholder?`, `textarea?: boolean`, `optionalLabel?`, `full?`; rendert `[data-field]` met een verborgen `[data-error]` (`{id}-error`) voor `contact-form.ts` | 3 ✓ |
| `ServiceCard.astro` | ui | ServiceStep | `num`, `kicker`, `title`, `text`, `items: string[]`, `meta`, `entry?: boolean` (mobiel compact via CSS, geen prop) | 2 ✓ |
| `NavBar.astro` | site | NavBar | `locale`, `showChapters?`; laadt `nav-progress.ts` | 1 ✓, 2 ✓ |
| `Footer.astro` | site | Footer | `locale` | 1 |
| `ForgeLine.astro` | site | ForgeLine | `part: 'start' \| 'end' \| 'layer'`, `locale?`: begin (Hero), eindhaak (Contact) en de SVG-laag (eerste kind van `<main>` op `/`, alleen zichtbaar onder `html.forge-js`) | 2 ✓, 4 ✓ |
| `MotionLoader.astro` | site | — | geen; laadt `src/scripts/motion` na `load` + idle. Gerenderd door `BaseLayout` als `motion` aan staat (alleen `/`) | 4 ✓ |
| `Chapter.astro` | site | SectionHeader + raster | `id`, `num`, `theme`, `kicker`, `title`, `lead?`, `end?`; slot (default) = inhoud, slot `rail` = extra rail-markeringen voor een hoofdstuk met meerdere stappen (fase 7: Werkwijze's vier `fl-tick`s) | 2 ✓, 7 |
| `NextSteps.astro` | site | ContactForm (zijblok) | `locale`, `id` (uniek per pagina), `level?: 2 \| 3` (kop: 3 in Contact, 2 op `/request-received`), `class?` | 3 ✓ |
| `Analytics.astro` | site | — | geen; Plausible-snippet ongewijzigd, script-URL uit `site.plausibleScriptSrc`. `BaseLayout` rendert hem alleen als `import.meta.env.PROD` en de URL gevuld is | 6 ✓ (vervroegd) |
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
