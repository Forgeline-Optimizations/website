# Fase 5 — Kwaliteit: mobiel, toegankelijkheid, prestaties

**Wat deze fase oplevert:** een site die op elk scherm klopt, met toetsenbord en screenreader bruikbaar is, en aantoonbaar Lighthouse ≥ 95 haalt — bewaakt in CI.
**Bepalende keuze:** de Lighthouse-score is de harde gate (ADR-010); het JS-budget is een richtlijn.
**Buiten scope:** nieuwe inhoud of features. Wat hier niet gehaald wordt, wordt opgelost, niet weggelaten uit de meting.

Lees vooraf: ADR-005, ADR-010, `tests/CLAUDE.md`, `docs/storyboard.md` → Mobiel.

---

### Stap 1 — Mobiele afwerking (Audit) van alle secties

**Waarom:** fase 2 bouwde mobiel functioneel; nu moet het kloppen met `MobielHero.dc.html`, `MobielOordeel.dc.html`, `MobielAanbod.dc.html` en de mobiele regels.

**Wat:** controleer op 360, 390 en 430 breed en op 768 (tablet staand) en 1024 (tablet liggend):
- Rail op x = 16, inhoud vanaf x = 40, geen horizontale scroll, geen tekst kleiner dan 14px (behalve `caption` 12px in de footer).
- Touch targets ≥ 44 × 44 (nav-knop, verdict-chips, checkbox-label, footer-links: vergroot de klikzone met padding, niet de tekst).
- Tablet 900–1260: het driekolomsraster schaalt; het chaos-veld in de hero schaalt mee zonder te overlappen met de tekst (zo niet: onder 1180 het veld onder de tekst).
- Landscape-telefoon (844 × 390): hero `min-height` mag niet groter zijn dan het scherm; gebruik `min-height: max(100svh, 560px)` alleen vanaf 900 breed.
Leg elke afwijking vast en los hem op in de betreffende sectie.

---

### Stap 2 — Toegankelijkheid (Audit + fixes)

**Waarom:** de site belooft zorgvuldigheid; toegankelijkheid is daar het meest zichtbare bewijs van.

**Wat:**
- Toetsenbord: tab door de hele pagina; volgorde = visuele volgorde; focus altijd zichtbaar (`focus-ring`, ook op lichte secties: daar is hij zwart); geen focus op decoratieve elementen.
- Screenreader (VoiceOver of NVDA): landmarks (`banner`, `navigation`, `main`, `contentinfo`), één `h1`, `h2` per hoofdstuk, verdict-paneel wordt voorgelezen bij wisselen (`aria-live="polite"`), formulierfouten worden voorgelezen.
- Decoratie: alle SVG-lijnen, het chaos-veld, nummers (`fl-numeral`) en de forge-laag `aria-hidden="true"`.
- Contrast: draai axe; controleer handmatig `ink-muted` op `surface-raised` in beide thema's en de chips op de raster-achtergrond.
- Zoom 200% en tekstvergroting: geen overlap of afgekapte tekst.
- `prefers-reduced-motion`: geen smooth scroll, geen zweven, geen flow.
Noteer de handmatige resultaten in de session-log.

---

### Stap 3 — Prestaties: afbeeldingen, fonts en scripts

**Waarom:** Lighthouse Performance ≥ 95 op mobiel profiel is de lastigste van de vier.

**Wat:**
- Portret via `astro:assets` `<Image>` (AVIF/WebP, `widths` 320/640, `loading="lazy"`, `decoding="async"`); controleer dat er geen originele jpg geladen wordt.
- Logo's: `<img width height>` gezet; geen layout shift.
- Fonts: alleen latin-subset, drie gewichten; preload alleen 700 (hero-kop). Controleer met de Network-tab dat er precies drie woff2's laden.
- GSAP: alleen op `/`, lazy na `load` (fase 4). Controleer in `dist/` de chunkgroottes (`npx astro build` toont ze) en noteer het totaal aan JS gzip in de session-log. Richtlijn ± 200 KB; erboven: kijk eerst naar ongebruikte imports.
- CSS: Tailwind v4 genereert alleen gebruikte utilities; controleer dat `components.css` geen dode klassen uit het storyboard bevat (`sb-*`).
- Geen render-blokkerende third-party scripts (Plausible komt in fase 6 met `defer`).

---

### Stap 4 — Maak `lighthouserc.json` en voeg de gate toe aan CI

**Waarom:** zonder automatische gate verslechtert de score sluipend (ADR-010).

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/", "/request-received/", "/privacy/"],
      "numberOfRuns": 3,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```
Maak ook `lighthouserc.mobile.json` (zelfde, zonder `preset`, dus mobiel profiel met throttling). Scripts:
```json
"lhci": "npm run build && lhci autorun --config=lighthouserc.json && lhci autorun --config=lighthouserc.mobile.json"
```
Installeer `@lhci/cli` als devDependency. Voeg in `deploy.yml` aan de `test`-job toe: `- run: npm run lhci`. (`noindex` op `/request-received` kost SEO-punten; als de assertie daarop faalt, sluit die URL uit van de SEO-assertie met een `assertMatrix`, niet door de drempel te verlagen.)

---

### Stap 5 — Optioneel: Lenis

**Waarom:** soepeler scrollen kan het scroll-verhaal versterken, maar alleen als het niets kost (ADR-005).

**Wat:** pas als stap 4 groen is. `npm install lenis`; in `motion/index.ts` alleen binnen de `desktop`-context: `const lenis = new Lenis(); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);` en opruimen in de cleanup. Meet opnieuw; zakt een score onder 0,95 of voelt anker-navigatie traag, dan eruit en noteren in de session-log. Bij twijfel: niet doen.

---

## Tests
- Bestaande e2e-suites draaien op de projecten `desktop` en `mobile`; voeg een project `tablet` (1024 × 768) toe.
- `tests/e2e/a11y.spec.ts`: ook met `reducedMotion: 'reduce'` en op `mobile`.
- `tests/e2e/layout.spec.ts` (nieuw):
| Test | Controleert |
|---|---|
| `no overflow` | op 360, 390, 768, 1024, 1440: `scrollWidth <= innerWidth` |
| `touch targets` | op mobiel: alle `a, button, input[type=checkbox] + label` ≥ 44px hoog (via `boundingBox`, met padding) |
| `min font size` | geen zichtbaar tekstelement met `font-size` < 12px; buiten de footer < 14px |
| `images sized` | elke `img` heeft `width` en `height` of een `aspect-ratio` |
- `npm run lhci` groen, desktop én mobiel.

## Acceptatiecriteria
- [ ] Lighthouse ≥ 0,95 op alle vier categorieën, desktop en mobiel, in CI.
- [ ] Axe: nul serious/critical op alle pagina's en schermbreedtes.
- [ ] Handmatige toetsenbord- en screenreadertest gedaan en vastgelegd.
- [ ] Geen horizontale scroll of afgekapte tekst van 360 tot 1440 breed.

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `src/sections/*.astro`, `src/styles/*.css` | **Audit** | Mobiele en tablet-afwijkingen oplossen |
| `src/sections/OverMij.astro` | **Audit** | `<Image>`-instellingen |
| `src/layouts/BaseLayout.astro` | **Audit** | Font-preload, geen extra preloads |
| `lighthouserc.json`, `lighthouserc.mobile.json` | **Create** | Gate-configuratie |
| `package.json` | **Edit** | `@lhci/cli`, script `lhci` |
| `.github/workflows/deploy.yml` | **Edit** | `npm run lhci` in de test-job |
| `playwright.config.ts` | **Edit** | Project `tablet` |
| `tests/e2e/layout.spec.ts` | **Create** | 4 tests |
| `tests/e2e/a11y.spec.ts` | **Edit** | Reduced motion, mobiel |
| `src/scripts/motion/index.ts` | **Edit (optioneel)** | Lenis |
