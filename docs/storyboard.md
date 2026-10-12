# Storyboard — de forge line

Vastgelegd op storyboard-versie `1791838245-b376` (live: https://claude.ai/artifact/KrJVBy6i4DRLV83pWunzfN, snapshot: `design/storyboard/`). Dit document is de uitgeschreven versie van het board: layout, inhoud per hoofdstuk en de scroll-beweging (de oranje notities op het board). Teksten staan in `docs/content-nl.md`.

## Het idee in één zin

De bezoeker volgt één doorlopende oranje lijn van boven naar beneden; die lijn is het proces van een klant dat van chaos (losse, scheve stappen met verwarde stippellijnen) via inzicht en standaardisatie naar automatisering gaat, en eindigt in de verzendknop van het contactformulier.

## Pagina-opbouw (desktop, 1440 breed)

| # | Anker | Artboard | Thema | Hoogte (min.) |
|---|---|---|---|---|
| 01 | `#chaos` | `Main.dc.html` | donker | `100svh` |
| 02 | `#inzicht` | `Inzicht.dc.html` | donker | `100svh` |
| 03 | `#standaard` | `Standaard.dc.html` | donker | `100svh` |
| 04 | `#automatisch` | `Automatisch.dc.html` | donker | `100svh` |
| 05 | `#oordeel` | `Oordeel.dc.html` | donker | `100svh` |
| 06 | `#aanbod` | `Aanbod.dc.html` | **licht** | `100svh` |
| 07 | `#over-mij` | `OverMij.dc.html` | donker | `100svh` |
| 08 | `#contact` | `Contact.dc.html` | **licht** (formulier) + donkere footer | auto |

Alle artboards zijn 1440 × 900 (Contact 1440 × 1240). Elk artboard toont het moment waarop dat hoofdstuk het scherm vult. De navigatiebalk staat op elk artboard om de voortgangsstatus te laten zien; op de site is het **één** vaste (`position: sticky`) balk.

### Raster van een hoofdstuk

Op het board staan in elk hoofdstuk 02–08 dezelfde vier kolomposities:

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
Logo horizontaal wit (licht thema: zwart), zes hoofdstuklabels (Chaos … Aanbod) met vierkante voortgangspunten, knop "Kennismaken". Staat: gepasseerd = `is-done` (oranje rand), huidig = `aria-current="step"` (oranje gevuld), komend = grijs. Over mij en Contact hebben geen eigen label; dan staan alle zes op `is-done`. In licht-secties wisselt de balk mee naar het lichte thema.

## Per hoofdstuk

### 01 · Chaos (hero) — `Main.dc.html`
- **Links** (x 120, y 176, b 680): kicker, `display`-kop (72/76, 2–4 regels), lead (max 560), primaire knop + tekstlink.
- **Rechts** (x 800, y 150, 600 × 580): zeven `ProcessNode`s in `chaos`-staat, elk met eigen rotatie (−6° … +5°), verbonden door tien gestippelde curves (`sb-wire--chaos`). Exacte posities en paden: kopieer de getallen uit het artboard naar `src/data/hero-chaos.ts`.
- **Onderaan** (x 720, y 806): het beginpunt van de forge line: vierkant van 12px met `glow-forge`, label "Scroll · volg de lijn".
- **Geen rail links** in de hero; de lijn begint pas onderaan het midden.

### 02 · Inzicht — `Inzicht.dc.html`
- Kop met nummer 02.
- Proceskaart: vijf `ProcessNode`s in `mapped`-staat op één rij (stap 01–05, 218px uit elkaar), verbonden met rechte lijnen (`line-strong`). Drie knelpunt-labels (`sb-tag`, oranje vierkantje) boven de verbindingen 01–02, 02–03 en 04–05.
- Onderaan drie kolommen met haarlijn erboven: Meelopen · Meten · Vastleggen.

### 03 · Standaardiseren — `Standaard.dc.html`
- Links drie banen ("Planner 1/2/3") met elk drie chips in een andere volgorde.
- De drie banen lopen via gestippelde curves samen naar één punt; daarna één `ink`-lijn naar een verticale stapel van drie `ProcessNode`s in `standard`-staat onder het label "Eén werkwijze".

### 04 · Automatiseren — `Automatisch.dc.html`
- Label "Voorbeeld · orderverwerking".
- Vier nodes op een rij (240px uit elkaar): 01–03 `automated` (oranje rand + gloed), 04 `standard` ("Mens"). Eén doorlopende oranje lijn erachter met lopende `ink`-streepjes (`sb-wire--flow`) en een oranje eindvierkant rechts.
- Onder elke node een resultaatchip (oud → nieuw).
- Onderaan drie beloftes met oranje labels: Getest · Gedocumenteerd · Overgedragen.

### 05 · Eerlijk oordeel — `Oordeel.dc.html` (interactief)
- Label "Voorbeeld · fictief productiebedrijf, 28 medewerkers".
- `VerdictCard`: links vijf stapknoppen (340px kolom), rechts het paneel met meta, titel, verdict-badge en reden. Standaard geopend: `offerte`.
- Zonder JS: alle vijf panelen zichtbaar onder elkaar (zie fase 3).

### 06 · Aanbod — `Aanbod.dc.html` (licht)
- Drie `ServiceStep`-kaarten naast elkaar; alleen de Audit krijgt de oranje bovenrand.
- Onder de kaarten, na een haarlijn: de prijs/subsidie-regel links, knop "Vraag een audit aan" rechts.

### 07 · Over mij — `OverMij.dc.html`
- Kop zonder lead.
- `ProfileCard`: portret 320 breed (4:5, zwart-wit, oranje streep eronder), rechts naam, rol, twee alinea's, e-mail als link, drie feiten onder een haarlijn.

### 08 · Contact — `Contact.dc.html`
- Licht: kop, formulier (2 kolommen, 680 breed) en rechts het blok "Wat er daarna gebeurt" (320 breed, `surface-raised`).
- De forge line loopt links langs het hele hoofdstuk en buigt onderaan (y 740) met een rechte hoek naar rechts, richting de verzendknop.
- Donkere footer eronder over de volle breedte.

## Mobiel (< 900px) — `Mobiel*.dc.html`
- Navigatie 60px: alleen het icoon (32px) en "Kennismaken"; voortgang als 2px oranje balk onder de navigatie (breedte = scrollvoortgang).
- De forge line is een dunne verticale lijn op x = 16 langs alle hoofdstukken; inhoud begint op x = 40.
- Hero: `display` 44/48, drie chaos-nodes onder de tekst.
- Oordeel: stappen als horizontaal scrollbare rij chips (`shortTitle`), paneel eronder.
- Aanbod: kaarten onder elkaar, zonder opsommingen; korte prijsregel.
- Hoofdstukken zonder mobiel artboard (Inzicht, Standaard, Automatisch, Over mij, Contact): één kolom; rijen van nodes worden verticale stapels; formulier één kolom.

## Beweging

Regels: één bewegend idee per scherm; alles in `gsap.matchMedia()`; met reduced motion of zonder JS staat alles in de eindtoestand zoals op het board. Duur en easing uit de tokens (`dur-slow` 640ms, `ease-in-out`, enz.).

| # | Trigger | Wat beweegt |
|---|---|---|
| 01 | bij laden | Nodes "zweven" licht (±2–3px, langzaam, willekeurige fase); gestippelde lijnen lopen in elkaar (`stroke-dashoffset` langzaam). Beginpunt van de lijn pulseert niet, maar gloeit. |
| 01→02 | eerste scroll | De forge line tekent zich vanaf het beginpunt naar beneden en buigt naar de rail-positie links (x van de rail in hoofdstuk 02). |
| 02 | sectie in beeld (`top 70%` → `center center`, scrub) | De vijf nodes komen binnen vanuit een chaos-transform (verschoven, gedraaid, gestippelde rand) en vallen op hun plek; rand wordt massief. Daarna verschijnen de drie knelpunt-labels één voor één. |
| 03 | gepind tijdens ± 100% viewport, scrub | De drie planner-banen schuiven samen; afwijkende chips vervagen; de curves trekken recht; de drie standaard-nodes krijgen een `ink`-rand. |
| 04 | gepind tijdens ± 100% viewport, scrub | De nodes springen één voor één aan (`automated`: oranje rand + `glow-forge`), de oranje lijn tekent zich mee; daarna start de `flow` (doorlopend). Resultaatchips tonen eerst de oude waarde, dan → de nieuwe. Het enige doorlopende effect op de pagina. |
| 05 | geen scroll-animatie | Alleen interactie: paneel wisselt in `dur-base`. De bezoeker heeft de controle. |
| 05→06 | overgang | "Het licht gaat aan": de achtergrond gaat van `surface` donker naar licht over de laatste 20% van #oordeel → begin #aanbod (crossfade van een lichte laag, niet van alle variabelen). |
| 06 | sectie in beeld | De lijn loopt als dwarsverbinding door de drie kaarten; elke kaart komt binnen (fade + 16px omhoog) zodra de lijn hem raakt. |
| 07 | sectie in beeld | Rustig: foto en tekst faden in; de lijn loopt langs de foto en eindigt in de oranje streep eronder. |
| 08 | sectie in beeld | De lijn loopt door naar de verzendknop; als de knop bereikt is, krijgt hij één keer kort `glow-forge`. Daarna niets meer. |
| nav | doorlopend | Voortgangspunten volgen de actieve sectie (IntersectionObserver, ook zonder GSAP). Mobiel: breedte van de 2px-balk = scrollvoortgang. |

Mobiel: alleen de lijn (tekent mee met scrollen), fades per sectie, de flow in 04 en de verdict-interactie. Geen pinning, geen node-choreografie.

## Na verzenden
Redirect naar `/request-received`: zelfde stijl (donker), kop + lead, de drie vervolgstappen, link terug. De forge line staat er volledig getekend in de rail, met een oranje eindvierkant.
