# Fase 1 — Fundament

**Wat deze fase oplevert:** een Astro-project in de bestaande repo dat bij elke push naar `main` automatisch naar GitHub Pages deployt, met gegenereerde tokens, zelf gehoste fonts, `BaseLayout`, navigatie, footer en een testopzet.
**Bepalende keuze:** het design system is de bron (`design/design-system/tokens.json` → `src/styles/tokens.css`, ADR-006); niets in de site definieert eigen kleuren of maten.
**Buiten scope:** de hoofdstukken (fase 2), interactie en formulier (fase 3), animatie (fase 4), Plausible en DNS-livegang (fase 6; alleen de voorbereiding staat in stap 12).

Lees vooraf: ADR-001, ADR-002, ADR-006, ADR-008, `src/styles/CLAUDE.md`, `src/layouts/CLAUDE.md`, `src/components/CLAUDE.md`, `design/design-system/components/NavBar/` en `Footer/`.

---

### Stap 1 — Maak het Astro-project aan in de repo-root

**Waarom:** de repo bevat al `CLAUDE.md`, `.claude/`, `docs/`, `design/`, `public/` en `src/**/CLAUDE.md`. `create astro` weigert of overschrijft in een niet-lege map, dus scaffold in een tijdelijke map en kopieer alleen de projectbestanden.

**Wat:** 
```bash
npm create astro@latest ../fl-scaffold -- --template minimal --typescript strict --no-git --install
cp ../fl-scaffold/{package.json,package-lock.json,astro.config.mjs,tsconfig.json} .
cp -n ../fl-scaffold/.gitignore . 2>/dev/null || cat ../fl-scaffold/.gitignore >> .gitignore
cp -rn ../fl-scaffold/src/. src/      # -n: bestaande CLAUDE.md-bestanden blijven staan
rm -rf ../fl-scaffold && npm install
```
Zet in `package.json`: `"name": "forgeline-website"`, `"private": true`, `"engines": { "node": ">=22" }`. Voeg `src/styles/tokens.css` toe aan `.gitignore` (het wordt gegenereerd).

Controleer na afloop dat `src/**/CLAUDE.md`, `public/brand/`, `public/CNAME` en `src/assets/images/` nog bestaan.

---

### Stap 2 — Installeer de afhankelijkheden van fase 1

**Waarom:** alleen wat deze fase nodig heeft; GSAP komt in fase 4.

```bash
npm install tailwindcss @tailwindcss/vite @fontsource/saira
npm install -D vitest @playwright/test @axe-core/playwright prettier prettier-plugin-astro
npx playwright install --with-deps chromium
```

---

### Stap 3 — Configureer `astro.config.mjs`

**Waarom:** vaste site-URL voor canonical/OG, i18n zoals ADR-008, Tailwind via de Vite-plugin, geen `base` omdat het custom domain op de root staat.

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://forgelineoptimizations.nl',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' }, // /privacy → privacy/index.html, werkt op GitHub Pages
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
```
Laat `en` in de lijst staan ook al bestaan er nog geen Engelse pagina's.

---

### Stap 4 — Maak `scripts/sync-tokens.mjs`

**Waarom:** één bron voor alle tokens (ADR-006). Het script zet `tokens.json` om naar CSS-variabelen per thema, inclusief aliassen (`{smeedzwart}` → `var(--smeedzwart)`), en tekststijlklassen. Het draait vóór `dev`, `build` en `check`.

**Wat:** exporteer een pure functie (testbaar) en een CLI.

```js
// scripts/sync-tokens.mjs
// Genereert src/styles/tokens.css uit design/design-system/tokens.json.
// Nooit tokens.css met de hand bewerken: pas tokens.json aan en draai `npm run tokens`.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const SRC = new URL('../design/design-system/tokens.json', import.meta.url);
const OUT = new URL('../src/styles/tokens.css', import.meta.url);

/** "{naam}" → "var(--naam)"; alle andere waarden ongewijzigd. */
export const resolve = (v) => {
  const m = /^\{([A-Za-z0-9_.-]+)\}$/.exec(String(v));
  return m ? `var(--${m[1]})` : String(v);
};

/** Waarde voor een thema; ontbreekt die, dan die van het eerste thema, dan de eerste die er is. */
export const pick = (value, theme, first) =>
  typeof value === 'string' ? value : (value[theme] ?? value[first] ?? Object.values(value)[0]);

/** @param {any} t tokens.json @returns {string} CSS */
export function buildTokensCss(t) {
  const themes = t.color.themes.map((th) => th.id);
  const first = themes[0];
  const perTheme = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];

  const themeBlocks = themes.map((id) => {
    const selector = id === first ? `:root, [data-theme="${id}"]` : `[data-theme="${id}"]`;
    const lines = perTheme.map((tok) => `  --${tok.name}: ${resolve(pick(tok.value, id, first))};`);
    lines.push(`  color-scheme: ${id === 'light' ? 'light' : 'dark'};`);
    return `${selector} {\n${lines.join('\n')}\n}`;
  });

  const flat = ['spacing', 'radius', 'duration', 'easing', 'size']
    .flatMap((family) => t[family]?.tokens ?? [])
    .map((tok) => `  --${tok.name}: ${tok.value};`);
  const families = Object.entries(t.type.families).map(([k, stack]) => `  --font-${k}: ${stack};`);

  const styles = t.type.groups.flatMap((g) =>
    g.styles.map((s) => {
      const fam = s.family ?? g.family;
      const decl = [
        `font-family: var(--font-${fam});`,
        `font-size: ${s.fontSize};`,
        s.lineHeight && `line-height: ${s.lineHeight};`,
        s.fontWeight && `font-weight: ${s.fontWeight};`,
        s.letterSpacing && `letter-spacing: ${s.letterSpacing};`,
      ].filter(Boolean);
      return `.text-style-${s.name} { ${decl.join(' ')} }`;
    }),
  );

  return [
    '/* GENERATED from design/design-system/tokens.json by scripts/sync-tokens.mjs — do not edit */',
    ...themeBlocks,
    `:root {\n${[...flat, ...families].join('\n')}\n}`,
    ...styles,
    '',
  ].join('\n\n');
}

async function main() {
  const tokens = JSON.parse(await readFile(SRC, 'utf8'));
  await writeFile(OUT, buildTokensCss(tokens));
  console.log('tokens.css bijgewerkt');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
```

De `label`-stijl krijgt geen `text-transform` uit het token; dat staat in `components.css` (`.fl-label`).

---

### Stap 5 — Zet de scripts in `package.json`

**Waarom:** tokens moeten altijd vers zijn vóór dev/build/check, en CI roept dezelfde scripts aan als jij lokaal.

```json
"scripts": {
  "tokens": "node scripts/sync-tokens.mjs",
  "predev": "npm run tokens",
  "dev": "astro dev",
  "prebuild": "npm run tokens",
  "build": "astro build",
  "preview": "astro preview",
  "precheck": "npm run tokens",
  "check": "astro check && prettier --check .",
  "format": "prettier --write .",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```
Voeg `.prettierrc` toe met `{ "plugins": ["prettier-plugin-astro"], "singleQuote": true, "printWidth": 110 }` en een `.prettierignore` met `design/`, `dist/`, `src/styles/tokens.css`, `package-lock.json`.

---

### Stap 6 — Maak `src/styles/global.css`, `components.css` en `layout.css`

**Waarom:** `global.css` is de enige CSS-ingang; Tailwind moet de tokens als utilities kennen; de componentstijlen van het design system moeten 1-op-1 beschikbaar zijn.

**`global.css`:**
```css
@import 'tailwindcss';
@import '@fontsource/saira/latin-500.css';
@import '@fontsource/saira/latin-600.css';
@import '@fontsource/saira/latin-700.css';
@import './tokens.css';
@import './components.css';
@import './layout.css';

@theme {
  --color-*: initial; /* alleen tokenkleuren bestaan; voorkomt text-gray-500 e.d. */
  --font-*: initial;  /* Tailwind-fontnamen mogen niet botsen met --font-display/--font-sans uit tokens.css */
  --breakpoint-desk: 900px; /* desktop-layout vanaf 900px (docs/storyboard.md → Mobiel) */
}

@theme inline {
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-surface-sunken: var(--surface-sunken);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-forge: var(--forge);
  --color-forge-soft: var(--forge-soft);
  --color-on-forge: var(--on-forge);
  --color-status-ok: var(--status-ok);
  --color-status-error: var(--status-error);
  /* Andere namen dan in tokens.css: `--font-display: var(--font-display)` zou naar zichzelf verwijzen. */
  --font-heading: var(--font-display); /* utility: font-heading */
  --font-body: var(--font-sans);       /* utility: font-body */
}

@layer base {
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  body { margin: 0; background: var(--surface); color: var(--ink); font-family: var(--font-sans);
         font-size: 17px; line-height: 27px; -webkit-font-smoothing: antialiased; }
  [data-theme] { background: var(--surface); color: var(--ink); }
  :focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 3px; }
  [data-theme='dark'] .fl-only-light, [data-theme='light'] .fl-only-dark { display: none; }
  [hidden] { display: none !important; } /* componentklassen met display: flex mogen hidden niet overrulen */
}
```

**`components.css`:** kopieer `design/design-system/components/bundle.css` en pas alleen aan:
1. Verwijder het blok "theme-specific assets" (`html:not([data-theme="light"]) …`): staat nu in `global.css` (zie `src/styles/CLAUDE.md` → valkuil).
2. Voeg de site-hulpklassen toe, overgenomen uit `design/storyboard/styles/site.css` en hernoemd: `fl-grid-bg` (raster, 48px), `fl-rail`, `fl-rail--dim`, `fl-tick`, `fl-tag`, `fl-chip`, `fl-wire`, `fl-wire--chaos`, `fl-wire--lit`, `fl-wire--flow`, `fl-wire--ink`, `fl-wire--soft`.
3. Fluid koppen: `.fl-section-head h2 { font-size: clamp(32px, 1.6vw + 22px, 44px); line-height: 1.14; }`, `.fl-numeral { font-size: clamp(56px, 3vw + 40px, 96px); line-height: 1; }`, plus een nieuwe `.fl-display { font-family: var(--font-display); font-weight: 700; font-size: clamp(44px, 3.2vw + 26px, 72px); line-height: 1.06; letter-spacing: -0.01em; margin: 0; }`.

**`layout.css`:** het hoofdstukraster uit `docs/storyboard.md`:
```css
.chapter { position: relative; min-height: 100svh; padding-block: var(--space-24); }
@media (min-width: 900px) { .chapter { padding-block: var(--space-32); } }
.chapter__inner { max-width: 1260px; margin-inline: auto; padding-inline: var(--space-4);
                  display: grid; grid-template-columns: 16px minmax(0, 1fr); column-gap: var(--space-6); }
@media (min-width: 900px) {
  .chapter__inner { padding-inline: var(--space-6); grid-template-columns: 40px 160px minmax(0, 1fr); column-gap: 0; }
}
/* Fallback-rail zonder JS: verdwijnt zodra de SVG-forge line (fase 4) actief is (html.forge-js). */
.chapter__rail { position: relative; }
.chapter__rail::before { content: ''; position: absolute; top: 0; bottom: 0; left: 50%; width: 2px;
                         margin-left: -1px; background: var(--forge-soft); }
html.forge-js .chapter__rail::before { display: none; }
```
(Kolomnamen en -breedtes zijn het contract met fase 2; niet zonder ADR wijzigen.)

---

### Stap 7 — Maak `src/data/site.ts` en de i18n-basis

**Waarom:** nav, footer en meta hebben al tekst en bedrijfsgegevens nodig; die mogen nooit in componenten staan (ADR-008).

- `src/data/site.ts`: precies zoals in `src/data/CLAUDE.md`.
- `src/i18n/nl.ts`: in deze fase alleen de sleutels `meta`, `nav`, `common`, `footer` uit `docs/content-nl.md`. Vorm:
```ts
export const nl = {
  meta: {
    title: 'Forgeline Optimizations · Procesautomatisering & AI voor het mkb',
    description: 'Ik breng de processen van je bedrijf in kaart en automatiseer alleen wat zich terugverdient. Voor productie, handel en dienstverlening met 10 tot 100 mensen.',
  },
  nav: {
    label: 'Hoofdnavigatie',
    skip: 'Ga naar de inhoud',
    cta: 'Kennismaken',
    chapters: [
      { id: 'chaos', label: 'Chaos' }, { id: 'inzicht', label: 'Inzicht' }, { id: 'standaard', label: 'Standaard' },
      { id: 'automatisch', label: 'Automatisch' }, { id: 'oordeel', label: 'Oordeel' }, { id: 'aanbod', label: 'Aanbod' },
    ],
  },
  common: { example: 'Voorbeeld', scrollCue: 'Scroll · volg de lijn' },
  footer: { /* tagline, kopjes 'Contact' / 'Bedrijfsgegevens' / 'Juridisch', linkteksten, 'Cookieloze statistieken via Plausible' */ },
} as const;
```
- `src/i18n/types.ts` en `src/i18n/index.ts` zoals in `src/i18n/CLAUDE.md`.

---

### Stap 8 — Maak `src/layouts/BaseLayout.astro`

**Waarom:** één schil voor alle pagina's met correcte head, thema en landmarks.

**Wat:** props en keuzes staan in `src/layouts/CLAUDE.md`. Head bevat: charset, viewport, `<title>`, description, canonical (`new URL(Astro.url.pathname, Astro.site)`), `og:title/description/url/image/type/locale` (`nl_NL`), `twitter:card=summary_large_image`, `theme-color` `#111111`, favicon (`/favicon.svg`, `type="image/svg+xml"`), `apple-touch-icon`, `robots noindex` als `noindex`, preload van `saira-latin-700-normal.woff2` (pad via `import url from '@fontsource/saira/files/saira-latin-700-normal.woff2?url'`). Body: `data-theme="dark"`, `<SkipLink>`, `<NavBar>`, `<main id="main">` met `<slot />`, `<Footer>`.

---

### Stap 9 — Maak `Button.astro`, `SkipLink.astro`, `NavBar.astro` en `Footer.astro`

**Waarom:** de chrome van elke pagina; fase 2 bouwt erop door.

- **`ui/Button.astro`:** rendert `<a>` als `href` gezet is, anders `<button type={type ?? 'button'}>`. Klassen `fl-btn fl-btn--{variant}` (+ `fl-btn--sm`). Met `arrow`: `<span class="fl-btn__arrow" aria-hidden="true">→</span>`.
- **`site/SkipLink.astro`:** eerste focusbare element, visueel verborgen tot focus, linkt naar `#main`.
- **`site/NavBar.astro`:** markup uit `design/design-system/components/NavBar/preview.html`, maar `position: sticky; top: 0; z-index: 50`. Logo: twee `<img>` (`/brand/logo-horizontal-white.svg` met `fl-only-dark`, `/brand/logo-horizontal-black.svg` met `fl-only-light`), `width="160" height="34"`, `alt` = sitenaam. Hoofdstukken uit `t().nav.chapters` als `<a href="#{id}" data-nav-chapter="{id}">`. Onder 900px: lijst verborgen, logo vervangen door `/brand/icon-white.svg` (32 × 32), plus `<div class="fl-nav__progress" aria-hidden="true">` (2px oranje balk, breedte via CSS-variabele `--progress`). De nav heeft `data-theme` dat fase 2 (`nav-progress.ts`) laat meewisselen met de sectie eronder; standaard `dark`.
- **`site/Footer.astro`:** markup uit `Footer/preview.html`, gegevens uit `site.ts`, teksten uit `t().footer`, jaartal via `new Date().getFullYear()`. Op mobiel kolommen onder elkaar. Altijd `data-theme="dark"`.

---

### Stap 10 — Maak een tijdelijke `src/pages/index.astro`

**Waarom:** de pipeline en de layout moeten end-to-end werken voordat de hoofdstukken komen.

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { t } from '../i18n';
const d = t('nl');
---
<BaseLayout title={d.meta.title} description={d.meta.description} showChapters>
  <!-- Fase 2 vervangt dit door de acht secties. -->
  <section id="chaos" class="chapter fl-grid-bg" data-theme="dark">
    <div class="chapter__inner"><div></div><div></div>
      <h1 class="fl-display">Automatiseer wat het waard is. Ik help te vinden wat dat is.</h1>
    </div>
  </section>
</BaseLayout>
```
(De kop staat hier tijdelijk letterlijk; fase 2 haalt hem uit `nl.ts`.)

---

### Stap 11 — Zet de testopzet neer

**Waarom:** elke volgende fase voegt tests toe; de opzet moet nu staan (zie `tests/CLAUDE.md`).

- `vitest.config.ts`: `test: { include: ['tests/unit/**/*.test.ts'] }`.
- `playwright.config.ts`: `webServer: { command: 'npm run build && npm run preview -- --port 4321', port: 4321, reuseExistingServer: !process.env.CI }`, `use.baseURL: 'http://localhost:4321'`, projecten `desktop` (1440 × 900) en `mobile` (`devices['iPhone 13']` met chromium).
- `tests/unit/sync-tokens.test.ts` — zie Tests. Omdat de test een `.mjs`-bestand importeert, zet `"allowJs": true` in `tsconfig.json` (`compilerOptions`), anders klaagt `astro check`.
- `tests/e2e/smoke.spec.ts` en `tests/e2e/a11y.spec.ts` — zie Tests.

---

### Stap 12 — Maak `.github/workflows/deploy.yml` en bereid het domein voor

**Waarom:** elke push naar `main` moet getest en gedeployd worden (ADR-001); DNS heeft tijd nodig, dus nu al voorbereiden.

```yaml
name: CI en deploy
on:
  push: { branches: [main] }
  pull_request:
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: false }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run check
      - run: npm run test
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e

  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6   # draait `npm run build` → prebuild genereert tokens

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```
Controleer de actuele majorversies van de actions in de Astro-docs ("Deploy your Astro Site to GitHub Pages") en pas ze aan als ze veranderd zijn.

**Handmatige stappen voor Sander** (schrijf ze in de session-log en vraag om bevestiging):
1. Repo → Settings → Pages → Source: **GitHub Actions**.
2. Settings → Pages → Custom domain: `forgelineoptimizations.nl` (staat ook in `public/CNAME`).
3. GitHub-account → Settings → Pages → verifieer het domein (TXT-record bij TransIP).
4. TransIP → DNS (ADR-002): verwijder bestaande A/AAAA/CNAME op `@` en `www` van de TransIP-webhosting, voeg de vier A-records en vier AAAA-records van GitHub toe op `@`, en `www` CNAME `<gebruikersnaam>.github.io.`. **Raak MX, SPF, DKIM, DMARC niet aan.**
5. Zodra het certificaat er is: "Enforce HTTPS" aan.

---

## Tests

### `tests/unit/sync-tokens.test.ts`
**Bewijst:** het script zet tokens.json correct om, zodat kleuren nooit stil uit elkaar lopen.

| Test | Controleert |
|---|---|
| `resolves aliases to var()` | `resolve('{smeedzwart}') === 'var(--smeedzwart)'` |
| `keeps plain values` | `resolve('#ff8700') === '#ff8700'` |
| `dark is the root theme` | output bevat `:root, [data-theme="dark"] {` |
| `light overrides ink` | in het `[data-theme="light"]`-blok staat `--ink: var(--smeedzwart);` |
| `single-theme token falls back` | `logo-main` (alleen `light`) staat ook in het donkere blok met `#ff8700` |
| `emits type styles` | `.text-style-display {` met `font-size: 72px` |
| `real tokens.json builds` | `buildTokensCss` op het echte bestand gooit niet en bevat `--forge` en `--space-32` |

Representatieve test:
```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildTokensCss } from '../../scripts/sync-tokens.mjs';

const tokens = JSON.parse(readFileSync('design/design-system/tokens.json', 'utf8'));

describe('buildTokensCss', () => {
  it('light overrides ink with an alias to smeedzwart', () => {
    const css = buildTokensCss(tokens);
    const light = css.slice(css.indexOf('[data-theme="light"] {'));
    expect(light.slice(0, light.indexOf('}'))).toContain('--ink: var(--smeedzwart);');
  });
});
```

### `tests/e2e/smoke.spec.ts`
| Test | Controleert |
|---|---|
| `home renders` | status 200, `<html lang="nl">`, `<title>` = `meta.title` |
| `one h1` | precies één `h1` |
| `nav works` | nav zichtbaar, CTA linkt naar `#contact`; op mobiel geen hoofdstuklijst maar wel icoon + CTA |
| `footer has legal data` | footer bevat `42183249`, `NL005563350B62`, `1078 KG Amsterdam`, `info@forgelineoptimizations.nl` |
| `skip link` | eerste Tab focust de skip-link; Enter verplaatst focus naar `#main` |
| `fonts self-hosted` | geen request naar `fonts.googleapis.com` of `fonts.gstatic.com` (`page.on('request')`) |
| `no horizontal scroll` | op beide projecten: `document.documentElement.scrollWidth <= innerWidth` |

### `tests/e2e/a11y.spec.ts`
`AxeBuilder` op `/`: nul overtredingen met impact `serious` of `critical`.

---

## Acceptatiecriteria
- [ ] `npm run dev` toont nav, tijdelijke hero en footer in het donkere thema, met Saira in de kop.
- [ ] `src/styles/tokens.css` wordt gegenereerd en staat niet in git.
- [ ] Een Tailwind-utility als `text-ink-muted` werkt en wisselt mee in een `data-theme="light"`-blok; `text-gray-500` bestaat niet.
- [ ] Alle tests groen, lokaal en in CI.
- [ ] Push naar `main` deployt naar GitHub Pages (eerst op `<gebruikersnaam>.github.io`-URL, na DNS op het domein).

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore` | **Create** | Uit Astro-scaffold; scripts, engines |
| `astro.config.mjs` | **Create** | site, i18n, Tailwind |
| `scripts/sync-tokens.mjs` | **Create** | tokens.json → tokens.css |
| `.prettierrc`, `.prettierignore` | **Create** | Formatting |
| `src/styles/global.css` | **Create** | Ingang, `@theme inline`, base |
| `src/styles/components.css` | **Create** | Port van bundle.css + site-hulpklassen |
| `src/styles/layout.css` | **Create** | Hoofdstukraster, fallback-rail |
| `src/data/site.ts` | **Create** | Bedrijfsgegevens, diensten-config |
| `src/i18n/nl.ts`, `types.ts`, `index.ts` | **Create** | meta, nav, common, footer |
| `src/layouts/BaseLayout.astro` | **Create** | Head, landmarks |
| `src/components/ui/Button.astro` | **Create** | Knop/link |
| `src/components/site/SkipLink.astro`, `NavBar.astro`, `Footer.astro` | **Create** | Chrome |
| `src/pages/index.astro` | **Create** | Tijdelijke pagina |
| `vitest.config.ts`, `playwright.config.ts` | **Create** | Testopzet |
| `tests/unit/sync-tokens.test.ts` | **Create** | 7 tests |
| `tests/e2e/smoke.spec.ts`, `tests/e2e/a11y.spec.ts` | **Create** | 7 + 1 tests |
| `.github/workflows/deploy.yml` | **Create** | CI + deploy |
| `src/**/CLAUDE.md`, `public/*`, `src/assets/images/*` | **Audit** | Bestaan nog na de scaffold |
