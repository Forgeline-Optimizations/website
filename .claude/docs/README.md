# Implementatieplannen

Instructies voor Claude Code, één plan per fase. Werk ze in volgorde af; een fase is pas af als alle stappen gedaan zijn, de acceptatiecriteria kloppen en de tests groen zijn. Vink daarna de fase af in `CLAUDE.md`, schrijf een session-log-entry en zet de volgende fase op "Huidig".

| Fase | Plan | Levert op | Afhankelijk van |
|---|---|---|---|
| 1 | `fase-1-fundament.md` | Astro-project, tokens, fonts, BaseLayout, nav, footer, CI + deploy | — |
| 2 | `fase-2-statische-pagina.md` | Alle acht hoofdstukken statisch, desktop + mobiel, statische forge line | 1 |
| 3 | `fase-3-interactie-en-formulier.md` | Verdict-interactie, contactformulier, `/request-received`, `/privacy`, `/voorwaarden`, 404 | 2 |
| 4 | `fase-4-beweging.md` | Forge line + scroll-choreografie per hoofdstuk | 2 (3 mag parallel) |
| 5 | `fase-5-kwaliteit.md` | Mobiele afwerking, toegankelijkheid, prestaties, Lighthouse-gate | 3, 4 |
| 6 | `fase-6-lancering.md` | SEO, OG, Plausible, DNS, livegang | 5 |

## Hoe je een plan gebruikt
- Elke stap noemt een bestand, **waarom** het nodig is en **wat** erin moet. De codevoorbeelden zijn bindend waar namen, attributen of tokens ertoe doen; elders zijn ze een richting.
- Wijk je af (omdat iets niet werkt of beter kan), schrijf dan een ADR en meld het in de session-log.
- Raadpleeg bij elke sectie het bijbehorende artboard in `design/storyboard/` en `docs/storyboard.md`. Bij tegenspraak: `docs/storyboard.md` > desktop-artboard > mobiel artboard.
- Commit per stap of per kleine groep stappen (Conventional Commits), op een branch `fase-N-<slug>`.

## Definition of done (elke fase)
- [ ] Alle stappen van het plan gedaan, of afwijking vastgelegd in een ADR.
- [ ] `npm run check`, `npm run test`, `npm run test:e2e` groen (vanaf fase 5 ook `npm run lhci`).
- [ ] Visueel vergeleken met de artboards op 1440 × 900 en 390 × 844.
- [ ] Geen tekst, kleur of maat hard-coded buiten `src/i18n`, `src/data` en de tokens.
- [ ] `CLAUDE.md` bijgewerkt (fase-status, takenlijst), session-log-entry geschreven.
