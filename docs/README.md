# Documentatie — Forgeline website

Deze map is voor mensen (Sander, en wie later meewerkt). Instructies voor Claude Code staan in `.claude/docs/`.

| Bestand | Inhoud |
|---|---|
| `brief.md` | Wat de site moet bereiken, voor wie, en hoe dat aansluit op het bedrijf |
| `brand.md` | Huisstijl op het web: kleuren, typografie, logo, beeld, en waar de webversie afwijkt van de documenthuisstijl |
| `storyboard.md` | De forge line hoofdstuk voor hoofdstuk: layout, inhoud en scroll-beweging |
| `content-nl.md` | Alle Nederlandse teksten (tot fase 2; daarna `src/i18n/nl.ts`) |

Ontwerpbronnen staan in `design/` (zie `design/README.md`).

## Teksten aanpassen (na fase 2)
Alle teksten staan in `src/i18n/nl.ts`. Pas de tekst tussen de aanhalingstekens aan, sla op, `git push`. Bedrijfsgegevens (adres, KvK, btw, e-mail) staan in `src/data/site.ts`.

## Open punten

| # | Punt | Nodig in | Placeholder tot die tijd |
|---|---|---|---|
| 1 | ~~Web3Forms access key~~ Opgelost (2026-10-13): staat in `src/data/site.ts`. Controleer in Web3Forms dat het domein is vastgezet. | fase 3 | — |
| 2 | ~~Plausible-snippet~~ Opgelost (2026-10-13): URL in `src/data/site.ts`, snippet in `Analytics.astro`. Doel "Aanvraag" (pageview `/request-received`) zet Sander in Plausible. | fase 6 | — |
| 3 | ~~GitHub-gebruikersnaam~~ Opgelost: de repo staat in de organisatie `Forgeline-Optimizations`, dus `www` CNAME → `forgeline-optimizations.github.io.` | fase 1, stap 12 | — |
| 4 | ~~Privacyverklaring~~ Opgelost (2026-10-13): `src/i18n/legal/privacy.nl.md` | fase 3 | — |
| 5 | ~~Algemene voorwaarden~~ Opgelost (2026-10-13): eigen voorwaarden (geen NLdigital), `src/i18n/legal/voorwaarden.nl.md`, versie 1.0 | fase 3 | — |
| 6 | **Professionele portretfoto** | fase 6 | `src/assets/images/sander-portrait-tijdelijk.jpg` |
| 7 | **Doelgroepgrootte**: board zegt 10–100, businessplan 10–50 | fase 2 | Board (10–100) is leidend |
| 8 | ~~Voorbeeldgetallen in 04 en 05~~ Vervallen (2026-10-19, fase 7): die hoofdstukken bestaan niet meer, Werkwijze is abstract en heeft geen verzonnen getallen ([ADR-015](../.claude/decisions/ADR-015-verhaal-inkorten.md)). | — | — |
| 9 | **Engelse versie** | later | i18n is ingericht, `en.ts` bestaat nog niet |
| 10 | **Teksten Werkwijze en hero-labels** zijn nu letterlijk uit het fase-7-plan; Sander herschrijft ze later in eigen woorden | later | Zoals in `src/i18n/nl.ts` → `hero.nodes`/`hero.nodesMobile`/`werkwijze` |
