# Storyboard — de forge line

Vastgelegd op storyboard-versie `1791838245-b376` (live: https://claude.ai/artifact/KrJVBy6i4DRLV83pWunzfN, snapshot: `design/storyboard/`). Dit document is de uitgeschreven versie van het board: layout, inhoud per hoofdstuk en de scroll-beweging (de oranje notities op het board). Teksten staan in `docs/content-nl.md`.

**Hoofdstukken 02–05 van het oorspronkelijke storyboard (Inzicht, Standaard, Automatisch, Oordeel) zijn vervangen door één hoofdstuk Werkwijze (fase 7, [ADR-015](../.claude/decisions/ADR-015-verhaal-inkorten.md)).** De sectie "02 · Werkwijze" hieronder is daarvan de spec; de oude `.dc.html`-artboards voor die vier hoofdstukken zijn historisch (zie `design/README.md`).

## Het idee in één zin

De bezoeker volgt één doorlopende oranje lijn van boven naar beneden; die lijn is het proces van een klant dat van chaos (losse, scheve stappen met verwarde stippellijnen) via inzicht en standaardisatie naar automatisering gaat, en eindigt in de verzendknop van het contactformulier.

## Pagina-opbouw (desktop, 1440 breed)

| # | Anker | Artboard | Thema | Hoogte (min.) |
|---|---|---|---|---|
| 01 | `#chaos` | `Main.dc.html` | donker | `100svh` |
| 02 | `#werkwijze` | geen (fase 7, zie hieronder) | donker | ± 2,5 schermen, geen `100svh` per stap |
| 03 | `#aanbod` | `Aanbod.dc.html` | **licht** | `100svh` |
| 04 | `#over-mij` | `OverMij.dc.html` | donker | `100svh` |
| 05 | `#contact` | `Contact.dc.html` | **licht** (formulier) + donkere footer | auto |

Alle artboards zijn 1440 × 900 (Contact 1440 × 1240). Elk artboard toont het moment waarop dat hoofdstuk het scherm vult. De navigatiebalk staat op elk artboard om de voortgangsstatus te laten zien; op de site is het **één** vaste (`position: sticky`) balk.

### Raster van een hoofdstuk

Op het board staan in elk hoofdstuk dezelfde vier kolomposities (oorspronkelijk 02–08, nu 02–05 na fase 7):

| Element | x op het board | Op de site |
|---|---|---|
| Forge line (rail, 2px) | 120 | kolom 1 (40px), lijn gecentreerd |
| Hoofdstuknummer (`numeral`, 96px) | 160 | kolom 2 (160px) |
| Kop (kicker + h2 + lead) | ± 320 | kolom 3, max `measure` |
| Inhoudsblok (visual, kaarten, formulier) | 320 – 1380 | kolom 3, volle breedte |

```css
/* src/styles/layout.css — benadert het board binnen ± 32px op 1440 breed */
.chapter__inner {
  max-width: 1260px;
  margin-inline: auto;
  padding-inline: var(--space-6);
  display: grid;
  grid-template-columns: 40px 160px minmax(0, 1fr);
  column-gap: 0;
}
```

Op het board staat het nummer naast de kop (flex, `gap: 48px`); het inhoudsblok begint ± 120px onder de kop.

### Navigatie
Logo horizontaal wit (licht thema: zwart), drie hoofdstuklabels (Werkwijze · Aanbod · Over mij) met vierkante voortgangspunten, knop "Kennismaken". Staat: gepasseerd = `is-done` (oranje rand), huidig = `aria-current="step"` (oranje gevuld), komend = grijs. Chaos en Contact hebben geen eigen label; dan staan alle drie op `is-done`. In licht-secties wisselt de balk mee naar het lichte thema.

## Per hoofdstuk

### 01 · Chaos (hero) — `Main.dc.html`
- **Links** (x 120, y 176, b 680): kicker, `display`-kop (72/76, 2–4 regels), lead (max 560), primaire knop + tekstlink (linkt naar `#werkwijze`).
- **Rechts** (x 800, y 150, 600 × 580): zeven `ProcessNode`s in `chaos`-staat, elk met eigen rotatie (−6° … +5°), verbonden door tien gestippelde curves (`sb-wire--chaos`). Exacte posities en paden: kopieer de getallen uit het artboard naar `src/data/hero-chaos.ts`. Labels zijn abstract (fase 7): geen concreet proces, zie `t().hero.nodes`.
- **Onderaan** (x 720, y 806): het beginpunt van de forge line: vierkant van 12px met `glow-forge`, label "Scroll · volg de lijn".
- **Geen rail links** in de hero; de lijn begint pas onderaan het midden.

### 02 · Werkwijze (fase 7, [ADR-015](../.claude/decisions/ADR-015-verhaal-inkorten.md)) — geen artboard

Vervangt de oorspronkelijke hoofdstukken Inzicht, Standaard, Automatisch en Oordeel: één abstract hoofdstuk, vier stappen onder elkaar langs de forge line, geen concreet bedrijfsvoorbeeld en geen verzonnen getallen. Doellengte ± 2,5 scherm (was ± 4 schermen voor de vier losse hoofdstukken).

Structuur: de vaste hoofdstukopbouw (rail · nummer 02 · kop) met daaronder een geordende lijst `.fl-steps` van vier `.fl-step`-items. Elke stap: links een label (`num · label`), een `h3` en korte tekst; rechts een visual. Op desktop (≥ 900px) twee kolommen (label 340px | visual); op mobiel tekst boven, visual eronder. Een stap is ± 60–70vh, geen `100svh` gedwongen per stap.

1. **In kaart** — vijf `ProcessNode`s in `mapped`-staat op een rij (kleiner dan het oude Inzicht, `min-width: 132px`), drie knelpunt-tags boven de verbindingen 1–2, 2–3 en 4–5.
2. **Standaardiseren** — links drie banen ("Collega A/B/C") met elk drie chips in een andere volgorde; rechts via een samenvoeg-SVG één verticale stapel van drie `ProcessNode`s in `standard`-staat onder "Eén werkwijze".
3. **Automatiseren** — vier nodes op een rij met de oranje lijn en de flow erachter; drie `mode: auto` (automated), één `mode: human` ("Mens", blijft `standard`). Geen resultaatchips, geen getallen.
4. **Eerlijk advies** — `VerdictCard` met vier stapknoppen (**soorten werk**, niet processtappen van één bedrijf) en vier uitkomsten: automatiseren zonder AI, automatiseren met AI, eerst standaardiseren, niet automatiseren. Kernzin: "Niet alles moet automatisch. En niet alles heeft AI nodig." Standaard geopend: `overtypen`. Zonder JS: alle vier panelen zichtbaar onder elkaar.

Rijen die niet in de kolom passen (vooral stap 1, vijf nodes) scrollen lokaal (`overflow-x: auto`, met `tabindex="0"` voor toetsenbordtoegang) in plaats van de pagina breder te maken.

### 03 · Aanbod — `Aanbod.dc.html` (licht)
- Drie `ServiceStep`-kaarten naast elkaar; alleen de Audit krijgt de oranje bovenrand.
- Onder de kaarten, na een haarlijn: de prijs/subsidie-regel links, knop "Vraag een audit aan" rechts.

### 04 · Over mij — `OverMij.dc.html`
- Kop zonder lead.
- `ProfileCard`: portret 320 breed (4:5, zwart-wit, oranje streep eronder), rechts naam, rol, twee alinea's, e-mail als link, drie feiten onder een haarlijn.

### 05 · Contact — `Contact.dc.html`
- Licht: kop, formulier (2 kolommen, 680 breed) en rechts het blok "Wat er daarna gebeurt" (320 breed, `surface-raised`).
- De forge line loopt links langs het hele hoofdstuk en buigt onderaan (y 740) met een rechte hoek naar rechts, richting de verzendknop.
- Donkere footer eronder over de volle breedte.

## Mobiel (< 900px) — `Mobiel*.dc.html`
- Navigatie 60px: alleen het icoon (32px) en "Kennismaken"; voortgang als 2px oranje balk onder de navigatie (breedte = scrollvoortgang).
- De forge line is een dunne verticale lijn op x = 16 langs alle hoofdstukken; inhoud begint op x = 40.
- Hero: `display` 44/48, drie chaos-nodes onder de tekst (`hero.nodesMobile`, los van de zeven desktoplabels).
- Werkwijze: vier stappen onder elkaar (tekst boven, visual eronder); stap "Eerlijk advies" toont alle vier chips (`shortTitle`) in een horizontaal scrollbare rij, geen verborgen chip meer (fase 7: geen `verdictsMobile`-filter).
- Aanbod: kaarten onder elkaar, zonder opsommingen; korte prijsregel.
- Hoofdstukken zonder mobiel artboard (Werkwijze, Over mij, Contact): één kolom; rijen van nodes worden verticale stapels; formulier één kolom.

## Beweging

Regels: één bewegend idee per scherm; alles in `gsap.matchMedia()`; met reduced motion of zonder JS staat alles in de eindtoestand zoals op het board. Duur en easing uit de tokens (`dur-slow` 640ms, `ease-in-out`, enz.).

| # | Trigger | Wat beweegt |
|---|---|---|
| 01 | bij laden | Nodes "zweven" licht (±2–3px, langzaam, willekeurige fase); gestippelde lijnen lopen in elkaar (`stroke-dashoffset` langzaam). Beginpunt van de lijn pulseert niet, maar gloeit. |
| 01→02 | eerste scroll | De forge line tekent zich vanaf het beginpunt naar beneden en buigt naar de rail-positie links (x van de rail in hoofdstuk 02, Werkwijze). |
| 02 · stap 1 (In kaart) | stap in beeld (`top 80%` → `center 50%`, scrub) | De vijf nodes komen binnen vanuit een chaos-transform (verschoven, gedraaid, gestippelde rand) en vallen op hun plek; rand wordt massief. Daarna verschijnen de drie knelpunt-tags één voor één. |
| 02 · stap 2 (Standaardiseren) | stap in beeld, scrub, **geen pin** | Afwijkende chips vervagen; de curves trekken recht; de drie standaard-nodes krijgen een `ink`-rand. |
| 02 · stap 3 (Automatiseren) | stap in beeld, scrub, **geen pin** | De oranje lijn tekent zich; nodes met `mode: auto` gaan één voor één aan (`automated`, ook terug bij terugscrollen); de "Mens"-node blijft `standard`. Daarna wordt de flow zichtbaar. |
| 02 · stap 4 (Eerlijk advies) | sectie in beeld, geen scrub | Geen scroll-animatie op het verdict zelf; alleen de kaart fadet eenmalig in (`autoAlpha` 0 → 1, `y` 16 → 0). Interactie (paneel wisselt in `dur-base`) blijft bij de bezoeker. |
| 02 → rail | per stap | Een eigen `fl-tick` op de rail per stap licht op (`forge` + `glow-forge`) zodra het kopje van de lijn die stap passeert — zo blijft "de lijn loopt langs de stappen" zichtbaar binnen één hoofdstuk. |
| 02→03 | overgang | "Het licht gaat aan": de achtergrond gaat van `surface` donker naar licht over de laatste 20% van #werkwijze → begin #aanbod (crossfade van een lichte laag, niet van alle variabelen). |
| 03 | sectie in beeld | De lijn loopt als dwarsverbinding door de drie kaarten; elke kaart komt binnen (fade + 16px omhoog) zodra de lijn hem raakt. |
| 04 | sectie in beeld | Rustig: foto en tekst faden in; de lijn loopt langs de foto en eindigt in de oranje streep eronder. |
| 05 | sectie in beeld | De lijn loopt door naar de verzendknop; als de knop bereikt is, krijgt hij één keer kort `glow-forge`. Daarna niets meer. |
| nav | doorlopend | Voortgangspunten volgen de actieve sectie (IntersectionObserver, ook zonder GSAP). Mobiel: breedte van de 2px-balk = scrollvoortgang. |

Mobiel: alleen de lijn (tekent mee met scrollen), fades per stap/sectie, de flow in stap 3 van Werkwijze en de verdict-interactie. Geen pinning, geen node-choreografie — ook niet meer in Werkwijze (fase 7, ADR-015: pins verlengen de scrollafstand, en de pagina moest juist korter).

## Na verzenden
Redirect naar `/request-received`: zelfde stijl (donker), kop + lead, de drie vervolgstappen, link terug. De forge line staat er volledig getekend in de rail, met een oranje eindvierkant.
