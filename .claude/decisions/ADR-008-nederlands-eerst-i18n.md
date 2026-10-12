# ADR-008: Nederlands eerst, i18n vanaf dag één ingericht

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
De doelgroep is Nederlands. Sander wil later makkelijk een Engelse versie kunnen toevoegen.

## Beslissing
Astro-i18n met `defaultLocale: 'nl'`, `locales: ['nl', 'en']`, `prefixDefaultLocale: false`. Nederlandse pagina's op de root, Engelse later onder `/en/`. Alle UI-tekst in `src/i18n/nl.ts` (getypt object `Dictionary`); `src/i18n/index.ts` levert `t(locale)`. Secties krijgen `locale` als prop. `en.ts` wordt pas aangemaakt als de Engelse versie gebouwd wordt.

## Onderbouwing
Tekst uit componenten houden kost nu weinig en voorkomt later een verbouwing. Sander kan teksten aanpassen in één bestand.

## Overwogen alternatieven
- **Tekst inline in componenten:** sneller nu, duur later.
- **i18n-bibliotheek (i18next e.d.):** overkill voor twee talen statisch.

## Gevolgen
- `<html lang="nl">`; later `hreflang`-links tussen versies.
- Bedrijfsgegevens (KvK, adres) staan taalonafhankelijk in `src/data/site.ts`.
