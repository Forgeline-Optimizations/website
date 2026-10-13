# Module: sections

**Verantwoordelijkheid:** de acht hoofdstukken van de one-pager, elk één `<section>` met anker-id. Niet: losse pagina's (dat is `src/pages/`), gedrag (dat is `src/scripts/`).
**Fase:** 2 — ✓ (fase 3 voegt gedrag toe aan Oordeel en Contact)

## Inventaris

| Bestand | Anker | Artboard | Thema |
|---|---|---|---|
| `Hero.astro` | `#chaos` | `design/storyboard/Main.dc.html` (+ `MobielHero`) | donker |
| `Inzicht.astro` | `#inzicht` | `Inzicht.dc.html` | donker |
| `Standaard.astro` | `#standaard` | `Standaard.dc.html` | donker |
| `Automatisch.astro` | `#automatisch` | `Automatisch.dc.html` | donker |
| `Oordeel.astro` | `#oordeel` | `Oordeel.dc.html` (+ `MobielOordeel`) | donker |
| `Aanbod.astro` | `#aanbod` | `Aanbod.dc.html` (+ `MobielAanbod`) | licht |
| `OverMij.astro` | `#over-mij` | `OverMij.dc.html` | donker |
| `Contact.astro` | `#contact` | `Contact.dc.html` | licht |

## Vaste structuur van elke sectie (behalve Hero)

Deze structuur zit in **`src/components/site/Chapter.astro`** (props `id`, `num`, `theme`, `kicker`, `title`, `lead?`, `end?`); een sectie levert alleen de inhoud onder de kop als slot. Chapter rendert ook de tick in de rail en `data-forge-anchor="chapter"`. Wat hij rendert:

```astro
<section id="inzicht" class="chapter" data-chapter="02" data-theme="dark" aria-labelledby="inzicht-title">
  <div class="chapter__inner">
    <div class="chapter__rail" aria-hidden="true"></div>       <!-- kolom 1: plek voor de forge line -->
    <div class="fl-numeral chapter__num" aria-hidden="true">02</div> <!-- kolom 2 -->
    <div class="chapter__body">                                 <!-- kolom 3 -->
      <SectionHeader kicker={…} title={…} lead={…} titleId="inzicht-title" />
      <div class="chapter__visual" data-motion="inzicht">…</div>
    </div>
  </div>
</section>
```
- `data-chapter` en `data-motion` zijn de haakjes voor `src/scripts/motion/`. Gebruik geen andere selectors voor animatie.
- Het nummer staat op het board naast de kop; in `chapter__inner` is dat kolom 2 op dezelfde rij als de kop.

## Ontwerpkeuzes
- **Board → flow-layout.** De absolute posities in de artboards worden flex/grid met de tussenruimtes van het board (bijv. nodes 218px uit elkaar → `gap` = 218 − 168 = 50px; gebruik `var(--space-12)` = 48px). Doel: op 1440 breed binnen ± 32px gelijk aan het board.
- **Hero is de uitzondering:** twee kolommen (tekst | chaos-veld) zonder rail en zonder nummer. Het chaos-veld is het enige element met absolute posities binnen een vaste doos van 600 × 580 (schaalt mee met `aspect-ratio` en een `scale()` onder 1280px). Coördinaten in `src/data/hero-chaos.ts`.
- **Lijnen tussen nodes** zijn inline SVG (`aria-hidden`), gepositioneerd binnen dezelfde container als de nodes. Gebruik `viewBox` in dezelfde px-maat als de container zodat de board-coördinaten één-op-één bruikbaar zijn.
- **Voorbeeldlabels** ("Voorbeeld · …") zijn verplicht in Automatisch en Oordeel.
- **Mobiel (< 900px):** één kolom; rail-kolom 16px met lijn op x = 16; nummer boven de kop (56px); rijen nodes worden stapels; zie `docs/storyboard.md` → Mobiel.

## Haakjes voor beweging (fase 4)
- `data-motion="…"` op het blok van elk hoofdstuk; motion zoekt daarbinnen op klasse.
- **Standaard:** chips die niet in elke baan voorkomen krijgen `data-deviation` (berekend uit `nl.ts`, niet hard-coded). Aan het eind van de beweging staan ze op 25% (zonder beweging: 100%, zoals het board).
- **Automatisch:** een resultaat met `→` wordt `<span data-old>` `<span data-arrow>` `<span data-new>` (zonder `→`, bijv. "Blijft mensenwerk", blijft één chip). `.is-before` verbergt pijl en nieuwe waarde.
- **Aanbod:** `.fl-dawn` (`data-motion="dawn"`, `data-theme="light"`) hangt boven de sectie, over de onderrand van Oordeel: een verloop naar licht, ter hoogte van de hoofdstuk-padding (niet 30vh zoals het plan: dat zou over het verdict-blok vallen). Alleen zichtbaar onder `forge-js`.

## Zoals gebouwd (fase 2)
- **Breekpunten per sectie.** Onder 900px mobiel. Rijen van nodes (Inzicht, Automatisch) pas vanaf **1280px**, Standaard, Contact en de dienstenladder vanaf **1200px**: daaronder is de inhoudskolom (1260 − 48 − 200) te smal en vallen ze terug op de stapel. Op 1440 is de inhoudskolom 1012px, niet de 1060 van het board.
- **Sectiespecifieke layout** staat in een scoped `<style>` in de sectie; gedeelde patronen (`.fl-columns`, verdict, profiel, `.fl-next`) in `components.css`.
- **Hero:** chaos-veld is een vaste doos van 600 × 580 met `scale()` per breekpunt (0,62 / 0,8 / 1); geen container-query-deling (Firefox kan geen lengte door lengte delen). Mobiel: drie nodes in een doos van 334 × 200.
- **Forge line:** `ForgeLine part="start"` in de Hero (vierkant + scroll-cue, lijn naar de onderrand), `part="end"` in Contact (L-vormige haak naar de verzendknop; `Chapter end` knipt hem af met `overflow: clip` en verbergt de eigen rail).
- **Automatisch:** de stroom is een geanimeerde CSS-gradient (geen SVG), zodat hij met de flex-layout meeschaalt; stil bij reduced motion.
- **Oordeel:** mobiel toont de vier `verdictsMobile` in de desktopvolgorde (niet de boardvolgorde), zodat de tabvolgorde gelijk blijft aan de visuele volgorde. Panelen wisselen via `data-active`.
- **Tekst met inline link** (privacy-checkbox): op één regel houden met `<!-- prettier-ignore -->`, anders komt er een spatie vóór de punt.

## Afhankelijkheden
- Gebruikt: `src/components/ui/*`, `src/components/site/{Chapter,ForgeLine}.astro`, `src/i18n`, `src/data/*`.
- Gebruikt door: `src/pages/index.astro`.
