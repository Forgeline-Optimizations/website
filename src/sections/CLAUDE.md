# Module: sections

**Verantwoordelijkheid:** de acht hoofdstukken van de one-pager, elk één `<section>` met anker-id. Niet: losse pagina's (dat is `src/pages/`), gedrag (dat is `src/scripts/`).
**Fase:** 2 — ⏳ (fase 3 voegt gedrag toe aan Oordeel en Contact)

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

## Afhankelijkheden
- Gebruikt: `src/components/ui/*`, `src/i18n`, `src/data/*`.
- Gebruikt door: `src/pages/index.astro`.
