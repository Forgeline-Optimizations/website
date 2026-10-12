# Session Log

> **Protocol:** nieuwe entries bovenaan (onder deze kop), één per sessie. Schrijf zo dat een volgende sessie zonder de code te herlezen verder kan. Nieuwe beslissing = ADR in `.claude/decisions/` + link hier.

---

## Fase 1 — Sessie 1
**Datum:** 2026-10-12
**Doel:** oriëntatie (FIRST_SESSION) en fase 1 volledig: Astro-project, tokens, fonts, layout, nav, footer, tests, CI + deploy.
**Gedaan:**
- Branch `fase-1-fundament` (vanaf `init commit`; Sanders hulpbranch `dev/web` verwijderd), gemerged naar `main` met `--no-ff`.
- Astro **7.3.8** (vereist Node ≥ 22.12; `engines` daarom `>=22.12.0` i.p.v. `>=22`), Tailwind 4.3, Vitest 5, Playwright 1.64, TypeScript 6.
- `.gitattributes` met `eol=lf` (Windows-checkout gaf CRLF; anders faalt `prettier --check`).
- `scripts/sync-tokens.mjs` + 7 unit-tests; `src/styles/{global,components,layout}.css`; `src/data/site.ts`; `src/i18n/{nl,types,index}.ts` (incl. `hero.title` zodat `index.astro` geen tekst bevat); `BaseLayout`, `Button`, `SkipLink`, `NavBar`, `Footer`; tijdelijke `index.astro`.
- Playwright: 9 tests × 2 projecten (desktop 1440 × 900, mobile iPhone 13 op Chromium), incl. extra test `nav logo follows the nearest theme` (ADR-012). Axe: 0 serious/critical.
- `.github/workflows/deploy.yml`: versies gecontroleerd op 2026-10-12 → `checkout@v7`, `setup-node@v7` (plan zei v5), `withastro/action@v6`, `deploy-pages@v5`, `upload-artifact@v7`. Permissies per job (alleen deploy krijgt `pages: write`).
- Repo publiek gemaakt (Sanders akkoord), Pages aangezet met bron "GitHub Actions". Eerste run groen: test → build → deploy.
**Beslissingen:** [ADR-011](../decisions/ADR-011-astro-check-afhankelijkheden.md) (type-check-pakketten), [ADR-012](../decisions/ADR-012-themazichtbaarheid-via-variabelen.md) (themalogo's via variabelen + `@layer components`), [ADR-013](../decisions/ADR-013-logomaat-minimaal-140px.md) (logo 140 × 42).
**Kleinere afwijkingen van het plan (geen ADR nodig):**
- `src/pages/CLAUDE.md` → `src/pages/_CLAUDE.md`: Astro bouwde hem als route `/CLAUDE/`.
- Footerkoppen `<h2>` i.p.v. `<h3>` (koppenvolgorde); `<main tabindex="-1">` zodat de skip-link focus verplaatst; `scroll-padding-top: var(--nav-height)` tegen ankers onder de sticky nav.
- `Dictionary` = `Widen<typeof nl>` (strings verbreed), anders zou `en.ts` de Nederlandse tekst letterlijk moeten bevatten.
- Tailwind scant `design/`, `docs/`, `.claude/` en `*.md` niet (`@source not`).
- `.prettierignore` sluit ook `.claude/` en `*.md` uit (handgeschreven documentatie).
**Tests:** check groen (0 errors), test 7/7, e2e 18/18; lokaal én in CI (run 38313630123).
**Niet af / bekend:**
- **Preview op github.io is kaal:** de site staat op `https://forgeline-optimizations.github.io/website/`, maar de CSS geeft daar 404 (geen `base`, absolute paden). Verwacht en afgesproken; werkt zodra het custom domain gekoppeld is.
- **Mobiel raster wijkt af van het storyboard:** `layout.css` (contract uit fase 1) zet de inhoud op x = 56 en de lijn op x = 24; het storyboard wil x = 40 en x = 16. Oplossing (bijv. `padding-inline: 8px; column-gap: 16px`) vraagt een ADR: bespreek het aan het begin van fase 2.
- **Pushen:** Git Credential Manager op deze pc geeft 403, en het `gh`-token mist de `workflow`-scope. Gepusht via SSH (`git push git@github.com:Forgeline-Optimizations/website.git …`), wat werkt. Blijvende oplossing (keuze van Sander): remote op SSH zetten (`git remote set-url origin git@github.com:Forgeline-Optimizations/website.git`), of `gh auth refresh -s workflow` + `gh auth setup-git`.
- `ubuntu-latest` gaat vanaf 19-10-2026 naar Ubuntu 26 (CI-melding); in de gaten houden.

**Handmatige stappen voor Sander (domein, ADR-002):**
1. ~~Pages → Source: GitHub Actions~~ (al gedaan via de API).
2. **Organisatie** `Forgeline-Optimizations` → Settings → Pages → *Add a domain* → `forgelineoptimizations.nl` verifiëren (TXT-record bij TransIP). Eerst verifiëren, dan koppelen (tegen domain takeover).
3. TransIP → DNS: verwijder de A/AAAA/CNAME-records op `@` en `www` van de TransIP-webhosting. Voeg toe op `@`: A `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` en AAAA `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (controleer in de GitHub-docs). `www` → CNAME `forgeline-optimizations.github.io.` **Raak MX, SPF, DKIM en DMARC niet aan.**
4. Repo → Settings → Pages → Custom domain: `forgelineoptimizations.nl` (bij een Actions-deploy wordt `public/CNAME` genegeerd; de instelling is leidend).
5. Zodra het certificaat er is: "Enforce HTTPS" aan.

**Voor de volgende sessie:** fase 2 op branch `fase-2-statische-pagina`. Begin met de beslissing over het mobiele raster (hierboven). `nl.ts` heeft al `meta`, `nav`, `common`, `hero.title`, `footer`: vul aan, niet overschrijven. `astro preview` mag maar één keer tegelijk draaien (Astro 7): stop een eigen preview (`npx astro preview stop`) voordat je `npm run test:e2e` start.

---

## Fase 0 — Ontwerp vastgelegd
**Datum:** 2026-10-12
**Door:** Sander + Claude (chat), vóór de eerste Claude Code-sessie
**Wat er is:**
- Design system "Forgeline" (huisstijl v1.0 + donkere webvariant), snapshot in `design/design-system/`.
- Storyboard met 8 desktop-hoofdstukken en 3 mobiele frames, vastgelegd op versie `1791838245-b376`, snapshot in `design/storyboard/`.
- Geheugen-workspace: `CLAUDE.md`, `.claude/SOUL.md`, ADR-001 t/m ADR-010, fase-plannen 1–6.
- Merkbestanden in `public/` (logo's, favicon, apple-touch-icon, OG-afbeelding, tijdelijk portret, `CNAME`).
**Tekstwijzigingen van Sander op het board (al verwerkt in `docs/content-nl.md`):**
- Hero-kop: "Automatiseer wat het waard is. Ik help te vinden wat dat is."
- Doelgroep in hero: "10 tot 100 mensen" (businessplan zegt 10–50; Sander's bord is leidend).
- Contact-intro zonder "Ik reageer binnen twee werkdagen" (staat nog wel in het blok "Wat er daarna gebeurt").
- `MobielHero` op het board heeft nog de oude kop: **gebruik de desktoptekst**.
**Nog niets gebouwd.** Volgende stap: `.claude/FIRST_SESSION.md`.

---
<!-- SESSIE-SJABLOON

## Fase N — Sessie M
**Datum:** YYYY-MM-DD
**Doel:** <wat deze sessie moest opleveren>
**Gedaan:**
- <item, met bestanden>
**Beslissingen:** <"geen" of [ADR-0NN](../decisions/ADR-0NN-slug.md)>
**Tests:** <check / test / e2e / lhci: groen of wat faalt>
**Niet af:** <specifiek genoeg om op te pakken zonder alles te herlezen>
**Voor de volgende sessie:** <wat Claude Code eerst moet weten>

-->
