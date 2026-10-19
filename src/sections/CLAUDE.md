# Module: sections

**Verantwoordelijkheid:** de vijf hoofdstukken van de one-pager, elk één `<section>` met anker-id. Niet: losse pagina's (dat is `src/pages/`), gedrag (dat is `src/scripts/`).
**Fase:** 2 — ✓ (fase 3 voegt gedrag toe aan Werkwijze en Contact; fase 7 vervangt Inzicht/Standaard/Automatisch/Oordeel door Werkwijze, [ADR-015](../../.claude/decisions/ADR-015-verhaal-inkorten.md))

## Inventaris

| Bestand | Anker | Artboard | Thema |
|---|---|---|---|
| `Hero.astro` | `#chaos` | `design/storyboard/Main.dc.html` (+ `MobielHero`) | donker |
| `Werkwijze.astro` | `#werkwijze` | geen (fase 7; spec in `docs/storyboard.md`) | donker |
| `Aanbod.astro` | `#aanbod` | `Aanbod.dc.html` (+ `MobielAanbod`) | licht |
| `OverMij.astro` | `#over-mij` | `OverMij.dc.html` | donker |
| `Contact.astro` | `#contact` | `Contact.dc.html` | licht |

`Inzicht.astro`, `Standaard.astro`, `Automatisch.astro`, `Oordeel.astro` bestonden tot fase 7 (ankers `#inzicht`/`#standaard`/`#automatisch`/`#oordeel`); vervangen door `Werkwijze.astro`. `BaseLayout.astro` herschrijft die oude hashes naar `#werkwijze`.

### Werkwijze.astro

Vier stappen (`fl-steps` > `fl-step[data-step]`) in plaats van vier losse hoofdstukken: `kaart`, `standaard`, `automatisch`, `advies`. Gebruikt `Chapter.astro`'s nieuwe `rail`-slot voor vier extra `fl-tick`s (één per stap, `data-forge-tick`), die alleen onder `html.forge-js` zichtbaar worden en oplichten via `[data-lit]` (gezet door `src/scripts/motion/chapters/werkwijze.ts`). Stap "advies" bevat het `VerdictCard`-blok (`[data-verdict-root]`, zelfde contract als voorheen Oordeel: `src/scripts/verdict.ts`). Rijen die niet in de smalle kolom passen (`.wk-map__row`, `.wk-std`, `.wk-auto__nodes`) scrollen lokaal (`overflow-x: auto` + `tabindex="0"`) in plaats van de pagina breder te maken.

## Vaste structuur van elke sectie (behalve Hero)

Deze structuur zit in **`src/components/site/Chapter.astro`** (props `id`, `num`, `theme`, `kicker`, `title`, `lead?`, `end?`); een sectie levert alleen de inhoud onder de kop als slot. Chapter rendert ook de tick in de rail en `data-forge-anchor="chapter"`. Wat hij rendert:

```astro
<section id="aanbod" class="chapter" data-chapter="03" data-theme="light" aria-labelledby="aanbod-title">
  <div class="chapter__inner">
    <div class="chapter__rail" aria-hidden="true"></div>       <!-- kolom 1: plek voor de forge line -->
    <div class="fl-numeral chapter__num" aria-hidden="true">03</div> <!-- kolom 2 -->
    <div class="chapter__body">                                 <!-- kolom 3 -->
      <SectionHeader kicker={…} title={…} lead={…} titleId="aanbod-title" />
      <div class="chapter__visual" data-motion="aanbod">…</div>
    </div>
  </div>
</section>
```
- `data-chapter` en `data-motion` zijn de haakjes voor `src/scripts/motion/`. Gebruik geen andere selectors voor animatie.
- Het nummer staat op het board naast de kop; in `chapter__inner` is dat kolom 2 op dezelfde rij als de kop.
- **`rail`-slot (fase 7):** `Chapter.astro` heeft ook een named slot `rail`, leeg bij de meeste hoofdstukken. Werkwijze gebruikt hem voor vier extra `fl-tick`s (één per stap), zodat een hoofdstuk met meerdere stappen zijn eigen rail-markeringen kan toevoegen zonder de chapter-shell over te typen.

## Ontwerpkeuzes
- **Board → flow-layout.** De absolute posities in de artboards worden flex/grid met de tussenruimtes van het board (bijv. nodes 218px uit elkaar → `gap` = 218 − 168 = 50px; gebruik `var(--space-12)` = 48px). Doel: op 1440 breed binnen ± 32px gelijk aan het board.
- **Hero is de uitzondering:** twee kolommen (tekst | chaos-veld) zonder rail en zonder nummer. Het chaos-veld is het enige element met absolute posities binnen een vaste doos van 600 × 580 (schaalt mee met `aspect-ratio` en een `scale()` onder 1280px). Coördinaten in `src/data/hero-chaos.ts`.
- **Lijnen tussen nodes** zijn inline SVG (`aria-hidden`), gepositioneerd binnen dezelfde container als de nodes. Gebruik `viewBox` in dezelfde px-maat als de container zodat de board-coördinaten één-op-één bruikbaar zijn.
- **Voorbeeldlabels** ("Voorbeeld · …") waren verplicht in de oude Automatisch en Oordeel (fase 2–6). Sinds fase 7 (ADR-015) heeft Werkwijze bewust géén voorbeeldlabel en géén verzonnen getallen: abstract in plaats van één bedrijfsvoorbeeld.
- **Mobiel (< 900px):** één kolom; rail-kolom 16px met lijn op x = 16; nummer boven de kop (56px); rijen nodes worden stapels; zie `docs/storyboard.md` → Mobiel.

## Haakjes voor beweging (fase 4, uitgebreid in fase 7)
- `data-motion="…"` op het blok van elk hoofdstuk (Werkwijze: `data-motion="step-…"` per stap); motion zoekt daarbinnen op klasse.
- **Werkwijze, stap Standaardiseren:** chips die niet in elke baan voorkomen krijgen `data-deviation` (berekend uit `nl.ts`, niet hard-coded). Aan het eind van de beweging staan ze op 25% (zonder beweging: 100%).
- **Werkwijze, stap Automatiseren:** elke node krijgt `data-mode="auto"` of `data-mode="human"` op de `<li>` (niet op de node zelf), zodat `werkwijze.ts` weet welke nodes mee automatiseren. Geen resultaatchips meer (geen `data-old`/`data-new`, die hoorden bij de oude, concrete Automatisch).
- **Werkwijze-rail:** vier `fl-tick`s (via `Chapter.astro`'s `rail`-slot, `data-forge-tick="<stap-id>"`) lichten op (`[data-lit]`) wanneer de forge line die stap bereikt.
- **Aanbod:** `.fl-dawn` (`data-motion="dawn"`, `data-theme="light"`) hangt boven de sectie, over de onderrand van Werkwijze: een verloop naar licht, ter hoogte van de hoofdstuk-padding (niet 30vh zoals het plan: dat zou over het verdict-blok vallen). Alleen zichtbaar onder `forge-js`.

## Zoals gebouwd (fase 2, Werkwijze toegevoegd in fase 7)
- **Breekpunten per sectie.** Onder 900px mobiel. Contact en de dienstenladder (Aanbod) vallen terug op de stapel onder **1200px**: daaronder is de inhoudskolom (1260 − 48 − 200) te smal. Op 1440 is de inhoudskolom 1012px, niet de 1060 van het board.
- **Werkwijze (fase 7):** de visual-kolom náást het label (340px + gap) is smaller dan de volle inhoudskolom van de oude Inzicht/Automatisch; rijen van nodes (stap "In kaart", "Automatiseren") en de 3-koloms grid (stap "Standaardiseren") passen daarom pas vanaf **1100px**, en scrollen daaronder/daarboven lokaal (`overflow-x: auto`, `tabindex="0"` voor axe's `scrollable-region-focusable`) in plaats van de pagina breder te maken. `.fl-badge` heeft `max-width: 100%` (components.css) zodat een lang label ("Automatiseren · met AI") in een smalle verdict-kolom wrapt in plaats van de pagina te verbreden.
- **Sectiespecifieke layout** staat in een scoped `<style>` in de sectie; gedeelde patronen (`.fl-columns`, verdict, profiel, `.fl-next`) in `components.css`.
- **Hero:** chaos-veld is een vaste doos van 600 × 580 met `scale()` per breekpunt (0,62 / 0,8 / 1); geen container-query-deling (Firefox kan geen lengte door lengte delen). Mobiel: drie nodes in een doos van 334 × 200, labels uit `hero.nodesMobile` (eigen, kortere lijst, niet een subset van `hero.nodes`).
- **Forge line:** `ForgeLine part="start"` in de Hero (vierkant + scroll-cue, lijn naar de onderrand), `part="end"` in Contact (L-vormige haak naar de verzendknop; `Chapter end` knipt hem af met `overflow: clip` en verbergt de eigen rail).
- **Werkwijze, stap Automatiseren:** de stroom is een geanimeerde CSS-gradient (geen SVG), zodat hij met de flex-layout meeschaalt; stil bij reduced motion.
- **Werkwijze, stap Eerlijk advies:** mobiel toont alle vier soorten werk (geen `verdictsMobile`-filter meer, sinds fase 7); de tabvolgorde is gelijk aan de visuele volgorde. Panelen wisselen via `data-active`.
- **Tekst met inline link** (privacy-checkbox): op één regel houden met `<!-- prettier-ignore -->`, anders komt er een spatie vóór de punt.

## Afhankelijkheden
- Gebruikt: `src/components/ui/*`, `src/components/site/{Chapter,ForgeLine}.astro`, `src/i18n`, `src/data/*`.
- Gebruikt door: `src/pages/index.astro`.
