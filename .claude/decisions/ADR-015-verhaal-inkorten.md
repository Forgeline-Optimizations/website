# ADR-015: Verhaal inkorten — één hoofdstuk Werkwijze in plaats van vier

**Datum:** 2026-10-19
**Fase:** 7
**Status:** Geaccepteerd

## Context
Feedback op de live pagina: het voorbeeld in Inzicht/Standaard/Automatisch/Oordeel was te groot en te specifiek (facturen, offertes, planning) en liet maar een klein deel zien van wat Sander doet; de pagina was te lang om doorheen te scrollen (± 8 schermen tot het aanbod).

## Beslissing
- De pagina gaat van acht naar vijf hoofdstukken: Chaos, **Werkwijze** (nieuw), Aanbod, Over mij, Contact.
- Inzicht, Standaard, Automatisch en Oordeel worden vervangen door één abstract hoofdstuk Werkwijze met vier stappen langs de forge line: In kaart → Standaardiseren → Automatiseren → Eerlijk advies.
- De laatste stap houdt een klikbare beoordeling over **soorten werk** (vier uitkomsten, inclusief het onderscheid automatiseren met/zonder AI) in plaats van één concreet bedrijfsvoorbeeld.
- Geen pinning meer in Werkwijze: gescrubde animaties per stap terwijl de stap door het beeld scrollt, zodat de scrollafstand niet oploopt.
- Kernboodschap die móét overkomen: "Niet alles moet automatisch. En niet alles heeft AI nodig."

## Onderbouwing
Abstract en algemeen in plaats van één concreet bedrijfsvoorbeeld dekt wat Sander voor uiteenlopende klanten doet, zonder een cijfer te verzinnen dat voor een deel van de doelgroep niet klopt (ADR-009 in de geest: geen ongelabelde voorbeeldgetallen).

## Overwogen alternatieven
- **Het bestaande voorbeeld inkorten (minder stappen, dezelfde vier hoofdstukken):** blijft gebonden aan één (fictief) bedrijf en lost het "te specifiek"-signaal niet op.
- **Pinning behouden per stap binnen Werkwijze:** verlengt de scrollafstand juist weer; in strijd met het doel "korter".

## Gevolgen
- `design/storyboard/{Inzicht,Standaard,Automatisch,Oordeel}.dc.html` (+ `MobielOordeel.dc.html`) zijn historisch; ze blijven in de repo als referentie maar zijn niet meer leidend. De spec van Werkwijze staat in `docs/storyboard.md`.
- `src/data/verdicts.ts` gaat van vijf naar vier items en van drie (`go/wait/no`) naar vier uitkomsten (`rules/ai/wait/no`); `verdictsMobile` vervalt (mobiel toont alle vier).
- De drie motion-modules voor Inzicht/Standaard/Automatisch worden één module `werkwijze.ts` zonder `pinIfFits`.
- Sander herschrijft de nieuwe teksten (hero-labels en Werkwijze) later zelf; dit plan zet ze voorlopig letterlijk zoals in `.claude/docs/fase-7-verhaal-inkorten.md`.

## Afwijkingen van het plan tijdens de implementatie
- Het plan noemde dit besluit `ADR-011`; die naam is inmiddels gebruikt door `ADR-011-astro-check-afhankelijkheden.md` (fase 1). Dit document heet daarom `ADR-015`, het eerste vrije nummer.
- `src/sections/Werkwijze.astro` gebruikt de bestaande `Chapter.astro` (rail · nummer · kop) in plaats van die structuur over te typen; `Chapter.astro` kreeg een optionele `rail`-slot voor de vier extra stap-ticks, zodat de wrapper voor alle hoofdstukken hetzelfde blijft.
