# ADR-007: Plausible voor statistieken, cookieloos

**Datum:** 2026-10-12
**Fase:** 0
**Status:** Geaccepteerd

## Context
Sander wil weten of de site werkt (bezoek, herkomst, aanvragen) zonder cookiebanner, passend bij zijn AVG-verhaal.

## Beslissing
Plausible Analytics. De tracking-snippet komt uit het Plausible-dashboard (Site settings → Site Installation) en wordt ongewijzigd in `src/components/site/Analytics.astro` gezet; de site-specifieke script-URL staat in `src/data/site.ts` (`plausibleScriptSrc`). Alleen geladen in productie-builds. Conversiedoel: pageview van `/request-received`. Formulierverzending en uitgaande links via de opties in het dashboard.

## Onderbouwing
Cookieloos en zonder persoonsgegevens, dus geen toestemming of banner nodig; EU-gehost.

## Overwogen alternatieven
- **Google Analytics:** cookies, banner, privacybezwaar.
- **Umami / Simple Analytics:** vergelijkbaar; Sander koos Plausible.

## Gevolgen
- Privacyverklaring noemt Plausible.
- Footer vermeldt "Cookieloze statistieken via Plausible".
- Lighthouse-metingen draaien op een build zonder het Plausible-script, of met het script uitgesteld (`defer`), zodat de gate niet afhangt van een externe server.
