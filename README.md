# forgelineoptimizations.nl

Website van Forgeline Optimizations — procesautomatisering & AI voor het mkb.

Statische Astro-site, gehost op GitHub Pages, domein bij TransIP. Elke push naar `main` wordt getest en gedeployd.

## Lokaal draaien
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # productiebuild in dist/
npm run test       # unit-tests
npm run test:e2e   # browsertests
```

## Waar staat wat
| Map | Inhoud |
|---|---|
| `src/i18n/nl.ts` | Alle teksten van de site |
| `src/data/site.ts` | Bedrijfsgegevens, formulier- en analytics-instellingen |
| `src/sections/` | De acht hoofdstukken van de pagina |
| `design/` | Ontwerp: storyboard en design system (alleen-lezen snapshots) |
| `docs/` | Brief, huisstijl, storyboard, teksten, open punten |
| `CLAUDE.md`, `.claude/` | Werkgeheugen en bouwplannen voor Claude Code |

## Met Claude Code verder bouwen
Open Claude Code in deze map en zeg: "Ga verder met de huidige fase." (De instructies voor de allereerste sessie staan in `.claude/archive/FIRST_SESSION.md`.)
