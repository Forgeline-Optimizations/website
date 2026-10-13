# Forgeline Optimizations — website

> Waarom dit bestaat en wat nooit mag: [`.claude/SOUL.md`](.claude/SOUL.md).

Eén-pagina visitekaartje voor forgelineoptimizations.nl: een scroll-verhaal langs **de forge line**, één doorlopende lijn die een klantproces van chaos naar automatisering volgt, in acht hoofdstukken. Statische Astro-site op GitHub Pages, domein bij TransIP. Huidige fase: **Fase 5 — Kwaliteit** (zie `.claude/docs/`).

## Start van elke sessie

1. Lees de bovenste entry van `.claude/memory/session-log.md`.
2. Lees het plan van de huidige fase in `.claude/docs/` (tabel hieronder).
3. Lees de ADR's die dat plan noemt in `.claude/decisions/`.
4. Werk het plan stap voor stap af; vink taken af in deze file.
5. Sluit af met een entry in de session-log (protocol staat in die file).

## Bronnen van waarheid (in deze volgorde)

| Wat | Waar | Rol |
|---|---|---|
| Storyboard (vastgelegd) | `design/storyboard/` · live: https://claude.ai/artifact/KrJVBy6i4DRLV83pWunzfN (versie `1791838245-b376`) | Layout, inhoud en beweging per hoofdstuk. **Desktop-artboards zijn leidend**; mobiel volgt de desktoptekst. |
| Design system | `design/design-system/` · live: https://claude.ai/artifact/8PAneU9PBmjifEr2sNGg92 (versie `1791835914-59ed`) | Tokens (`tokens.json`), componentstijlen (`components/bundle.css`), regels (`README.md`). |
| Teksten | `docs/content-nl.md` → geïmplementeerd in `src/i18n/nl.ts` | Na fase 2 is `nl.ts` leidend; `content-nl.md` wordt dan niet meer bijgewerkt. |
| Scroll-beweging | `docs/storyboard.md` (sectie "Beweging") | Uitgeschreven versie van de oranje notities op het board. |

De `.dc.html`-bestanden zijn **referentie, geen broncode**. Ze gebruiken absolute positionering op een 1440-canvas; de site bouwt dezelfde compositie na met normale flow-layout (zie `src/sections/CLAUDE.md`). Afbeeldingen daarin verwijzen naar `/_blob/…`-id's; de mapping naar `public/` staat in `design/README.md`.

## Stack

| Laag | Technologie | Versie | Notities |
|---|---|---|---|
| Framework | Astro | 7.x (Node ≥ 22.12) | `output: 'static'`, TypeScript `strict` |
| Taal | TypeScript | via Astro | `astro check` in CI |
| Styling | Tailwind CSS v4 + `@tailwindcss/vite` | 4.x | Tokens als CSS-variabelen; `@theme inline` koppelt ze aan Tailwind |
| Componentstijl | `src/styles/components.css` | — | Port van `design/design-system/components/bundle.css` (`fl-`-klassen) |
| Beweging | GSAP + ScrollTrigger | 3.x | Gratis, inclusief plugins. Lenis optioneel (fase 4) |
| Interactie | Vanilla TS in Astro `<script>` | — | Geen UI-framework (ADR-004) |
| Fonts | `@fontsource/saira` (500/600/700) + Arial-systeemstack | — | Zelf gehost (ADR-006) |
| Formulier | Web3Forms | — | → info@forgelineoptimizations.nl, redirect `/request-received` |
| Analytics | Plausible (cookieloos) | — | Snippet uit Plausible-dashboard (ADR-007) |
| Testen | Playwright + `@axe-core/playwright`, Vitest, Lighthouse CI | — | Zie Conventies |
| Hosting | GitHub Pages via `withastro/action` | — | Custom domain via `public/CNAME` |
| DNS | TransIP | — | A-records + `www`-CNAME naar GitHub (ADR-002) |

## Architectuur

- **Eén pagina, acht secties** in `src/sections/`, samengesteld in `src/pages/index.astro`. Volgorde en anker-id's: `#chaos` (hero), `#inzicht`, `#standaard`, `#automatisch`, `#oordeel`, `#aanbod`, `#over-mij`, `#contact`.
- **Losse pagina's:** `/request-received`, `/privacy`, `/voorwaarden`, `404`.
- **Tekst staat nooit in componenten.** Secties lezen uit `src/i18n/nl.ts` via `t()`; bedrijfsgegevens uit `src/data/site.ts`; verdict-voorbeelden uit `src/data/verdicts.ts`.
- **Tokens:** `scripts/sync-tokens.mjs` genereert `src/styles/tokens.css` uit `design/design-system/tokens.json` (draait vóór `dev` en `build`). Nooit `tokens.css` met de hand bewerken.
- **Thema per sectie:** donker is de standaard; `#aanbod` en het formulierdeel van `#contact` krijgen `data-theme="light"`. Kleuren schakelen puur via CSS-variabelen.
- **De forge line** is één SVG-laag (`src/components/site/ForgeLine.astro`) die per sectie een segment tekent; `src/scripts/motion/` stuurt hem aan met ScrollTrigger. Zonder JS staat de lijn volledig getekend.
- **Progressive enhancement:** HTML werkt zonder JS (formulier post direct naar Web3Forms, verdict toont de eerste stap open en de rest als lijst). JS voegt toe, verwijdert nooit inhoud.
- **Motion-gates:** alle animatie zit in `gsap.matchMedia()` met `(prefers-reduced-motion: no-preference)`; onder 900px een vereenvoudigde set.

## Fases

| Fase | Plan | Doel | Status |
|---|---|---|---|
| 1 | `.claude/docs/fase-1-fundament.md` | Astro-project, tokens, fonts, layout, deploy naar GitHub Pages | ✓ |
| 2 | `.claude/docs/fase-2-statische-pagina.md` | Alle 8 secties statisch, met echte tekst, desktop + mobiel | ✓ |
| 3 | `.claude/docs/fase-3-interactie-en-formulier.md` | Verdict-interactie, contactformulier, losse pagina's | ✓ |
| 4 | `.claude/docs/fase-4-beweging.md` | Forge line + scroll-animaties per hoofdstuk | ✓ |
| 5 | `.claude/docs/fase-5-kwaliteit.md` | Mobiel, toegankelijkheid, prestaties, Lighthouse-gate | 🔨 Huidig |
| 6 | `.claude/docs/fase-6-lancering.md` | SEO, OG, Plausible, DNS, livegang | ⏳ |

Overzicht en volgorde: `.claude/docs/README.md`.

## Huidige fase: Fase 5 — Kwaliteit
**Doel:** de site klopt op elk scherm, is bruikbaar met toetsenbord en screenreader, en haalt aantoonbaar Lighthouse ≥ 95 op alle vier categorieën, bewaakt in CI (ADR-010).
**Taken:** zie `.claude/docs/fase-5-kwaliteit.md`, stap 1 t/m 5. Branch: `fase-5-kwaliteit`.
- [ ] Stap 1: mobiele afwerking (audit alle secties; ook 900–1280px, zie session-log fase 2)
- [ ] Stap 2: toegankelijkheid (audit + fixes)
- [ ] Stap 3: prestaties (afbeeldingen, fonts, scripts; motion-chunk is 122 KB ongecomprimeerd)
- [ ] Stap 4: `lighthouserc.json` + gate in CI
- [ ] Stap 5 (optioneel): Lenis
**Blokkades:** geen.

## Mijlpalen
- Fase 0 — Ontwerp vastgelegd: design system, storyboard, geheugen-workspace. ✓
- Fase 1 — Fundament: Astro 7, tokens, fonts, layout, nav, footer, tests, CI + deploy naar GitHub Pages (2026-10-12). ✓
- Fase 2 — De statische pagina: acht hoofdstukken, statische forge line, nav-voortgang, desktop + mobiel (2026-10-13). ✓
- Fase 3 — Interactie en formulier: verdict met klik en pijltjes, formulier met Nederlandse validatie en fetch, `/request-received`, `/privacy`, `/voorwaarden`, `404` (2026-10-13). ✓
- Fase 4 — Beweging: forge line als SVG-laag over de hele pagina, één bewegend idee per hoofdstuk, Standaard en Automatisch gepind (2026-10-13). ✓

## Modulekaart

| Map | Verantwoordelijkheid | Fase | Status |
|---|---|---|---|
| `src/styles/` | Tokens, Tailwind-koppeling, componentstijlen | 1–2 | ✓ |
| `src/layouts/` | `BaseLayout.astro` (head, meta, fonts, nav, footer), `LegalLayout.astro` | 1–3 | ✓ |
| `src/components/` | UI-bouwstenen (`ui/`) en site-chrome (`site/`) | 1–4 | ✓ |
| `src/sections/` | De acht hoofdstukken | 2–3 | ✓ |
| `src/i18n/` | Alle teksten, `t()`-helper | 1–2 | ✓ (`nl.ts` is nu de bron) |
| `src/data/` | Bedrijfsgegevens, verdict-voorbeelden | 1–2 | ✓ |
| `src/scripts/` | Verdict-interactie, formulier, motion | 2–4 | ✓ |
| `src/pages/` | Routes | 1–3 | ✓ |
| `tests/` | Playwright, Vitest | 1–5 | 🔨 (tests fase 1–4; Lighthouse in fase 5) |

Elke map onder `src/` heeft een eigen `CLAUDE.md`, behalve `src/pages/`: daar heet hij `_CLAUDE.md`, omdat Astro elk `.md`-bestand in `pages/` als route bouwt.

## Conventies

**Bestanden:** componenten `PascalCase.astro`; scripts `kebab-case.ts`; secties heten naar hun anker (`Inzicht.astro` ↔ `#inzicht`).
**Klassen:** componentklassen houden het `fl-`-prefix en de BEM-namen uit het design system (`fl-node__name`). Tailwind-utilities voor layout en spacing; kleuren alleen via token-utilities (`bg-surface`, `text-ink-muted`), nooit hex of Tailwind-standaardkleuren.
**Tekst:** alleen in `src/i18n/nl.ts`. Typografische tekens: `–` (bereik), `·` (scheiding), `±`, `→`, `×`.
**Toegankelijkheid:** echte `<button>`/`<a>`; `aria-hidden="true"` op decoratieve SVG; één `<h1>` per pagina; koppen in volgorde.
**Testen:** elke fase eindigt groen op `npm run check` (astro check + lint), `npm run test` (Vitest) en `npm run test:e2e` (Playwright + axe). Vanaf fase 5 ook `npm run lhci` (≥ 0,95 op alle vier categorieën).
**Commits:** Conventional Commits in het Engels (`feat(sections): add inzicht chapter`). Eén logische wijziging per commit. Nooit direct op `main` als een fase half af is: branch `fase-N-*`, merge als de fase groen is.
**Afhankelijkheden:** alleen toevoegen als een plan het noemt; anders eerst een ADR.

## Belangrijkste beslissingen (volledig in `.claude/decisions/`)
- **ADR-001 Astro statisch + GitHub Pages:** snel, gratis, past bij "production-grade"; geen server nodig.
- **ADR-002 Domein blijft bij TransIP:** alleen DNS-records naar GitHub; geen nameserververhuizing, mail blijft ongemoeid.
- **ADR-003 Web3Forms voor contact:** geen backend; access key is publiek, domein vastgezet, honeypot tegen spam.
- **ADR-004 Geen UI-framework:** verdict en formulier zijn vanilla TS; scheelt runtime en houdt Lighthouse hoog.
- **ADR-005 GSAP ScrollTrigger, geen 3D:** één bewegend idee per scherm; reduced-motion = eindtoestand.
- **ADR-006 Design system is de bron; fonts zelf gehost:** tokens gegenereerd, Saira via Fontsource, geen Google Fonts.
- **ADR-007 Plausible, cookieloos:** geen cookiebanner nodig.
- **ADR-008 Nederlands eerst, i18n-klaar:** Astro i18n, `nl` zonder prefix, `en` later onder `/en/`.
- **ADR-009 Geen prijzen op de site:** prijs via gesprek of formulier.
- **ADR-010 Kwaliteitsgate:** Lighthouse ≥ 95 op alle categorieën in CI; JS-budget is richtlijn (± 200 KB), geen eis.
- **ADR-011 Type-check-pakketten:** `@astrojs/check`, `typescript`, `@types/node` als dev-deps; meldt Astro "requires the following dependency", dan is de check níet gedraaid.
- **ADR-012 Themazichtbaarheid via variabelen:** `fl-only-dark/-light` lezen `--fl-show-*`, zodat het dichtstbijzijnde `data-theme` wint; `components.css` staat in `@layer components`.
- **ADR-013 Logo ≥ 140px breed:** horizontaal logo 140 × 42 in nav en footer, ook al tekent het board 34px hoog.
- **ADR-014 Mobiel hoofdstukraster:** lijn op x = 16, inhoud op x = 40 (zoals het storyboard); nummer boven de kop.

## Wat NIET te doen
- Geen teksten, kleuren of maten hard-coded in componenten.
- `src/styles/tokens.css` niet met de hand bewerken: pas `design/design-system/tokens.json` aan en draai `npm run tokens`.
- Geen nieuwe npm-pakketten zonder dat een plan of ADR het noemt.
- Geen Google Fonts, geen externe CDN-scripts behalve Plausible en Web3Forms.
- Geen `outline: none` zonder vervangende focusstijl.
- Geen `.dc.html`-markup kopiëren: de absolute posities zijn voor een vast canvas, niet voor een responsive pagina.
- Geen prijzen, geen verzonnen klantnamen, geen ongelabelde voorbeeldgetallen.
- Niet deployen met falende tests.

## Open punten (Sander beslist)
Zie `docs/README.md` → "Open punten". Vraag ernaar zodra een stap ervan afhangt; bouw tot die tijd met de daar genoemde placeholder.
