# Module: layouts

**Verantwoordelijkheid:** `BaseLayout.astro`, de schil van elke pagina: `<html lang>`, `<head>` (meta, OG, favicon, canonical, fonts, Plausible), skip-link, `NavBar`, `<main id="main">`, `Footer`, en het inline `js`-klasse-script.
**Fase:** 1–3 — ✓

`LegalLayout.astro` (fase 3): `metaTitle`, `description`, `title`, `updated`, `version?`, `locale?`; licht thema (`<section id="legal" data-theme="light">`, zodat de nav mee wisselt), één leeskolom op `--measure`, h1 + "Laatst bijgewerkt" (+ "· Versie"). De slot krijgt gerenderde Markdown uit `src/i18n/legal/`; de layout stijlt h2, h3, p, ul, ol (genest), tabellen (blijven `display: table`, woorden breken af), vet en links.

`CardLayout.astro` (los plan, `.claude/docs/visitekaart-implementation-plan.md`): minimale layout voor `/visitekaart`, bewust zónder `SkipLink`/`NavBar`/`Footer`/`MotionLoader` — die horen bij het hoofdstukraster van de hoofdsite, niet bij een losse kaart die meteen moet laden. Props: `title`, `description`. Rendert alleen `<meta name="robots" content="noindex, nofollow">`, de globale CSS en (in productie) `Analytics`.

## Props
```ts
interface Props {
  title: string;          // volledige <title>
  description: string;
  locale?: Locale;        // default 'nl'
  noindex?: boolean;      // voor /request-received en 404
  ogImage?: string;       // default '/og-image.png'
  showChapters?: boolean; // nav met hoofdstuklabels; false op losse pagina's
  motion?: boolean;       // laadt src/scripts/motion lazy na `load`; alleen true op `/` (fase 4)
}
```

## Ontwerpkeuzes
- `<body data-theme="dark">` — secties overschrijven per stuk.
- Eerste script in `<head>`: `<script is:inline>document.documentElement.classList.add('js')</script>`.
- `import '../styles/global.css'` alleen hier.
- Fonts via `import '@fontsource/saira/latin-500.css'` (en 600, 700) in `global.css`; preload van het 700-gewicht (hero-kop) met `<link rel="preload" as="font" type="font/woff2" crossorigin>`.
- Canonical en OG-URL's uit `Astro.site`.
