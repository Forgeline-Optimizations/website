# Fase 6 — Lancering

**Wat deze fase oplevert:** de site live op https://forgelineoptimizations.nl met goede vindbaarheid en deelbaarheid, cookieloze statistieken met een conversiedoel, en een checklist die bewijst dat alles werkt.
**Bepalende keuze:** alles wat met derden te maken heeft (Plausible, Web3Forms, DNS) wordt pas nu definitief aangezet, op een site die al groen is.
**Buiten scope:** Engelse versie, case studies, blog.

Lees vooraf: ADR-002, ADR-003, ADR-007, ADR-009, `docs/README.md` → Open punten (1, 2, 3, 6).

---

### Stap 1 — Meta en Open Graph controleren in `BaseLayout.astro` (Audit)

**Waarom:** links worden gedeeld op LinkedIn en in WhatsApp; daar is de OG-preview het eerste beeld van het bedrijf.

**Wat:** controleer per pagina `title`, `description`, `canonical`, `og:*` en `twitter:card`. `og:image` = `https://forgelineoptimizations.nl/og-image.png` (1200 × 630, staat al in `public/`), `og:image:alt` = "Forgeline Optimizations — logo". Test met de LinkedIn Post Inspector zodra de site live is. Geen prijzen in teksten (ADR-009).

---

### Stap 2 — Voeg `@astrojs/sitemap` toe en maak `public/robots.txt`

**Waarom:** zoekmachines moeten de pagina's vinden; `/request-received` en 404 niet.

```bash
npx astro add sitemap
```
In `astro.config.mjs`: `sitemap({ filter: (page) => !page.includes('/request-received') })`.
`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://forgelineoptimizations.nl/sitemap-index.xml
```

---

### Stap 3 — Structured data in `src/components/site/StructuredData.astro`

**Waarom:** helpt Google het bedrijf als lokale zakelijke dienstverlener te tonen (naam, adres, contact).

**Wat:** JSON-LD alleen op `/`, uit `site.ts`, zonder prijzen:
```astro
---
import { site } from '../../data/site';
const data = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  url: site.url,
  email: site.email,
  logo: `${site.url}/brand/logo-stacked-on-orange.svg`,
  image: `${site.url}/og-image.png`,
  address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode,
             addressLocality: site.address.city, addressCountry: site.address.country },
  founder: { '@type': 'Person', name: 'Sander Nales' },
  areaServed: 'NL',
  knowsAbout: ['Procesautomatisering', 'Procesanalyse', 'AI-integratie', 'Workflowautomatisering'],
};
---
<script type="application/ld+json" set:html={JSON.stringify(data)} />
```
Valideer met de Rich Results Test na livegang.

---

### Stap 4 — Plausible in `src/components/site/Analytics.astro`

> **Status (2026-10-13): code gedaan, vervroegd.** Snippet staat erin (nieuw Plausible-script `pa-….js` + `plausible.init()`, `async` zoals de snippet, niet `defer`). Nog door Sander: doel "Aanvraag" in Plausible. Test: `pages.spec.ts` › `plausible loads on every page`.

**Waarom:** cookieloos meten wat de site oplevert (ADR-007). **Vraag Sander om de snippet** (open punt 2).

**Wat:** neem de snippet uit Plausible → Site settings → Site Installation **ongewijzigd** over; zet de script-URL in `site.plausibleScriptSrc`. Render alleen als `import.meta.env.PROD && site.plausibleScriptSrc`, met `defer`. In Plausible (door Sander): doel "Aanvraag" = pageview `/request-received`; outbound links en form submissions aan. Voeg in de privacypagina Plausible toe (staat er al als verwerker). Controleer dat de e2e-tests het script onderscheppen.

---

### Stap 5 — Web3Forms definitief maken

> **Status (2026-10-13): gedaan.** Key in `site.ts`, domein vastgezet en live getest door Sander.

**Waarom:** het formulier is de enige conversie; hij moet gegarandeerd aankomen. **Vraag Sander om de access key** (open punt 1).

**Wat:** vervang `WEB3FORMS_ACCESS_KEY` in `src/data/site.ts`. Sander zet in Web3Forms het domein vast op `forgelineoptimizations.nl` en controleert de redirect-URL. Na livegang: één echte testaanvraag (door Sander), controleren dat de mail binnenkomt op info@ en niet in spam.

---

### Stap 6 — Definitief portret (zodra beschikbaar)

**Waarom:** de tijdelijke foto is een placeholder (open punt 6).

**Wat:** nieuwe foto in `src/assets/images/sander-portrait.jpg` (staand, minimaal 960 × 1200), import in `OverMij.astro` aanpassen, tijdelijke foto verwijderen. Bijsnijding controleren op 320 en 280 breed.

---

### Stap 7 — DNS en HTTPS (samen met Sander)

**Waarom:** het domein moet naar GitHub Pages wijzen zonder de mail te raken (ADR-002).

**Wat:** loop de handmatige stappen uit fase 1, stap 12 na en vink af:
- [x] Pages-bron = GitHub Actions; custom domain ingesteld; domein geverifieerd.
- [x] A/AAAA op `@`, CNAME `www` → `<gebruikersnaam>.github.io.` bij TransIP.
- [ ] MX/SPF/DKIM/DMARC ongewijzigd (test: stuur een mail naar info@ en van info@ naar een extern adres). MX wijst nog naar `mx.zoho.eu` (2026-10-13); de mailtest zelf doet Sander.
- [x] `https://forgelineoptimizations.nl` en `https://www.forgelineoptimizations.nl` laden, `www` stuurt door naar zonder `www`.
- [x] "Enforce HTTPS" aan; `http://` stuurt door naar `https://` (gecontroleerd 2026-10-13, ook `www` → zonder `www`).

---

### Stap 8 — Livegangcontrole (Audit)

**Waarom:** het moment waarop de site echt het visitekaartje wordt; alles moet kloppen.

**Wat:** op de live URL:
- [ ] Alle tests groen in de laatste CI-run op `main`; Lighthouse ≥ 0,95 desktop en mobiel op de live URL (PageSpeed Insights).
- [ ] Alle teksten nog één keer door Sander gelezen op desktop en telefoon.
- [ ] Footer: adres, KvK, btw, e-mail correct.
- [x] Privacy en voorwaarden: placeholders vervangen door Sanders tekst (open punten 4 en 5), 2026-10-13.
- [ ] Formulier: echte testaanvraag aangekomen; `/request-received` telt als doel in Plausible.
- [ ] OG-preview op LinkedIn goed; favicon zichtbaar in tabblad en als bladwijzer op iOS.
- [ ] Sitemap bereikbaar; site aangemeld in Google Search Console (Sander).
- [ ] 404 werkt op een willekeurige URL.
Zet `CLAUDE.md` op "Live" met datum, schrijf de session-log, en tag de release: `git tag v1.0.0`.

---

## Tests
| Test | Controleert |
|---|---|
| `tests/e2e/seo.spec.ts` › `meta per page` | `/`, `/privacy`, `/voorwaarden`: title, description, canonical, `og:image` absoluut |
| `seo.spec.ts` › `noindex` | `/request-received` en 404: `robots` = `noindex` |
| `seo.spec.ts` › `structured data` | `/` bevat één `application/ld+json` met `@type` `ProfessionalService` en zonder `price` |
| `seo.spec.ts` › `sitemap` | `dist/sitemap-0.xml` bevat `/`, `/privacy/`, `/voorwaarden/` en niet `/request-received` |
| `seo.spec.ts` › `analytics only in prod` | in `astro preview` met lege `plausibleScriptSrc`: geen Plausible-request |
| `tests/unit/site.test.ts` › `no placeholder key in prod` | faalt als `import.meta.env.PROD`-build `WEB3FORMS_ACCESS_KEY` bevat (draai in CI alleen op `main`) |

## Acceptatiecriteria
- [ ] Site live op het domein met HTTPS; mail werkt ongewijzigd.
- [ ] Formulier, Plausible en OG-preview bevestigd op de live site.
- [ ] Livegangcontrole volledig afgevinkt.

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `src/layouts/BaseLayout.astro` | **Audit** | Meta/OG |
| `astro.config.mjs` | **Edit** | Sitemap |
| `public/robots.txt` | **Create** | Robots + sitemap |
| `src/components/site/StructuredData.astro` | **Create** | JSON-LD |
| `src/components/site/Analytics.astro` | **Create** | Plausible (prod) |
| `src/data/site.ts` | **Edit** | Access key, Plausible-URL |
| `src/assets/images/sander-portrait.jpg` | **Create** (wanneer beschikbaar) | Definitief portret |
| `src/sections/OverMij.astro` | **Edit** | Nieuwe foto |
| `src/pages/privacy.astro`, `voorwaarden.astro` | **Edit** | Sanders teksten |
| `tests/e2e/seo.spec.ts`, `tests/unit/site.test.ts` | **Create** | 5 + 1 tests |
| `CLAUDE.md`, `.claude/memory/session-log.md` | **Edit** | Status "Live" |
