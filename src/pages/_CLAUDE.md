# Module: pages

> Heet `_CLAUDE.md` omdat Astro elk `.md`-bestand in `src/pages/` als route bouwt; het `_`-voorvoegsel sluit het uit.

**Verantwoordelijkheid:** routes. Elke pagina gebruikt `BaseLayout`.
**Fase:** 1–3 — ✓

| Route | Bestand | Fase | Noindex? |
|---|---|---|---|
| `/` | `index.astro` — de acht secties in volgorde | 1 (leeg), 2 (vol) | nee |
| `/request-received` | `request-received.astro` | 3 | ja |
| `/privacy` | `privacy.astro` | 3 | nee |
| `/voorwaarden` | `voorwaarden.astro` | 3 | nee |
| `404` | `404.astro` (GitHub Pages serveert `404.html`) | 3 | ja |

`/request-received` en `404` gebruiken het hoofdstukraster met `chapter--page` (`layout.css`): rail van boven, eindvierkant onder de inhoud. `/privacy` en `/voorwaarden` gebruiken `LegalLayout`; de juridische tekst is `t().legal.placeholder` tot Sander hem levert.

Engels komt later onder `src/pages/en/` (ADR-008). Geen andere routes zonder plan.
