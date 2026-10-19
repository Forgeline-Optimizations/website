# Module: pages

> Heet `_CLAUDE.md` omdat Astro elk `.md`-bestand in `src/pages/` als route bouwt; het `_`-voorvoegsel sluit het uit.

**Verantwoordelijkheid:** routes. Elke pagina gebruikt `BaseLayout`, **behalve `/visitekaart`** (eigen minimale `CardLayout`, zie hieronder).
**Fase:** 1–3 — ✓

| Route | Bestand | Fase | Noindex? |
|---|---|---|---|
| `/` | `index.astro` — de vijf secties in volgorde | 1 (leeg), 2 (vol), 7 (vijf i.p.v. acht) | nee |
| `/request-received` | `request-received.astro` | 3 | ja |
| `/privacy` | `privacy.astro` | 3 | nee |
| `/voorwaarden` | `voorwaarden.astro` | 3 | nee |
| `/visitekaart` | `visitekaart.astro` | — (los plan: `.claude/docs/visitekaart-implementation-plan.md`) | ja |
| `404` | `404.astro` (GitHub Pages serveert `404.html`) | 3 | ja |

`/request-received` en `404` gebruiken het hoofdstukraster met `chapter--page` (`layout.css`): rail van boven, eindvierkant onder de inhoud. `/privacy` en `/voorwaarden` gebruiken `LegalLayout` en renderen `Content` uit `src/i18n/legal/privacy.nl.md` / `voorwaarden.nl.md` (datum en versie uit de frontmatter). Tekst aanpassen = alleen die Markdown bewerken; `tests/unit/legal.test.ts` bewaakt dat de bedrijfsgegevens gelijk blijven aan `site.ts` en dat er geen `[…]`-placeholders in staan.

### `/visitekaart` — verborgen digitale visitekaart
Gedeeld via NFC-tik of QR, nooit vanaf de site zelf: geen nav-item, geen footer-link, geen sitemap-vermelding (er is geen sitemap-integratie geïnstalleerd), `<meta name="robots" content="noindex, nofollow">`. Gebruikt `src/layouts/CardLayout.astro` (geen `NavBar`, `ForgeLine` of motion — moet meteen laden op een telefoon die net getikt is), tekst uit `t().visitekaart`, contactgegevens uit `src/data/visitekaart.ts` + `src/data/site.ts`. "Contact opslaan" linkt naar `public/sander-forgeline.vcf` (vCard 3.0, CRLF). Klikken loggen een Plausible-doel via `src/scripts/visitekaart.ts` (`window.plausible(naam)`, geen losse scriptvariant nodig). Details, links en QR-regeneratie: `docs/visitekaart/README.md`.

Engels komt later onder `src/pages/en/` (ADR-008). Geen andere routes zonder plan.
