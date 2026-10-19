# Fase 7 — Verhaal inkorten: één hoofdstuk "Werkwijze"

**Wat deze fase oplevert:** de pagina gaat van acht naar vijf hoofdstukken. De vier concrete voorbeeldhoofdstukken (Inzicht, Standaard, Automatisch, Oordeel) worden samengevoegd tot één abstract hoofdstuk **Werkwijze**, met vier stappen langs de forge line: *In kaart → Standaardiseren → Automatiseren → Eerlijk advies*. De laatste stap houdt een kleine, klikbare beoordeling over **soorten werk** in plaats van een concreet bedrijf.
**Aanleiding (feedback):** het voorbeeld was te groot en te specifiek (facturen, offertes, planning) en liet maar een klein deel zien van wat Sander doet; de pagina was te lang om doorheen te scrollen.
**Bepalende keuze:** abstract en algemeen in plaats van één concreet bedrijfsvoorbeeld. De boodschap die móét overkomen: *ik geef eerlijk advies — niet alles moet automatisch, en niet alles heeft AI nodig.*
**Blijft ongewijzigd:** de forge line links en het scroll-gevoel, de knop "Kennismaken" in de navigatie, het hoofdstuk Aanbod (lichte pagina's), Over mij, het contactformulier en de footer. Daar verandert alleen het hoofdstuknummer (zie stap 2 en 7).
**Buiten scope:** nieuwe teksten voor Aanbod/Over mij/Contact, Engelse versie, nieuwe ontwerpartifacts. Sander herschrijft de nieuwe teksten later zelf; zet ze nu exact zoals hieronder.

Lees vooraf: `CLAUDE.md`, `docs/storyboard.md`, `src/sections/CLAUDE.md`, `src/scripts/CLAUDE.md`, ADR-004, ADR-005, ADR-010, en de huidige code van `src/sections/`, `src/scripts/motion/`, `src/data/verdicts.ts`, `src/i18n/nl.ts`.

---

## Nieuwe paginaopbouw

| # | Anker | Sectie | Thema | Status |
|---|---|---|---|---|
| 01 | `#chaos` | Hero | donker | **Aangepast:** abstracte labels in het chaos-veld, secundaire link naar `#werkwijze` |
| 02 | `#werkwijze` | Werkwijze | donker | **Nieuw** — vervangt Inzicht, Standaard, Automatisch en Oordeel |
| 03 | `#aanbod` | Aanbod | licht | Ongewijzigd (alleen nummer 06 → 03) |
| 04 | `#over-mij` | Over mij | donker | Ongewijzigd (alleen nummer 07 → 04) |
| 05 | `#contact` | Contact | licht | Ongewijzigd (alleen nummer 08 → 05) |

Doellengte desktop: hero 1 scherm + Werkwijze ± 2,5 schermen + rest zoals nu. Was ± 8 schermen tot het aanbod, wordt ± 3,5.

---

## Stap 0 — Audit: breng de huidige code in kaart

**Waarom:** fase 2–5 zijn gebouwd; bestandsnamen of structuur kunnen afwijken van de oorspronkelijke plannen. Dit plan noemt de namen uit die plannen.

**Wat:** zoek op voor elk van deze onderdelen het echte bestand en noteer afwijkingen in de session-log voordat je begint:
- secties `Inzicht`, `Standaard`, `Automatisch`, `Oordeel` en hun motion-modules;
- `verdict.ts`, `verdicts.ts`, `Badge.astro`, `Icon.astro`;
- `hero-chaos.ts`, `nl.ts` (sleutels `hero`, `inzicht`, `standaard`, `automatisch`, `oordeel`, `nav`);
- tests die naar de oude secties of ankers verwijzen (`grep -rn "inzicht\|standaard\|automatisch\|oordeel" src tests`).

Werk op een branch `fase-7-verhaal-inkorten`.

---

## Stap 1 — Schrijf `.claude/decisions/ADR-011-verhaal-inkorten.md`

**Waarom:** dit is een wijziging van de paginastructuur die het storyboard (vastgelegd in fase 0) overschrijft; volgende sessies moeten weten dat het storyboard voor de middelste hoofdstukken niet meer leidend is.

**Wat:** Context = de feedback hierboven. Beslissing = vijf hoofdstukken, één abstract hoofdstuk Werkwijze met vier stappen, verdict over soorten werk met vier uitkomsten (inclusief "met AI" vs "zonder AI"), geen pinning meer in de middelste sectie. Gevolg = `design/storyboard/Inzicht|Standaard|Automatisch|Oordeel.dc.html` zijn historisch; de spec van Werkwijze staat in `docs/storyboard.md`.

---

## Stap 2 — Teksten in `src/i18n/nl.ts`

**Waarom:** alle tekst komt uit i18n (ADR-008). Sander past deze teksten later zelf aan; de structuur moet dat makkelijk maken.

**Verwijder** de sleutels `inzicht`, `standaard`, `automatisch`, `oordeel`. **Pas aan** `hero.nodes` en `nav.chapters`. **Voeg toe** `werkwijze`:

```ts
hero: {
  // kicker, title, lead, ctaPrimary: ongewijzigd
  ctaSecondary: 'Hoe ik werk',            // linkt nu naar #werkwijze
  nodeIndex: 'Stap ?',
  nodes: ['Handmatige stap', 'Kopiëren en plakken', 'Welke versie klopt?', 'Overtypen',
          'Wachten op antwoord', 'Losse lijstjes', 'Dubbel werk'],
  nodesMobile: ['Handmatige stap', 'Overtypen', 'Welke versie klopt?'],
},
nav: {
  // label, skip, cta: ongewijzigd
  chapters: [
    { id: 'werkwijze', label: 'Werkwijze' },
    { id: 'aanbod', label: 'Aanbod' },
    { id: 'over-mij', label: 'Over mij' },
  ],
},
werkwijze: {
  kicker: 'Hoofdstuk 02 · Werkwijze',
  title: 'Van losse stappen naar een proces dat loopt',
  lead: 'Veel processen zijn gegroeid in plaats van ontworpen. Ik maak ze zichtbaar, maak ze eenduidig, en automatiseer alleen wat dat waard is.',
  steps: [
    {
      id: 'kaart', num: '01', label: 'In kaart',
      title: 'Eerst kijken, dan bouwen',
      text: 'Ik loop mee met de mensen die het werk doen en breng elke stap in kaart: wat er gebeurt, hoe vaak, hoe lang en in welk systeem.',
      nodes: ['Binnenkomst', 'Verwerken', 'Controleren', 'Vastleggen', 'Afronden'],
      tags: ['Dubbel werk', 'Wachttijd', 'Zoekwerk'],
    },
    {
      id: 'standaard', num: '02', label: 'Standaardiseren',
      title: 'Eén werkwijze',
      text: 'Doet iedereen het op zijn eigen manier, dan automatiseer je de chaos. Eerst spreken we samen één werkwijze af.',
      lanes: [
        { who: 'Collega A', chips: ['Binnenkomst', 'Verwerken', 'Vastleggen'] },
        { who: 'Collega B', chips: ['Verwerken', 'Binnenkomst', 'Nabellen'] },
        { who: 'Collega C', chips: ['Briefje', 'Vastleggen', 'Verwerken'] },
      ],
      standardLabel: 'Eén werkwijze',
      standard: ['Binnenkomst', 'Verwerken', 'Vastleggen'],
    },
    {
      id: 'automatisch', num: '03', label: 'Automatiseren',
      title: 'Dan gaat de lijn aan',
      text: 'Ik bouw wat zich terugverdient: getest, gedocumenteerd en overgedragen aan je team. Geen demo, maar iets dat blijft draaien.',
      nodes: [
        { name: 'Binnenkomst', mode: 'auto' },
        { name: 'Verwerken', mode: 'auto' },
        { name: 'Controleren', mode: 'human' },
        { name: 'Vastleggen', mode: 'auto' },
      ],
      modeLabels: { auto: 'Automatisch', human: 'Mens' },
    },
    {
      id: 'advies', num: '04', label: 'Eerlijk advies',
      title: 'Niet alles moet automatisch. En niet alles heeft AI nodig.',
      text: 'Je krijgt een rapport met per stap mijn advies: automatiseren, eerst standaardiseren, of gewoon mensenwerk laten. Klik op een soort werk en zie hoe ik het beoordeel.',
    },
  ],
  verdict: {
    stepsLabel: 'Soorten werk',
    labels: {
      rules: 'Automatiseren · zonder AI',
      ai: 'Automatiseren · met AI',
      wait: 'Eerst standaardiseren',
      no: 'Niet automatiseren',
    },
    items: {
      overtypen: {
        title: 'Gegevens overtypen tussen systemen', shortTitle: 'Overtypen',
        reason: 'Vaste stappen en vaste regels. Een eenvoudige koppeling doet dit foutloos; AI zou hier alleen kosten en onzekerheid toevoegen.',
      },
      rommelig: {
        title: 'Een proces dat iedereen anders doet', shortTitle: 'Rommelig proces',
        reason: 'Eerst samen één werkwijze afspreken. Wie chaos automatiseert, krijgt alleen snellere chaos.',
      },
      documenten: {
        title: 'Wisselende documenten en e-mails lezen', shortTitle: 'Documenten lezen',
        reason: 'Hier helpt AI echt: informatie uit tekst halen die steeds anders is opgebouwd. Altijd met een moment waarop een mens meekijkt.',
      },
      persoonlijk: {
        title: 'Persoonlijk contact en afwegingen', shortTitle: 'Persoonlijk contact',
        reason: 'Klanten willen een mens spreken, en afwegingen horen bij jou. Ik maak de informatie overzichtelijk; de beslissing blijft van jou.',
      },
    },
  },
},
```
Werk de hoofdstuk-kickers van Aanbod, Over mij en Contact bij: `Hoofdstuk 03 · Aanbod`, `Hoofdstuk 04 · Wie ik ben`, `Hoofdstuk 05 · Contact`. Verder geen tekstwijzigingen in die secties. Pas `meta.description` niet aan.

---

## Stap 3 — Data: herschrijf `src/data/verdicts.ts`, pas `src/data/hero-chaos.ts` aan

**Waarom:** het verdict heeft nu vier soorten werk en een nieuw onderscheid tussen automatiseren met en zonder AI.

```ts
// src/data/verdicts.ts
export type Verdict = 'rules' | 'ai' | 'wait' | 'no';
export const verdicts = [
  { id: 'overtypen', verdict: 'rules' },
  { id: 'rommelig', verdict: 'wait' },
  { id: 'documenten', verdict: 'ai' },
  { id: 'persoonlijk', verdict: 'no' },
] as const satisfies readonly { id: string; verdict: Verdict }[];
export const defaultVerdict = 'overtypen';
// verdictsMobile vervalt: mobiel toont alle vier.
```
`hero-chaos.ts`: posities en lijnen blijven gelijk (zeven nodes); alleen de labels komen uit de nieuwe `hero.nodes`. Mobiel gebruikt `hero.nodesMobile` in plaats van een index-selectie.

---

## Stap 4 — Badge en icoon voor vier uitkomsten (`Badge.astro`, `Icon.astro`, `components.css`)

**Waarom:** "met AI" en "zonder AI" moeten zichtbaar verschillen, niet alleen in tekst; betekenis nooit alleen via kleur (SOUL).

| Verdict | Klasse | Icoon | Stijl |
|---|---|---|---|
| `rules` | `fl-badge--go` | `arrow` (bestaand) | gevuld `forge`, tekst `on-forge` |
| `ai` | `fl-badge--ai` | `ai` (**nieuw**) | gevuld `forge`, tekst `on-forge` |
| `wait` | `fl-badge--wait` | `pause` | omlijnd `ink` |
| `no` | `fl-badge--no` | `no` | omlijnd `ink-muted` |

Nieuw icoon `ai` (14 × 14, `currentColor`, rechte hoeken zoals de rest): vier kleine vierkantjes in een raster met verbindingslijnen.
```svg
<svg viewBox="0 0 14 14" aria-hidden="true">
  <rect x="1.5" y="1.5" width="3.5" height="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="9" y="1.5" width="3.5" height="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="1.5" y="9" width="3.5" height="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="9" y="9" width="3.5" height="3.5" fill="currentColor"/>
  <path d="M5 3.25h4M3.25 5v4M10.75 5v4M5 10.75h4" stroke="currentColor" stroke-width="1.5"/>
</svg>
```
`components.css`: `.fl-badge--ai { background: var(--verdict-go); border-color: var(--verdict-go); color: var(--on-forge); }`. Mapping in `Badge.astro`: `rules→arrow`, `ai→ai`, `wait→pause`, `no→no`.

---

## Stap 5 — Pas `src/sections/Hero.astro` aan

**Waarom:** de chaos-blokken moeten abstract zijn, en de link "Hoe ik werk" moet naar de nieuwe sectie.

**Wat:** labels uit `d.hero.nodes` / `d.hero.nodesMobile`; `ctaSecondary` → `href="#werkwijze"`. Layout, animatie en forge-line-start blijven exact zoals ze zijn.

---

## Stap 6 — Maak `src/sections/Werkwijze.astro` (`#werkwijze`)

**Waarom:** het nieuwe hart van de pagina: in één hoofdstuk laten zien wat Sander doet, in vier stappen langs de lijn, zonder één bedrijf als voorbeeld.

**Structuur:** de vaste hoofdstukstructuur (rail | nummer `02` | inhoud) met `SectionHeader`, gevolgd door een geordende lijst van vier stappen. Elke stap is een `<li>` in kolom 3, met een eigen tick op de rail.

```astro
<section id="werkwijze" class="chapter fl-grid-bg" data-theme="dark" data-chapter="02" aria-labelledby="werkwijze-title">
  <div class="chapter__inner">
    <div class="chapter__rail" aria-hidden="true" data-forge-anchor="chapter"></div>
    <div class="fl-numeral chapter__num" aria-hidden="true">02</div>
    <div class="chapter__body">
      <SectionHeader kicker={w.kicker} title={w.title} lead={w.lead} titleId="werkwijze-title" />
      <ol class="fl-steps">
        <li class="fl-step" data-step="kaart" data-motion="step-kaart">…</li>
        <li class="fl-step" data-step="standaard" data-motion="step-standaard">…</li>
        <li class="fl-step" data-step="automatisch" data-motion="step-automatisch">…</li>
        <li class="fl-step" data-step="advies" data-motion="step-advies">…</li>
      </ol>
    </div>
  </div>
</section>
```

**Opmaak van één stap (desktop ≥ 900px):** twee kolommen `grid-template-columns: minmax(0, 340px) minmax(0, 1fr); column-gap: var(--space-12)`, `padding-block: var(--space-16)`, haarlijn `line` tussen stappen. Links: `fl-label` met `num · label` (bijv. "01 · In kaart"), `h3` (28/34, Saira 600), tekst (17/27, `ink-muted`, max 340px). Rechts de visual. Een stap is ± 60–70vh hoog; geen `min-height: 100svh` per stap.

**Visuals per stap** (bestaande componenten, abstracte inhoud):
1. **In kaart** — vijf `ProcessNode state="mapped" port` op een rij met verbindingen (zoals het oude Inzicht, maar kleiner: `min-width: 132px`), drie `fl-tag`'s boven de verbindingen 1–2, 2–3 en 4–5. Past de rij niet in de kolom, laat dan de laatste node vallen onder 1100px breed.
2. **Standaardiseren** — links drie banen (`fl-label` "Collega A/B/C" + drie `fl-chip`), rechts via een korte samenvoeg-SVG één verticale stapel van drie `ProcessNode state="standard"` onder `fl-tag` "Eén werkwijze". Hergebruik de opbouw van het oude `Standaard.astro`, geschaald naar de rechterkolom.
3. **Automatiseren** — vier nodes op een rij met de oranje lijn en `fl-wire--flow` erachter; `mode: 'auto'` → `state="automated"` met index "Automatisch", `mode: 'human'` → `state="standard"` met index "Mens". Geen resultaatchips en geen getallen meer.
4. **Eerlijk advies** — de `VerdictCard` uit fase 3 met vier stapknoppen (`d.werkwijze.verdict.items[id].title`) en vier panelen. Een paneel bevat alleen: `h4`-titel, `Badge`, reden. Geen meta-regel, geen label "Voorbeeld" (er staan geen verzonnen getallen meer). `grid-template-columns: minmax(0, 300px) 1fr`.

**Mobiel (< 900px):** stappen onder elkaar; tekst boven, visual eronder. Stap 1: nodes als verticale stapel. Stap 2: banen onder elkaar, dan de drie standaard-nodes. Stap 3: verticale stapel met de lijn links. Stap 4: vier chips in een horizontaal scrollbare rij (`shortTitle`), paneel eronder — alle vier zichtbaar, geen verborgen chip meer.

**Zonder JS:** alle vier verdict-panelen onder elkaar zichtbaar (bestaande `html:not(.js)`-regels), stap 3 in eindtoestand (`automated`).

---

## Stap 7 — Verwijder de oude secties en sluit Werkwijze aan

**Waarom:** geen dode code; tests en navigatie mogen niet meer naar oude secties verwijzen.

- **Delete:** `src/sections/Inzicht.astro`, `Standaard.astro`, `Automatisch.astro`, `Oordeel.astro`.
- **Edit** `src/pages/index.astro`: volgorde `Hero, Werkwijze, Aanbod, OverMij, Contact`.
- **Audit** `verdict.ts`: het script moet zonder wijziging werken op `[data-verdict-root]` binnen Werkwijze. Verwijder de logica die verborgen mobiele chips overslaat als die er alleen voor `inkoop` was.
- **Audit** `nav-progress.ts`: werkt met de nieuwe `nav.chapters`. De hero heeft geen nav-label meer; bij `#chaos` is geen label actief. Bij `#contact` zijn alle drie `is-done`.
- **Edit** de hoofdstuknummers (`fl-numeral` en `data-chapter`) in `Aanbod.astro` (03), `OverMij.astro` (04), `Contact.astro` (05). Verder niets aanraken in deze drie bestanden.
- **Oude ankers:** `#inzicht`, `#standaard`, `#automatisch`, `#oordeel` bestaan niet meer. Voeg in `BaseLayout` een klein inline-script toe dat deze hashes bij het laden vervangt door `#werkwijze` (`history.replaceState` + scroll), voor wie een oude link heeft.

---

## Stap 8 — Beweging: vervang de drie hoofdstukmodules door `src/scripts/motion/chapters/werkwijze.ts`

**Waarom:** Sander wil de scroll-animaties houden, maar de pagina korter. Pins verlengen de scrollafstand; daarom **geen pinning meer** in Werkwijze, wel gescrubde animaties per stap terwijl de stap door het beeld scrollt.

- **Delete:** `chapters/inzicht.ts`, `chapters/standaard.ts`, `chapters/automatisch.ts`. **Edit** `motion/index.ts`: registreer `werkwijze` in plaats van die drie.
- **`werkwijze.ts` (desktop):** per stap een eigen ScrollTrigger op `[data-motion="step-…"]`, `start: 'top 80%'`, `end: 'center 50%'`, `scrub: 0.6`:
  - *kaart* — nodes vallen vanuit een chaos-transform op hun plek (zoals het oude Inzicht), daarna de tags.
  - *standaard* — afwijkende chips (`Nabellen`, `Briefje` en de chips op de verkeerde plek) naar `autoAlpha: 0.25`, curves van stippel naar doorgetrokken, standaard-nodes krijgen `ink`-rand.
  - *automatisch* — oranje lijn tekent zich, nodes met `mode: auto` gaan één voor één naar `automated` (ook terug bij terugscrollen), de "Mens"-node blijft `standard`; daarna wordt de flow zichtbaar.
  - *advies* — geen scroll-animatie; alleen de kaart fadet in (`autoAlpha 0 → 1, y 16 → 0`, eenmalig).
- **Mobiel:** alleen fades per stap en de flow in stap 3 (zoals nu).
- **Reduced motion / geen JS:** eindtoestand, zoals in fase 4.
- **Forge line:** `buildPath` blijft werken (één rail voor het hele hoofdstuk). Voeg per stap een `fl-tick` op de rail toe ter hoogte van het stap-label (`data-forge-tick`), dat oplicht (`forge` + `glow-forge`) wanneer het kopje van de lijn het passeert. Daardoor blijft "de lijn loopt langs de stappen" zichtbaar, ook nu de stappen in één hoofdstuk staan.

---

## Stap 9 — Documentatie bijwerken

**Waarom:** het storyboard was de bron van waarheid; volgende sessies moeten de nieuwe opbouw vinden.

- `docs/storyboard.md`: vervang de secties 02–05 door één sectie "02 · Werkwijze" met de opbouw uit stap 6 en de beweging uit stap 8; pas de tabellen *Pagina-opbouw* en *Beweging* aan; zet bovenaan: "Hoofdstukken 02–05 van het oorspronkelijke storyboard zijn vervangen door Werkwijze (ADR-011)."
- `design/README.md`: noteer dat `Inzicht`, `Standaard`, `Automatisch`, `Oordeel` (+ `MobielOordeel`) historisch zijn.
- `CLAUDE.md`: architectuur (vijf secties en ankers), modulekaart, fase 7 in de fasetabel, ADR-011 in "Belangrijkste beslissingen".
- `docs/README.md`: open punt 8 (voorbeeldgetallen) vervalt; voeg toe: "Teksten Werkwijze en hero-labels nog herschrijven in eigen woorden (Sander)."
- `src/sections/CLAUDE.md`, `src/scripts/CLAUDE.md`: inventaris bijwerken.

---

## Tests

### Aanpassen
| Bestand | Wijziging |
|---|---|
| `tests/unit/i18n.test.ts` | `every verdict has text` op de nieuwe `werkwijze.verdict.items`; `chaos nodes match` blijft; nieuwe test `mobile hero nodes` (`nodesMobile.length === 3`); `no prices` blijft |
| `tests/e2e/sections.spec.ts` | `chapters in order` = chaos, werkwijze, aanbod, over-mij, contact; `themes`: werkwijze donker; `example labels` vervalt; `no JS shows all verdicts` verwacht **4** panelen |
| `tests/e2e/verdict.spec.ts` | standaard open = `overtypen`; klik "Wisselende documenten en e-mails lezen" → badge "Automatiseren · met AI"; klik "Persoonlijk contact en afwegingen" → "Niet automatiseren"; pijltjes over vier stappen; mobiel: vier zichtbare chips |
| `tests/e2e/motion.spec.ts` | `reduced motion = end state` op `#werkwijze [data-step="automatisch"]`: nodes met `auto` zijn `automated`, de "Mens"-node `standard`; `automatisch switches on` idem; `anchors still land` met nav "Werkwijze" |
| `tests/e2e/smoke.spec.ts` | nav toont Werkwijze · Aanbod · Over mij + "Kennismaken" |

### Nieuw — `tests/e2e/werkwijze.spec.ts`
**Bewijst:** het nieuwe hoofdstuk vertelt het hele verhaal, kort, abstract en met de kernboodschap.
| Test | Controleert |
|---|---|
| `four steps in order` | `#werkwijze .fl-step` = kaart, standaard, automatisch, advies, elk met `h3` |
| `core message` | `#werkwijze` bevat "Niet alles moet automatisch" en "niet alles heeft AI nodig" |
| `ai vs rules distinct` | de badges van `overtypen` en `documenten` hebben verschillende tekst én verschillende iconen |
| `human stays human` | stap 3 bevat een node met "Mens" die niet `automated` is |
| `no concrete numbers` | `#werkwijze` bevat geen `/\d+\s?(min|uur|×)/` |
| `old anchors redirect` | `/#oordeel` laadt en scrolt naar `#werkwijze` |
| `page is shorter` | desktop: `#aanbod` begint op minder dan 5 × `innerHeight` van de bovenkant |

Representatieve test:
```ts
test('ai vs rules are told apart by text and icon', async ({ page }) => {
  await page.goto('/#werkwijze');
  const badge = (id: string) => page.locator(`#verdict-${id} .fl-badge`);
  await page.locator('[data-verdict-step="overtypen"]').click();
  await expect(badge('overtypen')).toHaveText(/zonder AI/);
  await page.locator('[data-verdict-step="documenten"]').click();
  await expect(badge('documenten')).toHaveText(/met AI/);
  const iconOf = (id: string) => badge(id).locator('svg').innerHTML();
  expect(await iconOf('overtypen')).not.toEqual(await iconOf('documenten'));
});
```

Daarna: `npm run check`, `npm run test`, `npm run test:e2e`, `npm run lhci` (≥ 0,95, desktop en mobiel) en axe zonder serious/critical.

---

## Acceptatiecriteria
- [x] De pagina heeft vijf hoofdstukken; de nav toont Werkwijze · Aanbod · Over mij + "Kennismaken".
- [x] Werkwijze toont vier stappen langs de forge line, zonder concrete bedrijfsvoorbeelden of getallen.
- [x] Stap 4 is klikbaar (muis en toetsenbord), met vier soorten werk en vier uitkomsten, waaronder het verschil met en zonder AI.
- [x] De kernzin "Niet alles moet automatisch. En niet alles heeft AI nodig." staat prominent in beeld.
- [x] Hero heeft abstracte labels; Aanbod, Over mij, Contact en footer zijn inhoudelijk ongewijzigd (alleen nummers).
- [x] Scroll-animaties werken; geen pinning in Werkwijze; reduced motion en geen JS tonen de eindtoestand.
- [x] Op desktop begint Aanbod binnen ± 4 schermhoogtes (gemeten: 3,96×).
- [x] Alle tests en axe groen; docs en ADR-015 bijgewerkt (ADR-011 was al in gebruik, zie Stap 0-afwijking in Stap 1). **Lighthouse-gate bestaat nog niet** (`npm run lhci`): fase 5, stap 4 stond al open vóór deze sessie; niet opgelost, want buiten de scope van dit plan.

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `.claude/decisions/ADR-011-verhaal-inkorten.md` | **Create** | Besluit vijf hoofdstukken |
| `src/i18n/nl.ts` | **Edit** | `werkwijze` erbij; 4 oude sleutels eruit; hero-labels, nav, kickers |
| `src/data/verdicts.ts` | **Edit** | Vier soorten werk, type `rules/ai/wait/no` |
| `src/data/hero-chaos.ts` | **Audit** | Labels uit i18n |
| `src/components/ui/Icon.astro`, `Badge.astro` | **Edit** | Icoon `ai`, variant `ai` |
| `src/styles/components.css` | **Edit** | `.fl-badge--ai`, `.fl-steps`, `.fl-step` |
| `src/sections/Hero.astro` | **Edit** | Abstracte labels, link `#werkwijze` |
| `src/sections/Werkwijze.astro` | **Create** | Nieuw hoofdstuk |
| `src/sections/Inzicht.astro`, `Standaard.astro`, `Automatisch.astro`, `Oordeel.astro` | **Delete** | Vervangen |
| `src/sections/Aanbod.astro`, `OverMij.astro`, `Contact.astro` | **Edit** | Alleen hoofdstuknummer |
| `src/pages/index.astro` | **Edit** | Nieuwe volgorde |
| `src/layouts/BaseLayout.astro` | **Edit** | Oude ankers → `#werkwijze` |
| `src/scripts/verdict.ts`, `nav-progress.ts` | **Audit** | Werken met nieuwe markup |
| `src/scripts/motion/chapters/werkwijze.ts` | **Create** | Animaties per stap, geen pin |
| `src/scripts/motion/chapters/inzicht.ts`, `standaard.ts`, `automatisch.ts` | **Delete** | Vervangen |
| `src/scripts/motion/index.ts` | **Edit** | Registratie |
| `docs/storyboard.md`, `docs/README.md`, `design/README.md`, `CLAUDE.md`, `src/sections/CLAUDE.md`, `src/scripts/CLAUDE.md` | **Edit** | Documentatie |
| `tests/unit/i18n.test.ts`, `tests/e2e/sections.spec.ts`, `verdict.spec.ts`, `motion.spec.ts`, `smoke.spec.ts` | **Edit** | Nieuwe structuur |
| `tests/e2e/werkwijze.spec.ts` | **Create** | 7 tests |
