# ADR-006: Design system is de bron; fonts zelf gehost

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
Het design system "Forgeline" (snapshot in `design/design-system/`) bevat tokens voor een donker en een licht thema, de typeschaal en de componentstijlen (`fl-`-klassen). De huisstijl schrijft Arial voor documenten voor en staat Saira toe voor web.

## Beslissing
1. `design/design-system/tokens.json` is de enige bron van kleuren, spacing, radius, duur en easing. `scripts/sync-tokens.mjs` genereert `src/styles/tokens.css`; Tailwind leest die variabelen via `@theme inline`.
2. `design/design-system/components/bundle.css` wordt geport naar `src/styles/components.css` (zelfde klassennamen).
3. Saira 500/600/700 via `@fontsource/saira` (alleen latin-subset), `font-display: swap`; lopende tekst in de Arial-systeemstack.
4. Geen Google Fonts of andere externe font-CDN.

## Onderbouwing
Eén bron voorkomt dat kleuren uit elkaar lopen tussen ontwerp en site. Zelf hosten is sneller (geen extra DNS/TLS) en AVG-vriendelijker (geen IP-adressen naar Google).

## Overwogen alternatieven
- **Tokens met de hand in Tailwind-config:** loopt uit de pas met het design system.
- **Google Fonts:** externe request, privacybezwaar.

## Gevolgen
- Kleur aanpassen = `tokens.json` aanpassen + `npm run tokens`, en het design-system-artifact bijwerken.
- `ink-muted` (#A8A49D) is de webvervanger van Staalgrijs op donker; Staalgrijs zelf alleen in het lichte thema.
- Oranje tekst alleen in het donkere thema; op licht nooit (contrast 2,1:1).
