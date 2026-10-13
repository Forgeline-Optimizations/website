# Module: tests

**Verantwoordelijkheid:** bewijzen dat de site werkt, toegankelijk is en snel blijft.
**Fase:** 1–5 — ⏳

| Map / bestand | Tool | Wat het bewijst |
|---|---|---|
| `tests/unit/*.test.ts` | Vitest | Pure logica: tokens-script, i18n-volledigheid, verdict-data |
| `tests/e2e/*.spec.ts` | Playwright | Pagina's renderen, anker-navigatie, verdict-interactie, formuliervalidatie, gedrag zonder JS en met reduced motion |
| `tests/e2e/a11y.spec.ts` | `@axe-core/playwright` | Nul "serious"/"critical"-overtredingen op `/`, `/privacy`, `/request-received`, in beide thema-secties |
| `lighthouserc.json` | Lighthouse CI | ≥ 0,95 op alle vier categorieën (fase 5) |

## Regels
- Playwright draait tegen `astro preview` (de echte build), niet tegen `astro dev`.
- Netwerk naar `api.web3forms.com` en Plausible wordt in e2e altijd onderschept; nooit echte aanvragen versturen. Plausible blokkeert `tests/e2e/fixtures.ts` automatisch: **elke spec importeert `test`/`expect` uit `./fixtures`, niet uit `@playwright/test`.** Web3Forms onderschept elke spec zelf (`page.route`).
- `tests/support/legal.ts` leest de juridische Markdown (Vitest en Playwright kunnen geen `.md` importeren).
- Elke fase voegt zijn tests toe in hetzelfde plan; een fase is pas af als alles groen is.
