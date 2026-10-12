# Module: pages

**Verantwoordelijkheid:** routes. Elke pagina gebruikt `BaseLayout`.
**Fase:** 1–3 — 🔨

| Route | Bestand | Fase | Noindex? |
|---|---|---|---|
| `/` | `index.astro` — de acht secties in volgorde | 1 (leeg), 2 (vol) | nee |
| `/request-received` | `request-received.astro` | 3 | ja |
| `/privacy` | `privacy.astro` | 3 | nee |
| `/voorwaarden` | `voorwaarden.astro` | 3 | nee |
| `404` | `404.astro` (GitHub Pages serveert `404.html`) | 3 | ja |

Engels komt later onder `src/pages/en/` (ADR-008). Geen andere routes zonder plan.
