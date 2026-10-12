# Fase 2 — De statische pagina

**Wat deze fase oplevert:** alle acht hoofdstukken van het storyboard als statische, volledig leesbare HTML, met de echte teksten uit `src/i18n/nl.ts`, op desktop en mobiel, inclusief een statische forge line (CSS-rails) en meelopende navigatievoortgang.
**Bepalende keuze:** de artboards zijn absolute composities op 1440 breed; de site bouwt ze na met het hoofdstukraster uit fase 1 (`chapter__inner`: rail | nummer | inhoud) en flex/grid. Doel: op 1440 × 900 binnen ± 32px gelijk aan het artboard; op 390 breed gelijk aan de mobiele frames (of de regels in `docs/storyboard.md` → Mobiel).
**Buiten scope:** verdict-gedrag en formulierverzending (fase 3), GSAP (fase 4). Het formulier en het verdict-paneel staan er wel al als statische HTML.

Lees vooraf: `docs/storyboard.md`, `docs/content-nl.md`, `src/sections/CLAUDE.md`, `src/components/CLAUDE.md`, en per stap het genoemde artboard + design-system-component.

---

### Stap 1 — Vul `src/i18n/nl.ts` volledig

**Waarom:** vanaf nu is dit bestand de bron van alle tekst (ADR-008); secties mogen niets letterlijk bevatten.

**Wat:** voeg de sleutels `hero`, `inzicht`, `standaard`, `automatisch`, `oordeel`, `aanbod`, `overMij`, `contact`, `received`, `notFound` toe, één-op-één uit `docs/content-nl.md`. Gebruik arrays van objecten voor lijsten:

```ts
hero: {
  kicker: 'Procesautomatisering & AI voor het mkb',
  kickerShort: 'Procesautomatisering & AI',
  title: 'Automatiseer wat het waard is. Ik help te vinden wat dat is.',
  lead: 'Voor productie-, handels- en dienstverlenende bedrijven met 10 tot 100 mensen. Eerst je processen in kaart, dan pas de software.',
  ctaPrimary: 'Plan een kennismaking',
  ctaSecondary: 'Hoe ik werk',
  nodeIndex: 'Stap ?',
  nodes: ['Order uit e-mail', 'Offerte in Word', 'Planning in Excel', 'Overtypen in ERP',
          'Voorraad nabellen', 'Factuur handmatig', 'Welke versie klopt?'],
},
oordeel: {
  // …kicker, title, lead, exampleLabel
  verdictLabels: { go: 'Automatiseren', wait: 'Eerst standaardiseren', no: 'Niet automatiseren' },
  items: {
    offerte: { title: 'Offerte opstellen', shortTitle: 'Offerte opstellen',
               meta: '± 40× per week · 25 min per offerte · 2 systemen',
               reason: 'Elke week dezelfde stappen en de gegevens staan al in het ERP. Een sjabloon dat zichzelf vult scheelt ± 13 uur per week.' },
    // factuur, planning, klacht, inkoop
  },
},
```
Zet bovenaan `docs/content-nl.md`: "> Vervangen door `src/i18n/nl.ts` (fase 2). Dit document wordt niet meer bijgewerkt."

---

### Stap 2 — Maak `src/data/verdicts.ts` en `src/data/hero-chaos.ts`

**Waarom:** structuur (welke stap welk verdict heeft, waar een chaos-node staat) is geen tekst en hoort niet in i18n; scheiden houdt een vertaling simpel.

```ts
// src/data/verdicts.ts
export type Verdict = 'go' | 'wait' | 'no';
export const verdicts = [
  { id: 'offerte', verdict: 'go' },
  { id: 'factuur', verdict: 'go' },
  { id: 'planning', verdict: 'wait' },
  { id: 'klacht', verdict: 'no' },
  { id: 'inkoop', verdict: 'no' },
] as const satisfies readonly { id: string; verdict: Verdict }[];
// Mobiel toont alleen deze vier, in deze volgorde (MobielOordeel.dc.html):
export const verdictsMobile = ['offerte', 'planning', 'klacht', 'factuur'] as const;
export const defaultVerdict = 'offerte';
```

```ts
// src/data/hero-chaos.ts — coördinaten uit design/storyboard/Main.dc.html (doos 600 × 580)
export const chaosBox = { width: 600, height: 580 };
export const chaosNodes = [
  { x: 20, y: 30, rotate: -4 }, { x: 300, y: 0, rotate: 3 }, { x: 370, y: 170, rotate: -2 },
  { x: 60, y: 220, rotate: 5 }, { x: 250, y: 330, rotate: -6 }, { x: 40, y: 430, rotate: 2 },
  { x: 330, y: 470, rotate: 4 },
]; // index i hoort bij t().hero.nodes[i]
export const chaosWires = [
  'M115 62 C 220 -10, 300 120, 395 32', 'M115 62 C 40 140, 240 160, 155 252',
  'M395 32 C 520 60, 380 140, 455 202', 'M455 202 C 360 300, 260 160, 155 252',
  'M155 252 C 260 260, 200 400, 345 362', 'M345 362 C 520 340, 560 260, 455 202',
  'M345 362 C 300 460, 160 380, 135 462', 'M135 462 C 250 560, 330 430, 425 502',
  'M425 502 C 560 470, 420 400, 345 362', 'M395 32 C 300 200, 470 280, 345 362',
];
```

---

### Stap 3 — Maak de UI-componenten `SectionHeader`, `ProcessNode`, `Icon`, `Badge`, `ServiceCard`

**Waarom:** elk hoofdstuk gebruikt ze; markup volgt het design system letterlijk zodat `components.css` direct werkt.

- **`SectionHeader.astro`** (bron: `SectionHeader/preview.html`):
  ```astro
  ---
  interface Props { kicker: string; title: string; lead?: string; titleId: string; level?: 1 | 2 }
  const { kicker, title, lead, titleId, level = 2 } = Astro.props;
  const H = level === 1 ? 'h1' : 'h2';
  ---
  <header class="fl-section-head">
    <p class="fl-kicker fl-label">{kicker}</p>
    <H id={titleId}>{title}</H>
    {lead && <p>{lead}</p>}
  </header>
  ```
  Het hoofdstuknummer is géén onderdeel van de header: het staat in kolom 2 van `chapter__inner` (zie `src/sections/CLAUDE.md`).
- **`ProcessNode.astro`** (bron: `ProcessNode/preview.html`): `<div class="fl-node" data-state={state} style={rotate ? `--fl-rotate:${rotate}deg` : undefined}>` met `fl-node__index fl-label`, `fl-node__name`, optioneel `fl-node__port`. Pas in `components.css` de chaos-regel aan van `transform: rotate(-3deg)` naar `transform: rotate(var(--fl-rotate, -3deg))`.
- **`Icon.astro`:** vijf inline SVG's (`arrow`, `pause`, `no`, `check`, `alert`), 14 × 14, `aria-hidden="true"`, `currentColor`; paden letterlijk uit `VerdictCard/preview.html` en `ContactForm/preview.html`.
- **`Badge.astro`:** `<span class="fl-badge fl-badge--{verdict}"><Icon name={…} />{label}</span>`; mapping `go→arrow`, `wait→pause`, `no→no`.
- **`ServiceCard.astro`** (bron: `ServiceStep/preview.html`): `<article class="fl-service" class:list={{ 'fl-service--entry': entry }}>`; met `compact` (mobiel) zonder lijst en met de kleinere maten uit `MobielAanbod.dc.html`. Alleen de instap-kaart heeft `entry`.

---

### Stap 4 — Maak `src/components/site/ForgeLine.astro` (statische versie)

**Waarom:** de lijn moet ook zonder JS zichtbaar zijn en de rail-kolom in elke sectie vullen. In deze fase is dat puur CSS; fase 4 legt er een SVG-laag over.

**Wat:** in deze fase rendert de component alleen de **hero-start** (het gloeiende vierkant + "Scroll · volg de lijn") en de **contact-eindhaak**; de verticale lijn per hoofdstuk komt uit `.chapter__rail::before` (fase 1). Pas `layout.css` aan zodat de fallback-rail in gepasseerde hoofdstukken `--forge` is: zonder JS is de hele lijn "aan" (eindtoestand), dus gebruik `background: var(--forge)` in plaats van `--forge-soft`, en zet per hoofdstuk een `fl-tick` op de hoogte van de kicker (`top: var(--space-32) + 6px` op desktop). Voeg de data-attributen toe die fase 4 nodig heeft:
- `data-forge-anchor="start"` op het hero-vierkant,
- `data-forge-anchor="chapter"` op elke `.chapter__rail`,
- `data-forge-anchor="end"` op de verzendknop in Contact.

---

### Stap 5 — Maak `src/sections/Hero.astro` (`#chaos`)

**Waarom:** het eerste scherm moet in één oogopslag de belofte en het motief laten zien. Artboards: `Main.dc.html`, `MobielHero.dc.html`.

**Wat:**
- `<section id="chaos" class="hero fl-grid-bg" data-theme="dark" data-chapter="01" aria-labelledby="hero-title">`, `min-height: 100svh`, inhoud verticaal gecentreerd onder de nav.
- Desktop: grid `minmax(0, 680px) minmax(0, 600px)`, `column-gap` zodat de tekst op x ≈ 120 en het chaos-veld op x ≈ 800 staat bij 1440 breed. Tekstkolom: kicker (`fl-kicker fl-label`), `<h1 class="fl-display" id="hero-title">`, lead (`sb-lead` → `.fl-lead` in `components.css`: 20/31 `ink-muted`, max 560px), knoppen (`Button primary arrow` → `#contact`, `Button link` → `#inzicht`), `gap: var(--space-8)`.
- Chaos-veld: `<div class="hero__chaos" data-motion="hero-chaos" aria-hidden="true">` met `position: relative; aspect-ratio: 600 / 580; width: 100%; max-width: 600px`. Daarin een SVG (`viewBox="0 0 600 580"`, `preserveAspectRatio="none"` niet nodig — schaal de hele doos) met de tien `chaosWires` als `fl-wire fl-wire--chaos`, en de zeven `ProcessNode state="chaos"` absoluut op `left: x/600*100%; top: y/580*100%`, met `rotate`. Het hele veld is decoratief (`aria-hidden`); de inhoud staat in de tekst.
- Onderaan gecentreerd: de forge-line-start uit stap 4.
- Mobiel (< 900px): één kolom; kicker = `kickerShort`; `fl-display` schaalt naar 44px; chaos-veld vervangen door drie nodes (eerste, vierde, derde uit de lijst: Order uit e-mail, Overtypen in ERP, Planning in Excel) in een `position: relative`-doos van 334 × 240 op de posities uit `MobielHero.dc.html` (`{0,0,-4}`, `{150,60,3}`, `{20,130,-2}`), `min-width: 0` op de nodes; daaronder de scroll-cue. **Kop en lead zijn de desktopteksten.**

---

### Stap 6 — Maak `src/sections/Inzicht.astro` (`#inzicht`)

**Waarom:** laat zien dat het werk begint met kijken en meten. Artboard: `Inzicht.dc.html`.

**Wat:**
- Vaste hoofdstukstructuur (zie `src/sections/CLAUDE.md`) met nummer `02`.
- Visual (`data-motion="inzicht-map"`, `margin-top: var(--space-24)`): een rij van vijf `ProcessNode state="mapped" port` met `gap: var(--space-12)`, verbonden door horizontale lijnen. Bouw de verbindingen als `::after` op elke node behalve de laatste (`width: var(--space-12)`, 1.5px `line-strong`, verticaal gecentreerd) zodat ze met de flex-layout meeschalen. Boven de verbindingen 01–02, 02–03 en 04–05 een `fl-tag` (absoluut boven de verbinding, `bottom: calc(100% + var(--space-4))`).
- Onder de visual (`margin-top: var(--space-16)`): grid van drie kolommen met haarlijn erboven (`border-top: 1px solid var(--line); padding-top: var(--space-6)`), elk een `fl-label` in `ink-muted` + tekst 15/23.
- Mobiel: nodes in een verticale stapel met verticale verbindingen; knelpunt-tags naast de verbinding; methode-kolommen onder elkaar.

---

### Stap 7 — Maak `src/sections/Standaard.astro` (`#standaard`)

**Waarom:** het kernargument "eerst standaardiseren". Artboard: `Standaard.dc.html`.

**Wat:**
- Nummer `03`. Visual (`data-motion="standaard"`) als grid `[banen] minmax(0, 580px) [samenvoeg] 140px [standaard] 168px`:
  - Banen: drie rijen, elk `fl-label` (96px breed, `ink-muted`) + drie `fl-chip` (`<span>`), `gap: var(--space-2)`, rijen `gap: 56px` (zoals het board).
  - Samenvoeging: SVG `viewBox="0 0 140 340"` met drie gestippelde curves naar één punt en een `ink`-lijn (`fl-wire--ink`) naar de standaard-kolom; paden overgenomen uit het artboard en verschoven met −580 op x.
  - Standaard: label `fl-tag` "Eén werkwijze" en drie `ProcessNode state="standard"` verticaal met `ink`-verbinding.
- Mobiel: banen onder elkaar (chips mogen wrappen), daaronder een korte verticale `ink`-lijn en de drie standaard-nodes; de samenvoeg-SVG vervalt.

---

### Stap 8 — Maak `src/sections/Automatisch.astro` (`#automatisch`)

**Waarom:** de belofte "productie, geen demo" met een concreet (gelabeld) voorbeeld. Artboard: `Automatisch.dc.html`.

**Wat:**
- Nummer `04`. Label `fl-tag` = `exampleLabel` (verplicht).
- Visual (`data-motion="automatisch"`): rij van vier nodes (`gap` zodat ze 240px uit elkaar staan: `gap: 72px`), stap 1–3 `state="automated" port`, stap 4 `state="standard" port`. Achter de rij een SVG over de volle breedte met `fl-wire fl-wire--lit` en `fl-wire--flow` (de flow-animatie bestaat al in CSS; met reduced motion staat hij stil) en een oranje eindvierkant van 12px rechts. Onder elke node een `fl-chip` met het resultaat.
- Drie beloftes (zelfde opmaak als de methode-kolommen in Inzicht) met labels in `forge` (`.fl-label` + `color: var(--forge)`; mag, want donker thema).
- Mobiel: verticale stapel node → chip; lijn verticaal links van de nodes.

---

### Stap 9 — Maak `src/sections/Oordeel.astro` (`#oordeel`) — statische versie

**Waarom:** de interactieve kern moet ook zonder JS alle informatie tonen. Artboards: `Oordeel.dc.html`, `MobielOordeel.dc.html`.

**Wat:**
- Nummer `05`. Label `fl-tag` = `exampleLabel`.
- `VerdictCard`-markup (bron: `VerdictCard/preview.html`, `grid-template-columns: 340px 1fr`):
  ```astro
  <div class="fl-verdict" data-verdict-root data-motion="oordeel">
    <ul class="fl-verdict__steps" aria-label={d.oordeel.stepsLabel}>
      {verdicts.map((v, i) => (
        <li><button type="button" class="fl-verdict__step" data-verdict-step={v.id}
              aria-pressed={v.id === defaultVerdict ? 'true' : 'false'} aria-controls={`verdict-${v.id}`}>
          {d.oordeel.items[v.id].title} <span class="fl-label">{String(i + 1).padStart(2, '0')}</span>
        </button></li>
      ))}
    </ul>
    <div class="fl-verdict__panels">
      {verdicts.map((v) => (
        <div class="fl-verdict__panel" id={`verdict-${v.id}`} data-verdict-panel={v.id}
             data-active={v.id === defaultVerdict ? '' : undefined}>
          <p class="fl-verdict__meta">{item.meta}</p>
          <h3 class="fl-verdict__title">{item.title}</h3>
          <Badge verdict={v.verdict} label={d.oordeel.verdictLabels[v.verdict]} />
          <p class="fl-verdict__reason">{item.reason}</p>
        </div>
      ))}
    </div>
  </div>
  ```
- **Zichtbaarheid zonder `hidden`-attribuut.** `.fl-verdict__panel` heeft `display: flex` in `components.css`, en dat wint van de browserregel voor `[hidden]`; gebruik daarom `data-active`. Zet in `components.css`:
  ```css
  html.js .fl-verdict__panel:not([data-active]) { display: none; } /* met JS: één paneel, al vóór het script draait (geen sprong) */
  html:not(.js) .fl-verdict__steps { display: none; }               /* zonder JS: geen knoppen die niets doen */
  html:not(.js) .fl-verdict { grid-template-columns: 1fr; }          /* …en alle vijf panelen onder elkaar */
  ```
  Fase 3 voegt het gedrag toe.
- Voeg `stepsLabel: 'Processtappen'` toe aan `nl.ts`.
- Mobiel: stappen als horizontaal scrollbare rij (`overflow-x: auto; display: flex; gap: var(--space-2)`) met `shortTitle` en alleen de vier `verdictsMobile`; de `inkoop`-knop krijgt `class="hidden desk:block"` (paneel blijft bestaan).

---

### Stap 10 — Maak `src/sections/Aanbod.astro` (`#aanbod`, licht)

**Waarom:** de dienstenladder, zonder prijzen (ADR-009). Artboards: `Aanbod.dc.html`, `MobielAanbod.dc.html`.

**Wat:**
- `<section … data-theme="light" class="chapter fl-grid-bg">`, nummer `06` (in licht thema `ink`, regelt `components.css` al).
- `fl-ladder` met drie `ServiceCard`s (eerste `entry`). Onder de ladder (`margin-top: var(--space-8)`, haarlijn): `note` links (15/23 `ink-muted`, max 620px) en `Button primary arrow` "Vraag een audit aan" → `#contact` rechts.
- Mobiel: kaarten onder elkaar, `compact`; `noteMobile` in plaats van `note`.

---

### Stap 11 — Maak `src/sections/OverMij.astro` (`#over-mij`)

**Waarom:** eigenaren kopen van mensen. Artboard: `OverMij.dc.html`.

**Wat:**
- Nummer `07`, `SectionHeader` zonder lead.
- `fl-profile` met `grid-template-columns: 320px 1fr; gap: var(--space-16)`. Foto via Astro:
  ```astro
  import { Image } from 'astro:assets';
  import portrait from '../assets/images/sander-portrait-tijdelijk.jpg';
  <div class="fl-profile__photo"><Image src={portrait} alt={d.overMij.photoAlt} widths={[320, 640]} sizes="320px" /></div>
  ```
  (`components.css` maakt hem zwart-wit, 4:5, met oranje streep.)
- Rechts: naam (`fl-profile__name`, als `<h3>`), rol (`fl-label`), twee alinea's (max 600px), e-mail als `Button link` (`mailto:` uit `site.personalEmail`), drie feiten (`fl-profile__facts`).
- Mobiel: foto boven (max 280px breed), feiten onder elkaar.

---

### Stap 12 — Maak `src/sections/Contact.astro` (`#contact`) — statische versie

**Waarom:** het einde van de lijn en de enige conversie. Artboard: `Contact.dc.html`.

**Wat:**
- `data-theme="light"`, nummer `08`, `SectionHeader` met lead.
- Grid `minmax(0, 680px) 320px` met `column-gap` zodat het blok rechts op x ≈ 1060 staat.
- Links het formulier, markup uit `ContactForm/preview.html`, nu nog zonder gedrag:
  ```html
  <form class="fl-form" action="https://api.web3forms.com/submit" method="POST" data-contact-form novalidate>
    <input type="hidden" name="access_key" value={site.web3formsAccessKey} />
    <input type="hidden" name="redirect" value={site.formRedirect} />
    <input type="hidden" name="subject" value={d.contact.subject} />
    <input type="hidden" name="from_name" value="forgelineoptimizations.nl" />
    <!-- honeypot: verborgen voor mensen, Web3Forms negeert submissions waarin hij aangevinkt is -->
    <div class="fl-honeypot" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" /></div>
    <!-- velden naam, bedrijf, e-mail, telefoon, bericht, privacy, submit (fase 3 maakt hier Field-componenten van) -->
  </form>
  ```
  `novalidate` pas zetten in fase 3 als de JS-validatie er is; in deze fase **zonder** `novalidate`, zodat de browservalidatie werkt.
  De verzendknop krijgt `data-forge-anchor="end"`.
- Rechts het blok "Wat er daarna gebeurt" (`surface-raised`, `line`-rand, `radius-md`, padding `space-6`): `fl-label`, genummerde lijst, e-mail als link.
- Mobiel: één kolom, blok onder het formulier.

---

### Stap 13 — Zet alles samen in `src/pages/index.astro` en maak `src/scripts/nav-progress.ts`

**Waarom:** de pagina zelf, en een nav die laat zien waar je bent (ook zonder GSAP).

- `index.astro`: `BaseLayout showChapters` met de acht secties in volgorde en `<ForgeLine />` direct in `<main>`. Verwijder de tijdelijke hero uit fase 1.
- `nav-progress.ts` (geladen vanuit `NavBar.astro` via `<script>`):
  ```ts
  // Zet de nav-status op basis van de sectie die het midden van het scherm kruist.
  const sections = [...document.querySelectorAll<HTMLElement>('main > section[id]')];
  const links = new Map([...document.querySelectorAll<HTMLAnchorElement>('[data-nav-chapter]')]
    .map((a) => [a.dataset.navChapter!, a]));
  const order = sections.map((s) => s.id);
  const nav = document.querySelector<HTMLElement>('.fl-nav');

  function setActive(id: string) {
    const idx = order.indexOf(id);
    links.forEach((a, key) => {
      if (key === id) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
      a.classList.toggle('is-done', order.indexOf(key) < idx); // gepasseerde hoofdstukken
    });
    // nav neemt het thema van de sectie eronder over
    const theme = document.getElementById(id)?.dataset.theme ?? 'dark';
    nav?.setAttribute('data-theme', theme);
  }

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: '-50% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  // mobiele voortgangsbalk
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    nav?.style.setProperty('--progress', String(max > 0 ? scrollY / max : 0));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  ```
  Bij `over-mij` en `contact` (geen eigen label) moeten alle zes labels `is-done` zijn: `i < idx` dekt dat, omdat die secties ná `aanbod` komen.

---

## Tests

### `tests/unit/i18n.test.ts`
**Bewijst:** geen lege of ontbrekende teksten; data en tekst passen bij elkaar.
| Test | Controleert |
|---|---|
| `no empty strings` | recursief: elke string in `nl` is niet leeg en bevat geen `TODO` |
| `every verdict has text` | voor elke `verdicts[i].id` bestaan `title`, `shortTitle`, `meta`, `reason` |
| `chaos nodes match` | `chaosNodes.length === nl.hero.nodes.length` |
| `no prices` | geen string in `nl` matcht `/€\s?\d|\d+\s?euro/i` (ADR-009) |

### `tests/e2e/sections.spec.ts`
**Bewijst:** de pagina bevat het hele verhaal in de juiste volgorde, ook zonder JS.
| Test | Controleert |
|---|---|
| `chapters in order` | `main > section[id]` = chaos, inzicht, standaard, automatisch, oordeel, aanbod, over-mij, contact |
| `headings` | één `h1` (hero), daarna per sectie een `h2` met de titel uit `nl.ts` |
| `themes` | `#aanbod` en `#contact` hebben `data-theme="light"`, de rest `dark` |
| `example labels` | `#automatisch` en `#oordeel` bevatten de tekst "Voorbeeld" |
| `no JS shows all verdicts` | met `javaScriptEnabled: false`: vijf `.fl-verdict__panel` zichtbaar |
| `form posts to Web3Forms` | `form[data-contact-form]` heeft `action="https://api.web3forms.com/submit"`, hidden `redirect` = `site.formRedirect`, honeypot aanwezig |
| `nav follows scroll` | na `#aanbod` in beeld: nav-link "Aanbod" heeft `aria-current="step"` en de nav `data-theme="light"` |
| `mobile layout` | project `mobile`: geen horizontale scroll; hero toont drie nodes; verdict-stappen in één rij |

Representatieve test:
```ts
test('no JS shows all verdicts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/#oordeel');
  await expect(page.locator('.fl-verdict__panel')).toHaveCount(5);
  for (const panel of await page.locator('.fl-verdict__panel').all()) await expect(panel).toBeVisible();
  await context.close();
});
```

### `tests/e2e/a11y.spec.ts` (uitbreiden)
Axe op `/` met de lichte secties in beeld (`#aanbod`, `#contact`) én de donkere: nul `serious`/`critical`.

### Visuele controle (handmatig, in de session-log)
Screenshots op 1440 × 900 per sectie naast het artboard, en op 390 × 844 naast de mobiele frames. Noteer afwijkingen > 32px.

---

## Acceptatiecriteria
- [ ] Alle acht hoofdstukken staan er met de teksten van het board, in de juiste thema's.
- [ ] Zonder JavaScript is alles leesbaar, inclusief alle vijf verdicts, en werkt het formulier (browservalidatie + POST).
- [ ] Nergens tekst in `.astro`-bestanden behalve via `t()`/`site`.
- [ ] Nav toont voortgang en wisselt thema mee.
- [ ] Geen horizontale scroll op 390 breed.
- [ ] Alle tests groen.

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `src/i18n/nl.ts` | **Edit** | Alle sectieteksten |
| `docs/content-nl.md` | **Edit** | Vervangen-melding bovenaan |
| `src/data/verdicts.ts`, `src/data/hero-chaos.ts` | **Create** | Structuurdata |
| `src/components/ui/SectionHeader.astro`, `ProcessNode.astro`, `Icon.astro`, `Badge.astro`, `ServiceCard.astro` | **Create** | Design-system-componenten |
| `src/components/site/ForgeLine.astro` | **Create** | Start, eindhaak, anchors |
| `src/styles/components.css` | **Edit** | `--fl-rotate`, `.fl-lead`, no-JS-regels verdict |
| `src/styles/layout.css` | **Edit** | Rail = `forge`, ticks |
| `src/sections/Hero.astro` … `Contact.astro` | **Create** | Acht hoofdstukken |
| `src/pages/index.astro` | **Edit** | Samenstelling |
| `src/scripts/nav-progress.ts` | **Create** | Nav-status en voortgangsbalk |
| `src/components/site/NavBar.astro` | **Edit** | Laadt `nav-progress.ts` |
| `tests/unit/i18n.test.ts`, `tests/e2e/sections.spec.ts` | **Create** | 4 + 8 tests |
| `tests/e2e/a11y.spec.ts` | **Edit** | Beide thema's |
