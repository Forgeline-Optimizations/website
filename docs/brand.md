# Huisstijl op het web

De volledige regels staan in het design system: `design/design-system/README.md` (live: https://claude.ai/artifact/8PAneU9PBmjifEr2sNGg92). Dit is de samenvatting plus de afwijkingen van de documenthuisstijl (huisstijlgids v1.0).

## Kleur
| Token | Donker (standaard) | Licht | Gebruik |
|---|---|---|---|
| `surface` | #111111 Smeedzwart | #F2F0EC Werkplaatswit | Achtergrond |
| `surface-raised` | #1B1A18 | #FBFAF7 | Kaarten, panelen |
| `surface-sunken` | #0A0A0A | #E7E3DC | Invoervelden |
| `ink` | #F2F0EC | #111111 | Tekst |
| `ink-muted` | #A8A49D | #5B5B5B | Intro's, bijschriften |
| `forge` | #FF8700 Smeedoranje | #FF8700 | Het enige accent |
| `on-forge` | #111111 | #111111 | Tekst op oranje |
| `line` / `line-strong` | #2B2A27 / #706C65 | #D8D3CA / #7A766F | Haarlijnen / randen van bedieningselementen |

Verhouding online ± 60% donker, 30% licht, 10% oranje.

**Afwijkingen van de documenthuisstijl:**
- Donker is de standaard op het web (in documenten wit).
- `ink-muted` #A8A49D vervangt Staalgrijs op donker, omdat Staalgrijs daar onleesbaar is (2,8:1).
- Oranje mag als tekstkleur in het donkere thema (7,8:1); in het lichte thema nooit (2,1:1).

## Typografie
Koppen, labels, knoppen, cijfers: **Saira** 500/600/700 (zelf gehost). Lopende tekst: **Arial**. Labels altijd in hoofdletters met 0.14em spatiëring. Schaal: `display` 72 · `numeral` 96 · `h2` 44 · `h3` 28 · `h4` 20 · `lead` 20 · `body` 17 · `small` 14 · `caption` 12 (mobiel: 44 · 56 · 32 · 24 · 20 · 18 · 17 · 14 · 12).

## Logo
Bestanden in `public/brand/`:
| Bestand | Gebruik |
|---|---|
| `logo-horizontal-white.svg` | Navigatie en footer op donker |
| `logo-horizontal-black.svg` | Navigatie op licht |
| `logo-stacked-on-orange.svg` | Primair merkbeeld (basis van `og-image.png`) |
| `logo-stacked-white.svg` / `-black.svg` | Staand logo zonder vlak |
| `icon-white.svg` / `-black.svg` / `-orange.svg` | Los icoon; mobiele navigatie (wit), favicon (oranje) |

Regels: minimaal 140px breed (horizontaal), icoon minimaal 24px; vrije ruimte = hoogte van de letters FORGELINE; nooit uitrekken, draaien, gloed geven of het woordmerk naschrijven. Het horizontale logo is samengesteld uit icoon + woordmerk met de verhoudingen uit de huisstijlgids.

## Beeld
- Eén motief: de forge line. Rechte lijnen, rechte hoeken, vierkante punten.
- Zacht bouwtekening-raster op de achtergrond (`grid`-token, 48px).
- Enige gloed: `glow-forge`, alleen op het actieve punt van de lijn en geautomatiseerde stappen.
- Foto's in zwart-wit, zonder afronding. Geen stockfoto's van robots, hersenen of hologrammen; geen code of terminals.

## Iconen
Geen bibliotheek. Eigen lijniconen van 14px, lijndikte 1,5–2px, `currentColor`: pijl (automatiseren), pauze (eerst standaardiseren), doorgestreept vierkant (niet automatiseren), vinkje, uitroepteken. Geen emoji.
