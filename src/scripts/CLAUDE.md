# Module: scripts

**Verantwoordelijkheid:** al het client-side gedrag. `verdict.ts` en `contact-form.ts` (fase 3), `nav-progress.ts` (fase 2/4), `motion/` (fase 4). Niet: inhoud of opmaak.
**Fase:** 2–4 — ✓

## Bestanden
| Bestand | Rol | Fase |
|---|---|---|
| `nav-progress.ts` | `initNavProgress()`: IntersectionObserver zet `aria-current="step"`/`is-done` en het `data-theme` van de nav; `--progress` voor de mobiele balk (scroll via `requestAnimationFrame`) | 2 ✓ |
| `verdict.ts` | `initVerdict(root)`: stapknoppen ↔ paneel; `aria-pressed`, `data-active` op het paneel (niet `hidden`: `.fl-verdict__panel` heeft `display: flex`), pijltjestoetsen over de zichtbare knoppen (mobiel slaat `inkoop` over). Na de eerste keuze zet hij `data-switched` op de root; alleen dan vervaagt een nieuw paneel in | 3 ✓ |
| `contact-form.ts` | `initContactForm(form)`: zet zelf `novalidate` (zonder JS blijft browservalidatie het vangnet), Nederlandse fouten per `[data-field]` uit `data-messages`, `aria-invalid`/`aria-describedby`, `fetch` (JSON) naar Web3Forms, dan `location.assign` naar het **pad** van `redirect` (zelfde domein, ook lokaal); bij een fout de `[data-form-status]`-melding en velden behouden. E-mail strenger dan de browser: `naam@domein` zonder punt is fout | 3 ✓ |
| `motion/index.ts` | GSAP + ScrollTrigger, één `gsap.matchMedia()` (desktop/mobiel; reduced = niets), zet `html.forge-js`, roept de hoofdstukken in paginavolgorde aan (pins van boven naar beneden), daarna de lijn; `ScrollTrigger.refresh()` na `document.fonts.ready` | 4 ✓ |
| `motion/context.ts` | Types (`MotionContext`, `Setup`) en `readTokens()` (duur in s, `--glow-forge`). Los van `index.ts` tegen kringverwijzingen | 4 ✓ |
| `motion/forge-path.ts` | Rekenwerk zonder DOM (unit-getest): pad uit rechte H/V-stukken, exacte lengtes, `lengthAtY` (scrollhoogte → getekende lengte; horizontale stukken krijgen `bendSpan` virtuele hoogte zodat een bocht niet in één frame verschijnt), `partial`, `toD` | 4 ✓ |
| `motion/forge-line.ts` | Pad door de anchors (`start` → buigt 80px onder de bovenkant van Inzicht naar de rail → omlaag → haak naar `end`); opgelicht deel = nieuw `d`-pad tot de lengte (geen dasharray); kopje op 60% (mobiel 70%) van het scherm, aan het eind van de pagina altijd volledig. Opnieuw meten bij `refresh` en via `ResizeObserver` op `<main>` | 4 ✓ |
| `motion/chapters/*.ts` | Eén `setup(c)` per hoofdstuk; geeft optioneel een cleanup terug voor wat GSAP niet zelf terugzet (`data-state`, klassen). Staten wisselen via `data-state` + de CSS-transities uit het design system, niet via getweende kleuren. `pin.ts`: pinnen alleen als het blok ≤ 80% van de schermhoogte is | 4 ✓ |

## Ontwerpkeuzes
- **Progressive enhancement.** Elk script begint met de HTML zoals die zonder JS werkt, en voegt alleen gedrag toe. Het `<html>` krijgt in `BaseLayout` als eerste inline script `document.documentElement.classList.add('js')`; CSS voor JS-afhankelijke staten hangt aan `.js`.
- **Motion lazy laden.** `motion/index.ts` wordt geïmporteerd via `requestIdleCallback` (fallback `setTimeout(…, 1)`) na `load`, zodat GSAP de eerste paint niet blokkeert.
- **Eén `gsap.matchMedia()`** in `motion/index.ts` met drie contexten (desktop, mobiel, reduced). Hoofdstukmodules exporteren `function setup(ctx: MotionContext): void` en maken nooit zelf media queries.
- **Selectors alleen via `data-motion` en `data-chapter`.** Klassen kunnen veranderen; data-attributen zijn het contract tussen markup en motion.
- **Geen layout-thrashing:** posities voor het lijnpad één keer meten bij `ScrollTrigger.refresh` en bij `ResizeObserver` op `<main>`, niet per frame.

## Valkuilen (fase 4)
- **`from()` leest eindwaarden lazy.** Zet je vlak na het bouwen een staat die de transform verandert (Inzicht: `data-state="chaos"` draait de node via CSS), dan wordt dát de eindwaarde. Gebruik `fromTo` met expliciete eindwaarden.
- **Richting van een ingeklapte lijn** (Automatisch): `getBoundingClientRect` ziet de schaal; gebruik `offsetWidth/offsetHeight`.
- **CSS-transitie op transform** (`.fl-node`) laat GSAP naijlen: onder `html.forge-js` alleen nog `border-color, box-shadow`.

## Afhankelijkheden
- `gsap` (incl. ScrollTrigger), optioneel `lenis` (alleen met ADR-005-voorwaarden).
- Leest data-attributen uit `src/sections/` en `src/components/site/ForgeLine.astro`.
