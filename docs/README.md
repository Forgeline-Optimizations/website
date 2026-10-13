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
| 2 | **Plausible-snippet** (Site settings → Site Installation) | fase 6 | Analytics-component rendert niets zolang `plausibleScriptSrc` leeg is |
| 3 | ~~GitHub-gebruikersnaam~~ Opgelost: de repo staat in de organisatie `Forgeline-Optimizations`, dus `www` CNAME → `forgeline-optimizations.github.io.` | fase 1, stap 12 | — |
| 4 | **Privacyverklaring** (tekst) | fase 3 | Pagina met koppen en `[TEKST VOLGT — Sander]` |
| 5 | **Algemene voorwaarden** — let op: de NLdigital Voorwaarden mogen in principe alleen door leden van NLdigital gebruikt worden. Check dit, of kies een alternatief (bijv. eigen voorwaarden of een sjabloon van KVK/een jurist). | fase 3 | Pagina met `[TEKST VOLGT — Sander]` |
| 6 | **Professionele portretfoto** | fase 6 | `src/assets/images/sander-portrait-tijdelijk.jpg` |
| 7 | **Doelgroepgrootte**: board zegt 10–100, businessplan 10–50 | fase 2 | Board (10–100) is leidend |
| 8 | **Voorbeeldgetallen** in 04 en 05 zijn verzonnen en gelabeld als *Voorbeeld*; vervangen door echte cases zodra die er zijn | later | Zoals op het board |
| 9 | **Engelse versie** | later | i18n is ingericht, `en.ts` bestaat nog niet |
