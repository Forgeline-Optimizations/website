# Session Log

> **Protocol:** nieuwe entries bovenaan (onder deze kop), één per sessie. Schrijf zo dat een volgende sessie zonder de code te herlezen verder kan. Nieuwe beslissing = ADR in `.claude/decisions/` + link hier.

---

## Fase 7 — Verhaal inkorten
**Datum:** 2026-10-19
**Doel:** `.claude/docs/fase-7-verhaal-inkorten.md` volledig uitvoeren: acht hoofdstukken naar vijf, Inzicht/Standaard/Automatisch/Oordeel samen in één abstract hoofdstuk Werkwijze. Besluit vastgelegd in [ADR-015](../decisions/ADR-015-verhaal-inkorten.md).
**Branch:** `fase-7-verhaal-inkorten` (van `main`, na de fase-6-merge `56e24e8`).
**Stap 0 — afwijkingen van het plan gevonden vóór het bouwen:**
- Het plan noemt `ADR-011-verhaal-inkorten.md`, maar `ADR-011` t/m `ADR-014` bestaan al (fase 1/2/4/5-werk, van na dit plan geschreven is). Besluit vastgelegd als **ADR-015** in plaats van ADR-011.
- Verder kwamen alle genoemde bestandsnamen exact overeen met de huidige code (`Inzicht/Standaard/Automatisch/Oordeel.astro`, `verdict.ts`, `verdicts.ts`, `Badge.astro`, `Icon.astro`, `hero-chaos.ts`, `nl.ts`-sleutels) — geen verdere afwijkingen.
**Gedaan (volgt de stappen uit het plan):**
- `nl.ts`: `inzicht`/`standaard`/`automatisch`/`oordeel` eruit, `werkwijze` erbij (vier stappen + verdict met vier soorten werk); `nav.chapters` naar `werkwijze, aanbod, over-mij`; `hero.nodes` abstracte labels + nieuwe `hero.nodesMobile` (losse lijst van 3, niet meer een subset-index van de 7 desktoplabels); hoofdstuknummers Aanbod/Over mij/Contact naar 03/04/05.
- `verdicts.ts`: vier ids (`overtypen, rommelig, documenten, persoonlijk`), type `rules | ai | wait | no`; `verdictsMobile` vervallen (mobiel toont alle vier).
- `hero-chaos.ts`: `chaosNodesMobile.node` wijst nu naar `hero.nodesMobile` (eigen 3-lijst) i.p.v. een index in de 7-lijst.
- `Icon.astro`/`Badge.astro`/`components.css`: icoon + badge-variant `ai` erbij (`rules` deelt de stijl van de oude `go`).
- `Hero.astro`: `ctaSecondary` linkt naar `#werkwijze`; mobiele labels uit `hero.nodesMobile`.
- **`Chapter.astro` kreeg een named slot `rail`** (leeg bij de meeste hoofdstukken): niet in het plan letterlijk zo genoemd, maar nodig omdat het plan's Werkwijze-schets de chapter-shell (rail/nummer/kop) handmatig overtypte terwijl die al in `Chapter.astro` zit. Werkwijze gebruikt de slot voor vier extra `fl-tick`s (rail-markeringen per stap).
- **Nieuw `src/sections/Werkwijze.astro`**: vier stappen (`kaart, standaard, automatisch, advies`) met hergebruikte visuals (ProcessNode-rijen, chip-banen, verdictcard). `src/data/verdicts.ts`'s `Verdict`-type is heterogeen per stap in `nl.ts` (`steps: [...]`); de `Widen<T>`-helper in `src/i18n/types.ts` verbreedt een tuple tot de unie van zijn elementtypes (bestaand gedrag, nooit eerder een probleem omdat geen sectie vóór Werkwijze een tuple met verschillende vormen per stap had). Opgelost met een expliciete `as unknown as (typeof nl)['werkwijze']['steps']`-cast in `Werkwijze.astro`, niet door `Widen` aan te passen (zou andere i18n-aannames kunnen raken).
- Oude secties verwijderd: `Inzicht.astro`, `Standaard.astro`, `Automatisch.astro`, `Oordeel.astro`. `index.astro` nieuwe volgorde.
- `verdict.ts`: contract-commentaar bijgewerkt (verwijst niet meer naar Oordeel); de "sla verborgen knoppen over"-logica was al generiek (geen `inkoop`-specifieke code om te verwijderen, alleen het commentaar klopte niet meer).
- `BaseLayout.astro`: oude ankers (`#inzicht/#standaard/#automatisch/#oordeel`) → `#werkwijze`. **Niet** met `DOMContentLoaded` + gewone `scrollIntoView()` in `<head>` (zoals het plan schetst): dat races met het lazy laden van motion/fonts en faalt ongeveer de helft van de tijd (headless Chromium animeert `scroll-behavior: smooth` nauwelijks). Opgelost door het script ná `<main>`/`<Footer>` te zetten (synchroon, vóórdat `MotionLoader` lazy laadt) én `scrollIntoView({ behavior: 'instant' })` te gebruiken.
- `motion/chapters/werkwijze.ts` (nieuw, vervangt `inzicht.ts`/`standaard.ts`/`automatisch.ts`): per stap scrubt (`top 80%` → `center 50%`), geen pin. `pin.ts` is daardoor dood en verwijderd (niets pint meer sinds fase 7). `motion/index.ts` registreert `werkwijze` i.p.v. de drie oude modules.
- Docs bijgewerkt: `docs/storyboard.md` (sectie 02 herschreven, pagina-opbouw/beweging-tabellen), `docs/README.md` (open punt 8 vervallen, punt 10 toegevoegd: teksten nog in plan-vorm, Sander herschrijft later), `design/README.md` (oude artboards historisch), `CLAUDE.md`, `src/sections/CLAUDE.md`, `src/scripts/CLAUDE.md`, `src/components/CLAUDE.md`, `src/i18n/CLAUDE.md`.
**Twee layoutbugs gevonden tijdens het testen (niet in het plan, wel een gevolg ervan):**
- Werkwijze's stappen hebben een smallere inhoudskolom dan de oude, volle-breedte Inzicht/Automatisch (340px label + gap gaan er al af). Rijen van nodes/de 3-koloms grid van "Standaardiseren" overflowden de pagina tussen 900–1280px. Opgelost met lokale `overflow-x: auto` + `tabindex="0"` (axe `scrollable-region-focusable`) op `.wk-map__row`, `.wk-std`, `.wk-auto__nodes`, in plaats van de rij te laten passen (kon niet: vijf nodes × 132px past niet in de smalle kolom, ook niet op 1440).
- `.fl-badge` had geen `max-width`; in de smalle verdict-kolom overflowde het langste label ("Automatiseren · met AI") de pagina. `max-width: 100%` toegevoegd aan `.fl-badge` in `components.css` (geldt voor alle badges, niet alleen Werkwijze).
**Tests:** `npm run check` groen (astro check + prettier) · Vitest 24/24 · Playwright 127 groen + 7 bewust overgeslagen (mobiel/desktop-specifieke tests). `tests/e2e/werkwijze.spec.ts` nieuw (7 tests). Bestaande specs die naar oude ankers/secties verwezen bijgewerkt: `sections.spec.ts`, `verdict.spec.ts`, `motion.spec.ts`, `a11y.spec.ts`, `tests/unit/i18n.test.ts`. Testen die het verdict-blok direct na `page.goto()` aanspraken moesten eerst naar stap "advies" scrollen: die stap fadet in (`autoAlpha`) zodra hij in beeld komt, en dat gebeurt nu standaard ver onder de vouw (Werkwijze is ± 2,5 scherm, niet meer één scherm zoals het oude Oordeel).
**Niet af / bekend:**
- **Lighthouse-gate** (`npm run lhci`) bestaat nog niet — dat is fase 5, stap 4, en stond al open vóór deze sessie. Acceptatiecriterium "Lighthouse groen" kon daardoor niet gecheckt worden; wel `npm run check`, Vitest en Playwright (incl. axe) groen.
- Teksten in `werkwijze` en de hero-labels zijn letterlijk uit het plan overgenomen (Sander herschrijft ze later zelf, zoals het plan voorschrijft) — `docs/README.md`, open punt 10.
- Niet gemerged naar `main`; branch staat klaar voor review.

---

## Tussensessie — juridische teksten en Plausible
**Datum:** 2026-10-13
**Doel:** Sanders aangeleverde teksten (privacy, voorwaarden) en Plausible-snippet verwerken vóór fase 5.
**Bron:** `.claude/docs/notes/` (door Sander neergezet, niet gecommit): `privecyverklaring.md`, `algemene-voorwaarden.md`, `plausible-snippet.txt`. Na verwerking is `src/i18n/legal/` de bron, niet die notes.
**Gedaan:**
- Branch `fase-6-teksten-en-plausible` (fase-6-werk vervroegd), gemerged naar `main`.
- Teksten als Markdown in `src/i18n/legal/{privacy,voorwaarden}.nl.md`, gerenderd via `import { Content, frontmatter }` (Astro-standaard, geen pakket). Waarom geen `nl.ts`: 7 resp. 15 hoofdstukken met tabellen en geneste lijsten; Markdown kan Sander zelf bijwerken.
- `LegalLayout`: prop `version?`, stijlen voor h3, ol, geneste lijsten, tabellen. `nl.ts` → `legal`: placeholder, koppen, verwerkers en `kvk` weg; `version` erbij.
- `Analytics.astro` + `site.plausibleScriptSrc`; `BaseLayout` rendert hem als `PROD && url`. Alle pagina's, ook `/request-received` (doel) en 404.
- Tests: `tests/e2e/fixtures.ts` (auto-fixture blokkeert plausible.io; alle specs importeren daaruit), `tests/support/legal.ts`, `tests/unit/legal.test.ts` (4: bedrijfsgegevens = `site.ts`, geen `[…]`-placeholders, datum/versie, verwerkers), `pages.spec.ts` herschreven (privacy, voorwaarden, tabel op 360, Plausible op elke pagina).
**Wijzigingen aan Sanders tekst (met zijn akkoord, via vragen):**
- Web3Forms: zijn tekst zei "slaat inhoud niet op, servers in de VS". Volgens de DPA van Web3Forms (web3forms.com/dpa, versie 1.0, juli 2026): Web3Creative zit in India, inzendingen hebben een TTL van 3 jaar op AWS, doorgifte via SCC's (in de DPA opgenomen). Alinea, tabelrij en doorgifte-zin daarop aangepast; "in de Verenigde Staten" → "buiten de EU".
- Zoho Mail: EU (MX = `mx.zoho.eu`). Boekhoudpakket- en accountantrij weggelaten (nog geen). Datum 13 oktober 2026, voorwaarden versie 1.0.
- Opmaak: link naar artikel 11 van de voorwaarden, link naar autoriteitpersoonsgegevens.nl, e-mailadressen als `<…>`-autolink.
**Tests:** check 0 errors · unit 23/23 · e2e 114 groen + 6 bewust overgeslagen.
**Niet af / bekend (aan Sander gemeld):**
- Privacy belooft 12 maanden voor contactaanvragen, Web3Forms bewaart inzendingen tot 3 jaar: inzendingen in het Web3Forms-dashboard periodiek verwijderen, of de tekst aanpassen.
- Plausible-doel "Aanvraag" zelf instellen; mailtest (MX/SPF ongewijzigd) zelf doen.
**Voor de volgende sessie:** fase 5. Plausible laadt nu in de productie-build: Lighthouse (stap 4) meet het mee; het script is `async`, dus niet render-blokkerend.

## Fase 4 — Sessie 1
**Datum:** 2026-10-13
**Doel:** fase 4 volledig: forge line als SVG-laag, één bewegend idee per hoofdstuk.
**Vooraf (op `main`):** Web3Forms-key van Sander gecommit (`chore(contact)`), open punt 1 in `docs/README.md` afgesloten. Custom domain staat in GitHub Pages (`cname: forgelineoptimizations.nl`); "Enforce HTTPS" stond nog uit.
**Gedaan:**
- Branch `fase-4-beweging`, gemerged naar `main`. `gsap` 3.15.0 (plan noemt het; geen ADR nodig).
- `src/scripts/motion/`: `index.ts`, `context.ts`, `forge-path.ts` (pure rekenkunde, unit-getest), `forge-line.ts`, `chapters/{hero,inzicht,standaard,automatisch,aanbod,over-mij,contact,pin}.ts`.
- `ForgeLine.astro` `part="layer"` (SVG in `index.astro` als eerste kind van `<main>`); `MotionLoader.astro` (script in een eigen component: een `<script>` binnen een `{motion && …}`-expressie verwerkt Astro niet betrouwbaar); `BaseLayout` prop `motion`.
- Markup-haakjes: `data-deviation` (Standaard), `data-old/-arrow/-new` + `.is-before` (Automatisch), `.fl-dawn` (Aanbod). CSS onder `html.forge-js`: ticks en statisch startvierkant weg, `.fl-node` zonder transform-transitie, `#main { position: relative }`.
**Afwijkingen van het plan (bewust, geen ADR):**
- Lijn: geen `getPointAtLength`-opzoektabel maar exacte rekenkunde op de H/V-polylijn; het opgelichte deel is een eigen `d`-pad i.p.v. dasharray. Bochten krijgen "virtuele" scrollhoogte (anders verschijnt de 586px horizontale bocht onder de hero in één frame); het kopje wijkt daardoor hooguit 120px af van het schermpunt (unit-test).
- Pins op het **blok** (`center 55%`), niet op de sectie (`top top`): het blok blijft midden in beeld, ook op lage schermen. En alleen als het blok ≤ 80% van de schermhoogte is (`pin.ts`); op 1024 × 768 pint Automatisch dus niet (gestapeld te hoog), maar speelt wel mee.
- Staten via `data-state` (Inzicht chaos → mapped, Standaard mapped → standard, Automatisch standard → automated) in plaats van getweende `borderColor`/`boxShadow`: de CSS-transities uit het design system doen de overgang.
- `.fl-dawn`: verloop over de hoofdstuk-padding, niet 30vh (zou over het verdict-blok vallen).
- Standaard: afwijkende chips eindigen op 25% (storyboard: "vervagen"); zonder beweging staan ze op 100% zoals het board.
**Tests:** check 0 errors · unit 19/19 (nieuw: `forge-path.test.ts`, 8) · e2e 110 groen + 6 bewust overgeslagen. Nieuw `motion.spec.ts` (9: de 8 uit het plan + "lijn eindigt bij de verzendknop"). Bestaande tests (incl. axe) draaien nu mét beweging en blijven groen.
**Visuele controle:** 1440 × 900 op 12 scrollposities, 390 × 844, 1024 × 768. Gevonden en opgelost: Inzicht-nodes bleven op −3° staan (`from()` las de chaos-rotatie als eindwaarde → `fromTo`), Automatisch-lijn koos de verkeerde richting als hij ingeklapt was, dubbele witruimte rond `→` in de chips.
**Niet af / bekend:**
- Motion-chunk 122 KB ongecomprimeerd (± 45 KB gzip); meten in fase 5 tegen het budget (ADR-010).
- Juridische teksten (open punt 4–5): Sander vroeg waar die moeten; uitgelegd in het fase-4-rapport (`src/pages/privacy.astro` en `voorwaarden.astro`, of tekst aan Claude geven).
**Voor de volgende sessie:** fase 5 op branch `fase-5-kwaliteit`. Let bij Lighthouse op de pins (CLS) en de motion-chunk; de e2e-test `no layout shift from motion` meet alleen na laden.

---

## Fase 3 — Sessie 1
**Datum:** 2026-10-13
**Doel:** fase 3 volledig: verdict-interactie, contactformulier met validatie en fetch, losse pagina's.
**Gedaan:**
- Branch `fase-3-interactie-en-formulier`, gemerged naar `main`.
- `verdict.ts` (plan-code, plus `data-switched` zodat de fade alleen na een keuze speelt, niet bij het laden); `Oordeel.astro` met `aria-live="polite"` op `.fl-verdict__panels`.
- `Field.astro`, `NextSteps.astro` (uit `Contact.astro` gehaald; `level` 2/3 voor de koppenvolgorde), `contact-form.ts`, `Contact.astro` omgezet (privacy-checkbox in een eigen `[data-field="privacy"]` met foutmelding, want een `<p>` mag niet in de `<label>`).
- `/request-received` en `404` op het hoofdstukraster (`chapter--page` in `layout.css`); `LegalLayout.astro` + `/privacy` (koppen, bedrijfsgegevens en verwerkers ingevuld, verder `[TEKST VOLGT — Sander]`) en `/voorwaarden`.
- `nl.ts`: `received.metaDescription`, `notFound.metaTitle/metaDescription`, nieuw blok `legal` (placeholder, koppen, verwerkers). Deze meta-teksten en koppen zijn door mij geschreven; geen juridische inhoud.
**Afwijkingen van het plan (bewust, geen ADR):**
- `novalidate` staat **niet** in de HTML maar wordt door `contact-form.ts` gezet. Zo houdt de no-JS-versie de browservalidatie (het plan zou die zonder JS helemaal uitzetten).
- Bericht is nu **verplicht** (`required`): het plan test een fout bij "bericht"; in het design system was het optioneel. Sander kan dit terugdraaien door `required` weg te halen bij `contact-message` in `Contact.astro` (en de tests).
- Na succes gaat de browser naar het **pad** van `redirect` (`/request-received`), niet naar de volle URL: zelfde domein, ook op localhost/preview.
- E-mailcontrole strenger dan de browser: `marieke@domein` (zonder punt) is fout.
- De NLdigital-notitie (open punt 5) staat als code-commentaar in `voorwaarden.astro`, niet zichtbaar op de pagina: interne notitie hoort niet op een publieke site.
- "Laatst bijgewerkt" toont de placeholder; vul de datum in bij `updated=` in `privacy.astro`/`voorwaarden.astro` zodra de tekst er is.
**Tests:** check 0 errors · unit 11/11 · e2e 94 groen + 4 bewust overgeslagen. Nieuw: `verdict.spec.ts` (7, incl. `aria-live`), `contact.spec.ts` (10, incl. "geen dubbele verzending" en "spatie vóór (optioneel)"), `pages.spec.ts` (5, incl. footerlinks); `a11y.spec.ts` ook met formulierfouten zichtbaar en op de vier losse pagina's. Web3Forms wordt in elke test onderschept (`beforeEach` → abort).
**Visuele controle:** `/request-received`, `404`, `/privacy`, verdict en formulier (fouten + mislukte verzending) op 1440 en 390. Gevonden en opgelost: verdwenen spaties ("Telefoon(optioneel)", "1078 KGAmsterdam", "KvK42183249"; Astro laat witruimte tussen expressies op losse regels vallen → template strings) en lijst zonder opsommingstekens.
**Niet af / bekend:**
- Web3Forms access key is nog de placeholder (open punt 1): echt versturen werkt pas als Sander de key in `src/data/site.ts` zet en in Web3Forms het domein vastzet.
- Juridische teksten (open punt 4–5).
- Pushen nog steeds via SSH (zie fase 1).
**Voor de volgende sessie:** fase 4 op branch `fase-4-beweging`. De statische rail (`.chapter__rail::before`) en de haak (`.fl-forge-end`) verdwijnen al onder `html.forge-js`; de SVG-laag moet ook de breuk hero ↔ Inzicht dichten. `/request-received` en `404` hebben een eigen rail (`chapter--page`) en krijgen geen motion.

---

## Fase 2 — Sessie 1
**Datum:** 2026-10-13
**Doel:** fase 2 volledig: alle acht hoofdstukken statisch, desktop + mobiel, statische forge line, nav-voortgang.
**Gedaan:**
- Branch `fase-2-statische-pagina`, gemerged naar `main`.
- `nl.ts` volledig (`docs/content-nl.md` heeft nu de "vervangen"-melding). Toegevoegd t.o.v. content-nl: `oordeel.items.inkoop.shortTitle = 'Leverancier'` (test eist een shortTitle voor elke stap; inkoop is mobiel verborgen), `contact.fields.honeypot`, `contact.privacy.{before,linkText,after}`, `inzicht.steps[].painpoint` (knelpunt hangt aan de verbinding ná die stap).
- `verdicts.ts`, `hero-chaos.ts` (incl. mobiele doos 334 × 200).
- UI: `SectionHeader`, `ProcessNode` (`--fl-rotate`), `Icon`, `Badge`, `ServiceCard` (mobiel compact via CSS, geen `compact`-prop).
- Site: **`Chapter.astro`** (de vaste hoofdstukstructuur als component, met tick en `data-forge-anchor="chapter"`), **`ForgeLine.astro`** met `part="start"` (Hero) en `part="end"` (Contact) i.p.v. één component in `<main>`.
- Acht secties in `src/sections/`, `index.astro`, `nav-progress.ts` (`initNavProgress()`, geladen vanuit `NavBar`).
- `layout.css`: mobiel raster volgens het storyboard ([ADR-014](../decisions/ADR-014-mobiel-hoofdstukraster.md)); rail = `forge` en loopt over de volle sectiehoogte (`chapter__inner` vult de sectie via flex, anders gaten bij `min-height: 100svh`); `chapter--end` voor Contact.
**Beslissingen:** [ADR-014](../decisions/ADR-014-mobiel-hoofdstukraster.md). Kleinere keuzes staan in `src/sections/CLAUDE.md` → "Zoals gebouwd (fase 2)" (breekpunten 1200/1280, hero-schaal per breekpunt, flow als CSS-gradient, mobiele verdict-volgorde).
**Tests:** check 0 errors · unit 11/11 · e2e 42 groen + 2 bewust overgeslagen (mobiel-only op desktop en omgekeerd). Nieuw: `tests/unit/i18n.test.ts`, `tests/e2e/sections.spec.ts` (incl. extra: geen horizontale scroll op 900/1024/1199/1200/1279/1280, en "met JS precies één paneel"), `a11y.spec.ts` draait nu met `#chaos`, `#oordeel`, `#aanbod`, `#contact` in beeld.
**Visuele controle (1440 × 900 en 390 × 844, naast de artboards):**
- Binnen ± 32px: raster (rail x ≈ 134, nummer x ≈ 154, inhoud x ≈ 314 tegen 120/160/320 op het board), hero (tekst x 108, chaos-veld 772–1372), alle koppen en blokken.
- Afwijkingen > 32px, bewust: (1) inhoudskolom is 1012 breed i.p.v. 1060, dus Inzicht/Automatisch staan iets dichter op elkaar; (2) Automatisch-nodes zijn breder dan op het board (index "Stap 01 · Automatisch" op één regel), tussenruimte 24 i.p.v. 72; (3) Standaard: banenkolom krimpt tot de inhoud (curves sluiten direct aan op de chips, op het board zat er ± 100px lucht).
- Mobiel: geen horizontale scroll; lijn x = 16, inhoud x = 40; nav + logo wisselen naar licht bij Aanbod/Contact; voortgangsbalk werkt.
**Niet af / bekend:**
- Tussen 900 en 1200/1280px vallen Inzicht, Automatisch, Standaard, Contact, ladder en profiel terug op de mobiele stapel (rijen passen niet in de smalle kolom). Werkt, maar is niet ontworpen; eventueel in fase 5 verfijnen.
- `NextSteps` staat nog inline in `Contact.astro` (`.fl-next`); fase 3 haalt hem eruit voor `/request-received`.
- Tussen hero en Inzicht is de statische lijn onderbroken (hero: midden, hoofdstukken: links). Fase 4 verbindt ze met de SVG-laag.
- DNS: Sander heeft de records aangepast (2026-10-13); custom domain + "Enforce HTTPS" in GitHub nog controleren zodra DNS is doorgekomen.
**Voor de volgende sessie:** fase 3 op branch `fase-3-interactie-en-formulier`. Verdict-panelen wisselen via `data-active` (CSS in `components.css` regelt de zichtbaarheid met en zonder JS); de knoppen hebben al `aria-pressed`/`aria-controls`. Formulier staat zonder `novalidate`; zet dat pas aan samen met `contact-form.ts`. Screenshots maken: zet `scroll-behavior: auto`, anders vangt Playwright een smooth-scroll halverwege.

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
