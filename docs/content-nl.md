> Vervangen door `src/i18n/nl.ts` (fase 2). Dit document wordt niet meer bijgewerkt.

# Teksten (Nederlands)

Bron: storyboard versie `1791838245-b376`, inclusief Sanders tekstwijzigingen. Fase 2 zet dit om naar `src/i18n/nl.ts`; daarna is dat bestand leidend en wordt dit document niet meer bijgewerkt.

Toon: ik-vorm naar je, nuchter, concreet. Geen hype-woorden, geen uitroeptekens, geen emoji. Typografie: `–` bereik, `·` scheiding, `±`, `→`, `×`.

---

## Algemeen

| Sleutel | Tekst |
|---|---|
| `meta.title` | Forgeline Optimizations · Procesautomatisering & AI voor het mkb |
| `meta.description` | Ik breng de processen van je bedrijf in kaart en automatiseer alleen wat zich terugverdient. Voor productie, handel en dienstverlening met 10 tot 100 mensen. |
| `nav.chapters` | Chaos · Inzicht · Standaard · Automatisch · Oordeel · Aanbod |
| `nav.cta` | Kennismaken |
| `nav.skip` | Ga naar de inhoud |
| `common.example` | Voorbeeld |
| `common.scrollCue` | Scroll · volg de lijn |

## 01 · Chaos (hero) — `#chaos`

| Sleutel | Tekst |
|---|---|
| `hero.kicker` | Procesautomatisering & AI voor het mkb |
| `hero.title` | Automatiseer wat het waard is. Ik help te vinden wat dat is. |
| `hero.lead` | Voor productie-, handels- en dienstverlenende bedrijven met 10 tot 100 mensen. Eerst je processen in kaart, dan pas de software. |
| `hero.ctaPrimary` | Plan een kennismaking → (naar `#contact`) |
| `hero.ctaSecondary` | Hoe ik werk (naar `#inzicht`) |
| `hero.nodes` | Order uit e-mail · Offerte in Word · Planning in Excel · Overtypen in ERP · Voorraad nabellen · Factuur handmatig · Welke versie klopt? |
| `hero.nodeIndex` | Stap ? |

Mobiel: kicker kort ("Procesautomatisering & AI", sleutel `hero.kickerShort`); het chaos-veld toont alleen drie nodes: Order uit e-mail · Overtypen in ERP · Planning in Excel. **De kop en lead zijn dezelfde als desktop** (het mobiele artboard heeft nog de oude kop en "10 tot 50").

## 02 · Inzicht — `#inzicht`

| Sleutel | Tekst |
|---|---|
| `inzicht.kicker` | Hoofdstuk 02 · Inzicht |
| `inzicht.title` | Eerst de kaart, dan de machine |
| `inzicht.lead` | Ik loop mee met de mensen die het werk doen. Zo zie ik waar informatie wordt overgetypt, blijft liggen of kwijtraakt, en hoeveel tijd dat kost. |
| `inzicht.steps` | Stap 01 Order uit e-mail · Stap 02 Overtypen in ERP · Stap 03 Offerte in Word · Stap 04 Planning in Excel · Stap 05 Factuur handmatig |
| `inzicht.painpoints` | "Overgetypt 2×" (tussen 01–02) · "Wacht ± 2 dagen" (tussen 02–03) · "Kwijt in de mailbox" (tussen 04–05) |
| `inzicht.method[0]` | **Meelopen** — Ik kijk mee op de werkvloer, niet alleen vanaf het organogram. |
| `inzicht.method[1]` | **Meten** — Per stap: hoe vaak, hoe lang, in welk systeem. |
| `inzicht.method[2]` | **Vastleggen** — Eén proceskaart waar je hele team zich in herkent. |

## 03 · Standaardiseren — `#standaard`

| Sleutel | Tekst |
|---|---|
| `standaard.kicker` | Hoofdstuk 03 · Standaardiseren |
| `standaard.title` | Geen standaard, geen automatisering |
| `standaard.lead` | Doen drie mensen hetzelfde werk op drie manieren, dan automatiseer je de chaos. Eerst spreken we één werkwijze af. Pas daarna komt er software. |
| `standaard.lanes[0]` | Planner 1: Order lezen · Excel bijwerken · Mail werkplaats |
| `standaard.lanes[1]` | Planner 2: Order lezen · Werkplaats bellen · Excel bijwerken |
| `standaard.lanes[2]` | Planner 3: Briefje op bureau · Excel bijwerken · Order lezen |
| `standaard.standardLabel` | Eén werkwijze |
| `standaard.standard` | Stap 01 Order vastleggen · Stap 02 Capaciteit checken · Stap 03 Inplannen + melden |

## 04 · Automatiseren — `#automatisch`

| Sleutel | Tekst |
|---|---|
| `automatisch.kicker` | Hoofdstuk 04 · Automatiseren |
| `automatisch.title` | Dan gaat de lijn aan |
| `automatisch.lead` | Ik bouw de oplossing, test hem en documenteer hem. Geen demo die na een maand stilvalt, maar iets dat in productie blijft draaien. |
| `automatisch.exampleLabel` | Voorbeeld · orderverwerking |
| `automatisch.steps` | Stap 01 · Automatisch — Order inlezen · Stap 02 · Automatisch — Offerte opstellen · Stap 03 · Automatisch — Inplannen · Stap 04 · Mens — Controle planner |
| `automatisch.results` | 25 → 4 min · 2× overtypen → 0× · ± 2 dagen → zelfde dag · Blijft mensenwerk |
| `automatisch.promises[0]` | **Getest** — Elke automatisering draait eerst op een testomgeving, met echte voorbeelden uit jouw bedrijf. |
| `automatisch.promises[1]` | **Gedocumenteerd** — Je krijgt een handleiding en een draaiboek voor als er iets misgaat. |
| `automatisch.promises[2]` | **Overgedragen** — Een overdrachtssessie met je team, en 30 dagen garantie. |

## 05 · Eerlijk oordeel — `#oordeel`

| Sleutel | Tekst |
|---|---|
| `oordeel.kicker` | Hoofdstuk 05 · Eerlijk oordeel |
| `oordeel.title` | Niet alles moet automatisch |
| `oordeel.lead` | Klik op een processtap en zie mijn oordeel. Het lijstje met wat je níet moet automatiseren is net zo belangrijk als de rest van het rapport. |
| `oordeel.exampleLabel` | Voorbeeld · fictief productiebedrijf, 28 medewerkers |
| `oordeel.verdictLabels` | go: Automatiseren · wait: Eerst standaardiseren · no: Niet automatiseren |

Verdict-data (→ `src/data/verdicts.ts`; titel, meta en reden zijn tekst en gaan via i18n):

| id | Titel | Verdict | Meta | Reden |
|---|---|---|---|---|
| `offerte` | Offerte opstellen | go | ± 40× per week · 25 min per offerte · 2 systemen | Elke week dezelfde stappen en de gegevens staan al in het ERP. Een sjabloon dat zichzelf vult scheelt ± 13 uur per week. |
| `factuur` | Factuur naar boekhouding | go | ± 60× per maand · 10 min per factuur · gegevens al in ERP | Pure overdracht tussen twee systemen. Goed te automatiseren, met een controle op afwijkende bedragen. |
| `planning` | Productieplanning | wait | Dagelijks · drie planners · in Excel | Iedere planner doet het anders. Eerst één werkwijze vastleggen; pas daarna loont automatiseren. |
| `klacht` | Klachten afhandelen | no | ± 6× per week · veel maatwerk | Weinig volume, veel uitzonderingen, en de klant wil een mens spreken. Hier verdient automatiseren zich niet terug. |
| `inkoop` | Leverancier kiezen | no | Paar keer per maand · relatie en prijs | Dit is een afweging, geen proces. Ik maak de cijfers inzichtelijk; de keuze blijft bij jou. |

Mobiel gebruikt korte chiplabels: Offerte opstellen → "Offerte opstellen", Productieplanning → "Planning", Klachten afhandelen → "Klachten", Factuur naar boekhouding → "Facturen" (veld `shortTitle`).

## 06 · Aanbod — `#aanbod` (licht thema)

| Sleutel | Tekst |
|---|---|
| `aanbod.kicker` | Hoofdstuk 06 · Aanbod |
| `aanbod.title` | Drie stappen, één richting |
| `aanbod.lead` | Je begint klein met een audit. Wat daaruit komt, bouw ik. Wat ik bouw, houd ik draaiend. |
| `aanbod.services[0]` | 01 · Instap · **Automation Audit** — Een week, een eerlijk rapport: waar je tijd weglekt en wat automatiseren oplevert. · Proceskaart van je kernprocessen / 3 tot 5 kansen met kosten en baten / De lijst met wat je níet moet automatiseren · Meta: ± 1 week · vaste prijs |
| `aanbod.services[1]` | 02 · Bouwen · **Implementatie** — Ik bouw de beste kans uit de audit, test hem en draag hem over. · Plan, bouw en tests / Documentatie en overdracht / 30 dagen garantie · Meta: Vaste scope · vaste prijs |
| `aanbod.services[2]` | 03 · Onderhoud · **Care & Development** — Ik houd het draaiend en verbeter het, maand na maand. · Monitoring en fixes / Kleine verbeteringen / Elk kwartaal een procescheck · Meta: Maandelijks |
| `aanbod.note` | Prijzen bespreek ik in een eerste gesprek. Afhankelijk van je regio en sector is een deel van het adviesdeel vaak subsidiabel; ik wijs je de weg. |
| `aanbod.noteMobile` | Prijzen bespreek ik in een eerste gesprek. |
| `aanbod.cta` | Vraag een audit aan → (naar `#contact`) |

## 07 · Over mij — `#over-mij`

| Sleutel | Tekst |
|---|---|
| `overMij.kicker` | Hoofdstuk 07 · Wie ik ben |
| `overMij.title` | Eén aanspreekpunt, van kaart tot code |
| `overMij.name` | Sander Nales |
| `overMij.role` | Oprichter · procesautomatisering & AI |
| `overMij.p1` | Ik ben opgeleid als werktuigbouwkundige en software-engineer. Daardoor kijk ik eerst naar het proces op de werkvloer en pas daarna naar de software. |
| `overMij.p2` | Je hebt één aanspreekpunt: ik doe de audit, bouw de oplossing en onderhoud hem. Wat ik bouw, test en documenteer ik, zodat het blijft werken als ik de deur uit ben. |
| `overMij.email` | nales@forgelineoptimizations.nl |
| `overMij.facts` | Achtergrond: Werktuigbouwkunde · Studie: CSE · TU Delft · Werkwijze: Vaste prijs, vaste scope |
| `overMij.photoAlt` | Sander Nales, oprichter van Forgeline Optimizations |

## 08 · Contact — `#contact` (formulierdeel licht)

| Sleutel | Tekst |
|---|---|
| `contact.kicker` | Hoofdstuk 08 · Contact |
| `contact.title` | Welk proces kost jou te veel tijd? |
| `contact.lead` | Vertel het in een paar zinnen. |
| `contact.fields.name` | Naam |
| `contact.fields.company` | Bedrijf |
| `contact.fields.email` | E-mailadres |
| `contact.fields.phone` | Telefoon *(optioneel)* |
| `contact.fields.message` | Welk proces kost je te veel tijd? |
| `contact.fields.messagePlaceholder` | Bijvoorbeeld: we typen elke order over van de mail naar het ERP. |
| `contact.fields.privacy` | Ik ga akkoord met de verwerking van mijn gegevens volgens de privacyverklaring. ("privacyverklaring" linkt naar `/privacy`) |
| `contact.submit` | Verstuur aanvraag → |
| `contact.sending` | Versturen… |
| `contact.errors.required` | Vul dit veld in. |
| `contact.errors.email` | Vul een volledig e-mailadres in. |
| `contact.errors.privacy` | Vink aan dat je akkoord gaat met de privacyverklaring. |
| `contact.errors.send` | Versturen lukte niet. Probeer het opnieuw of mail naar info@forgelineoptimizations.nl. |
| `contact.subject` | Nieuwe aanvraag via forgelineoptimizations.nl |
| `contact.next.title` | Wat er daarna gebeurt |
| `contact.next.steps` | 01 Ik reageer binnen twee werkdagen. · 02 We hebben een kennismaking van 20 minuten. · 03 Je krijgt een voorstel voor een audit, met vaste prijs. |
| `contact.next.email` | info@forgelineoptimizations.nl |

## Footer

| Sleutel | Tekst |
|---|---|
| `footer.tagline` | Procesautomatisering & AI voor het mkb. |
| `footer.contact` | Contact: info@forgelineoptimizations.nl · Plan een kennismaking |
| `footer.company` | Bedrijfsgegevens: Krammerstraat 23e, 1078 KG Amsterdam · KvK 42183249 · Btw NL005563350B62 |
| `footer.legal` | Juridisch: Privacyverklaring · Algemene voorwaarden |
| `footer.copyright` | © {jaar} Forgeline Optimizations |
| `footer.analytics` | Cookieloze statistieken via Plausible |

## /request-received

| Sleutel | Tekst |
|---|---|
| `received.title` | Bedankt, je aanvraag is binnen |
| `received.lead` | Ik lees je bericht persoonlijk en reageer binnen twee werkdagen. |
| `received.next` | Zelfde drie stappen als `contact.next.steps`. |
| `received.back` | Terug naar de site |
| `received.metaTitle` | Aanvraag ontvangen · Forgeline Optimizations |

## /privacy en /voorwaarden

Structuur staat in fase 3. **Juridische tekst schrijft Claude Code niet zelf**: bouw de pagina met de koppen en placeholders `[TEKST VOLGT — Sander]`. Privacy moet in elk geval noemen: welke gegevens (formuliervelden), doel (reageren op aanvraag), verwerkers (Web3Forms, GitHub Pages, Plausible), bewaartermijn, rechten, contact, geen cookies.

## 404

| Sleutel | Tekst |
|---|---|
| `notFound.title` | Deze pagina bestaat niet |
| `notFound.lead` | De lijn loopt hier dood. Ga terug naar het begin. |
| `notFound.back` | Naar de homepage |
