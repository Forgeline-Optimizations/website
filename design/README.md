# Ontwerpbronnen (alleen-lezen)

Snapshots van de ontwerpartifacts op het moment dat het ontwerp is vastgelegd (2026-10-12). Bewerk deze bestanden niet in de repo; pas het ontwerp aan in het artifact en vervang de snapshot.

| Map | Bron | Versie |
|---|---|---|
| `storyboard/` | https://claude.ai/artifact/KrJVBy6i4DRLV83pWunzfN | `1791838245-b376` |
| `design-system/` | https://claude.ai/artifact/8PAneU9PBmjifEr2sNGg92 | `1791835914-59ed` |

## storyboard/
- `canvas.json` — indeling van het canvas, titels per artboard en de oranje notities (scroll-beweging).
- `*.dc.html` — één artboard per hoofdstuk (desktop 1440 breed) en drie mobiele frames (390 breed). Gebruiken `styles/tokens.css`, `styles/site.css` en `ds/forgeline/components/bundle.css` (= `design-system/components/bundle.css`).
- Absoluut gepositioneerd op een vast canvas: **referentie voor maten, volgorde en inhoud, geen code om te kopiëren.**
- **`Inzicht.dc.html`, `Standaard.dc.html`, `Automatisch.dc.html`, `Oordeel.dc.html` (+ `MobielOordeel.dc.html`) zijn historisch** sinds fase 7 ([ADR-015](../.claude/decisions/ADR-015-verhaal-inkorten.md)): die vier hoofdstukken zijn vervangen door één hoofdstuk Werkwijze. Ze blijven als referentie staan, maar zijn niet meer leidend; de spec van Werkwijze staat in `docs/storyboard.md`.

### Afbeeldingen in de artboards
De artboards verwijzen naar geüploade bestanden via `/_blob/<id>`. In de repo:

| `/_blob/…` id | Bestand in de repo |
|---|---|
| `9e8f29cd678cfd7b6434d40336ed5441` | `public/brand/logo-horizontal-white.svg` |
| `f7e55aebdbf893ebe4642183071ab418` | `public/brand/logo-horizontal-black.svg` |
| `6c8b7058af2e6aebec152d58121d79cd` | `public/brand/icon-white.svg` |
| `cdebaa455e33341276e3a25f9fd95ace` | `src/assets/images/sander-portrait-tijdelijk.jpg` |

## design-system/
- `README.md` — het brand book: regels voor toon, kleur, typografie, beeld, beweging, logo, toegankelijkheid.
- `tokens.json` — **de bron van alle tokens**; `scripts/sync-tokens.mjs` genereert er `src/styles/tokens.css` uit.
- `components/<Naam>/README.md` + `preview.html` — richtlijnen en een werkend HTML/CSS-voorbeeld per component.
- `components/bundle.css` — de componentstijlen (`fl-`-klassen); geport naar `src/styles/components.css`.
- `fonts/` — Saira 500/600/700 (ter referentie; de site gebruikt `@fontsource/saira`).
- De logo's en het portret staan als uploads in het artifact; in de repo staan de logo's in `public/brand/` en het portret in `src/assets/images/` (zodat Astro het kan optimaliseren).
