Forgeline Optimizations helpt Nederlandse mkb-bedrijven (10–50 medewerkers) hun kernprocessen te standaardiseren en te automatiseren, en zegt eerlijk wat níet geautomatiseerd moet worden. Dit systeem is de webvertaling van de huisstijlgids v1.0: dezelfde vier kleuren, hetzelfde logo, met een donkere variant voor de website. Sfeer: **een werkplaats na sluitingstijd** — het licht is uit, de smidse gloeit nog. Ambachtelijk en precies, niet de terminal van een developer.

## Toon en tekst

- Schrijf Nederlands, in de **ik-vorm** naar **je** ("Ik breng je processen in kaart"). Er staat één persoon achter het bedrijf; dat is een sterkte.
- Spreek de taal van een eigenaar of kantoormanager, niet van een developer: "offerte", "order", "overtypen", "planning" — niet "workflow orchestration", "LLM", "pipeline".
- Concreet boven groot: een getal ("± 13 uur per week") wint van een bijvoeglijk naamwoord ("enorm efficiënt").
- Eerlijk en nuchter. Geen hype-woorden (*revolutionair*, *AI-gedreven*, *next-level*, *transformatie*), geen uitroeptekens, geen emoji.
- Koppen zijn gewone zinnen in zinsnaamval ("Eerst de kaart, dan de machine"). HOOFDLETTERS alleen in de `label`-stijl.
- Geen prijzen op de site. Verwijs naar het gesprek of het formulier.
- De kernzin uit de huisstijl mag letterlijk terugkomen: *Wij automatiseren wat het waard is, en zeggen eerlijk wat niet.* (Op de site in de ik-vorm: "Ik automatiseer wat het waard is, en zeg eerlijk wat niet.")

## Kleur

- Het donkere thema (`dark`) is de standaard voor de website; het lichte thema (`light`) is voor één of twee rustpunten (dienstenladder, contact) en voor print-achtige pagina's (privacy, voorwaarden).
- Verhouding online: ± 60% `surface`, 30% `ink`, 10% `forge`. Oranje is het licht van de smidse: de forge line, actieve stappen, de primaire knop, het verdict *Automatiseren*. Verder niets oranje.
- Tekst: `ink` voor koppen en lopende tekst, `ink-muted` voor intro's en bijschriften. Beide halen ≥4,5:1 op `surface`, `surface-raised` en `surface-sunken` in beide thema's.
- `forge` mag als tekst alleen in het donkere thema (≥7,2:1). In het lichte thema nooit oranje tekst (2,1:1): gebruik `ink` met een `forge`-accent ernaast of eronder.
- Op een `forge`-vlak altijd `on-forge` (zwart, 7,8:1). Nooit wit op oranje.
- Staalgrijs (`staalgrijs`) is op donker onleesbaar (2,8:1). Online is `ink-muted` de vervanger; Staalgrijs blijft voor het lichte thema en decoratieve vlakken.
- Randen van bedieningselementen: `line-strong` (≥3:1). Haarlijnen zonder betekenis: `line`.
- Statuskleuren: `status-ok` (blauw, bewust niet groen) en `status-error`, altijd met icoon en woord.

## Typografie

- Koppen, labels, knoppen en cijfers: **Saira** (`--font-display`), zelf gehost uit `fonts/` (500, 600, 700). Saira sluit aan bij het hoekige woordmerk.
- Lopende tekst: **Arial** (`--font-sans`), zoals in alle documenten van de huisstijl. Kost geen laadtijd.
- Schaal desktop: `display` 72 · `numeral` 96 · `h2` 44 · `h3` 28 · `h4` 20 · `lead` 20 · `body` 17 · `small` 14 · `caption` 12 · `label` 12 (hoofdletters, 0.14em). Mobiel: `display` 44, `numeral` 56, `h2` 32, `h3` 24, `lead` 18; de rest blijft.
- Eén `display` per pagina (de hero). Lopende tekst nooit breder dan `measure`.
- Het woordmerk is een vaste afbeelding. Typ "FORGELINE" nooit na in Saira of Arial.

## Ruimte en layout

- 4px-basis: `space-1` … `space-48`. Kaart-padding `space-6`, tussen blokken `space-16`, hoofdstukken `space-32` boven en onder (mobiel `space-24`).
- Inhoud maximaal `container` breed, gecentreerd, minimale zijmarge `space-8` (mobiel `space-4`).
- Hoekig: `radius-sm` (2px) voor knoppen, velden, badges en processtappen; `radius-md` (4px) voor kaarten. Nooit groter, geen pillen, geen cirkels.
- Desktop eerst; onder 900px een vereenvoudigde layout: één kolom, de forge line als dunne verticale lijn links.

## Beeld: de forge line

- Het centrale motief is **één doorlopende lijn** (`ForgeLine`) van boven naar beneden: het proces van de klant, van verwarde gestippelde lijnen (chaos) naar een rechte, verlichte lijn (geautomatiseerd).
- Daarachter, heel zacht, een **bouwtekening-raster** van plusjes of lijnen op een `space-6`-stap in `grid`. Precies, technisch, maar nooit luid.
- Vormen komen uit het logo: rechte lijnen, rechte hoeken, vierkante punten (als de tanden van het tandwiel). Geen golven, bollen, blobs of gradiënten.
- De enige "glow" is `glow-forge`, alleen op het actieve punt van de lijn en geautomatiseerde stappen. Geen schaduwen elders.
- Fotografie: alleen echte foto's (portret, werkvloer van klanten met toestemming), in zwart-wit, zonder afronding. Geen stockfoto's van robots, hersenen of blauwe hologrammen.
- Geen code, terminals, matrix-regen of chip-illustraties: het tech-gevoel komt uit precisie en beweging.

## Beweging

- Beweging is scroll-gestuurd (GSAP ScrollTrigger): de lijn tekent zich op, nodes ordenen zich (`dur-slow`, `ease-in-out`), verbindingen gaan aan.
- Interface-reacties (hover, focus) in `dur-fast` met `ease-out`; panelen in `dur-base`.
- Eén bewegend idee per scherm. Niets beweegt zonder dat de bezoeker scrollt of klikt, behalve de stroom (`dur-flow`) over een geautomatiseerde lijn.
- `prefers-reduced-motion: reduce`: alles direct in de eindtoestand, geen stroom, geen soepel scrollen. De site moet zonder animaties volledig bruikbaar en leesbaar zijn.

## Logo

- Drie vormen uit de huisstijl: staand (`logo-stacked-*`), horizontaal (`logo-horizontal-*`) en het losse icoon (`icon-*`). Alleen zwart, wit of oranje.
- Op de donkere site: wit (`logo-horizontal-white.svg`) in de navigatie en footer. Op licht: zwart. Het primaire merkbeeld (zwart op oranje, `logo-stacked-on-orange.svg`) voor de OG-afbeelding en avatars.
- Vrije ruimte rondom minimaal de hoogte van de letters FORGELINE. Horizontaal logo minimaal 140px breed; icoon minimaal 24px (favicon).
- Nooit uitrekken, draaien, schaduw of gloed geven, of op een drukke foto zetten.

## Iconografie

- Geen icoonbibliotheek: de site gebruikt een handvol eigen lijniconen in 14px, lijndikte 1,5–2px, rechte hoeken, `currentColor` (pijl, pauze, doorgestreept vierkant, vinkje, uitroepteken). Zie `VerdictCard` en `ContactForm`.
- Opsommingstekens en voortgangspunten zijn kleine vierkante kaders.
- Geen emoji.

## Componenten

- `NavBar`, `SectionHeader`, `Footer` — structuur.
- `ForgeLine`, `ProcessNode`, `VerdictCard` — het verhaal; `VerdictCard` is de interactieve kern (automatiseren / eerst standaardiseren / niet automatiseren).
- `ServiceStep` — de dienstenladder Audit → Implementatie → Care & Development, zonder prijzen.
- `ContactForm` — Web3Forms, honeypot, redirect naar `/request-received`.
- `ProfileCard` — over Sander.
- Stijlen staan in `components/bundle.css` (prefix `fl-`), elke waarde via een token. Dit zijn HTML/CSS-patronen, geen React-bibliotheek: de site bouwt ze na als Astro-componenten met dezelfde klassen en tokens.

## Toegankelijkheid

- Tekstcontrast ≥4,5:1 in beide thema's; randen, focusring en betekenisvolle iconen ≥3:1.
- Focus: `focus-ring`, 2px massief, 3px afstand. Nooit `outline: none` zonder vervanging.
- Betekenis nooit alleen via kleur: verdicts, status en voortgang hebben altijd een woord of icoon.
- Alles is met toetsenbord te bedienen; interactieve onderdelen zijn echte `<button>`s en `<a>`s.
