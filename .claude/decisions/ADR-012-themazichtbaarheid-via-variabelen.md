# ADR-012: Thema-afhankelijke elementen tonen via overerfbare variabelen

**Datum:** 2026-10-12
**Fase:** 1
**Status:** Geaccepteerd

## Context
Het logo bestaat in een witte (donker thema) en een zwarte (licht thema) versie, gewisseld met de klassen `fl-only-dark` en `fl-only-light`. Het fase-1-plan en `src/styles/CLAUDE.md` schreven voor:

```css
[data-theme='dark'] .fl-only-light, [data-theme='light'] .fl-only-dark { display: none; }
```

Op de site staat `data-theme="dark"` op `<body>` en wisselen losse blokken naar licht (de nav boven `#aanbod`/`#contact`, de secties zelf). Een logo in zo'n licht blok heeft dan zowel een donkere als een lichte voorouder: de zwarte versie matcht de eerste regel, de witte de tweede. **Beide logo's verdwijnen.** CSS-selectors kunnen niet uitdrukken "alleen het dichtstbijzijnde thema telt".

## Beslissing
Elk themablok zet twee variabelen; de klassen lezen die:

```css
/* global.css, buiten elke @layer */
[data-theme='dark']  { --fl-show-dark: initial; --fl-show-light: none; }
[data-theme='light'] { --fl-show-dark: none;    --fl-show-light: initial; }
.fl-only-dark  { display: var(--fl-show-dark, revert-layer); }
.fl-only-light { display: var(--fl-show-light, revert-layer); }
```

- Custom properties erven van het dichtstbijzijnde blok met `data-theme`, dus het binnenste thema wint altijd.
- `initial` als waarde van een custom property betekent "niet gezet"; `var()` gebruikt dan de fallback `revert-layer`. Die laat de `display` gelden die de componentlaag (bijv. `.fl-nav__logo img { display: block }`) of de browser het element geeft.
- Daarom staat `components.css` in `@layer components` (`@import './components.css' layer(components)`), zoals Tailwind v4 dat bedoelt, en staan de twee regels hierboven ongelaagd. Ongelaagde regels winnen van gelaagde, ongeacht specificiteit.

Getest op 2026-10-12 in Chromium, Firefox en WebKit (Playwright): in een donker blok `block`/`none`, in een genest licht blok `none`/`block`.

## Onderbouwing
Eén regel per klasse, werkt bij elke nestingdiepte, geen JavaScript en geen `!important`. Tailwind-utilities (`@layer utilities`) kunnen `fl-`-klassen overschrijven, wat bij een layer-opzet hoort.

## Overwogen alternatieven
- **`:not([data-theme='light'] *)`-ketens:** werkt maar voor één niveau; onleesbaar en breekt bij dieper nesten.
- **`@scope` met nabijheid:** juiste semantiek, maar browsersteun is nog niet breed genoeg voor deze doelgroep.
- **Eén SVG met `fill: currentColor`:** netter, maar de logo's zijn vaste merkbestanden en mogen niet nagebouwd worden (SOUL).

## Gevolgen
- `src/styles/global.css` bevat deze regels; het blok "theme-specific assets" uit `bundle.css` is niet overgenomen in `components.css`.
- `src/styles/CLAUDE.md` → "Bekende valkuil" verwijst naar deze ADR.
