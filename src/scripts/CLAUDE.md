# Module: scripts

**Verantwoordelijkheid:** al het client-side gedrag. `verdict.ts` en `contact-form.ts` (fase 3), `nav-progress.ts` (fase 2/4), `motion/` (fase 4). Niet: inhoud of opmaak.
**Fase:** 2–4 — 🔨

## Bestanden
| Bestand | Rol | Fase |
|---|---|---|
| `nav-progress.ts` | `initNavProgress()`: IntersectionObserver zet `aria-current="step"`/`is-done` en het `data-theme` van de nav; `--progress` voor de mobiele balk (scroll via `requestAnimationFrame`) | 2 ✓ |
| `verdict.ts` | `initVerdict(root)`: stapknoppen ↔ paneel; `aria-pressed`, `data-active` op het paneel (niet `hidden`: `.fl-verdict__panel` heeft `display: flex`), pijltjestoetsen over de zichtbare knoppen (mobiel slaat `inkoop` over). Na de eerste keuze zet hij `data-switched` op de root; alleen dan vervaagt een nieuw paneel in | 3 ✓ |
| `contact-form.ts` | `initContactForm(form)`: zet zelf `novalidate` (zonder JS blijft browservalidatie het vangnet), Nederlandse fouten per `[data-field]` uit `data-messages`, `aria-invalid`/`aria-describedby`, `fetch` (JSON) naar Web3Forms, dan `location.assign` naar het **pad** van `redirect` (zelfde domein, ook lokaal); bij een fout de `[data-form-status]`-melding en velden behouden. E-mail strenger dan de browser: `naam@domein` zonder punt is fout | 3 ✓ |
| `motion/index.ts` | Laadt GSAP + ScrollTrigger, `gsap.matchMedia()`, registreert hoofdstukken | 4 |
| `motion/forge-line.ts` | Bouwt het pad van de forge line uit de sectieposities, tekent het mee met scrollen | 4 |
| `motion/chapters/*.ts` | Eén bestand per hoofdstuk: `hero.ts`, `inzicht.ts`, `standaard.ts`, `automatisch.ts`, `aanbod.ts`, `over-mij.ts`, `contact.ts` | 4 |

## Ontwerpkeuzes
- **Progressive enhancement.** Elk script begint met de HTML zoals die zonder JS werkt, en voegt alleen gedrag toe. Het `<html>` krijgt in `BaseLayout` als eerste inline script `document.documentElement.classList.add('js')`; CSS voor JS-afhankelijke staten hangt aan `.js`.
- **Motion lazy laden.** `motion/index.ts` wordt geïmporteerd via `requestIdleCallback` (fallback `setTimeout(…, 1)`) na `load`, zodat GSAP de eerste paint niet blokkeert.
- **Eén `gsap.matchMedia()`** in `motion/index.ts` met drie contexten (desktop, mobiel, reduced). Hoofdstukmodules exporteren `function setup(ctx: MotionContext): void` en maken nooit zelf media queries.
- **Selectors alleen via `data-motion` en `data-chapter`.** Klassen kunnen veranderen; data-attributen zijn het contract tussen markup en motion.
- **Geen layout-thrashing:** posities voor het lijnpad één keer meten bij `ScrollTrigger.refresh` en bij `ResizeObserver` op `<main>`, niet per frame.

## Afhankelijkheden
- `gsap` (incl. ScrollTrigger), optioneel `lenis` (alleen met ADR-005-voorwaarden).
- Leest data-attributen uit `src/sections/` en `src/components/site/ForgeLine.astro`.
