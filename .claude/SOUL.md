# Forgeline website — Soul

## Problem
Nederlandse mkb-eigenaren (10–100 medewerkers) willen investeren in automatisering en AI, maar weten niet wie ze kunnen vertrouwen. De markt zit vol hype, demo's die nooit in productie komen en bureaus die alles automatiseren wat de klant vraagt, ook de chaos. Forgeline Optimizations (eenmanszaak van Sander Nales) verkoopt het tegenovergestelde: eerst een eerlijke diagnose, dan alleen bouwen wat zich terugverdient.

## Wie deze site leest
Een eigenaar of kantoormanager van een productie-, handels- of dienstverlenend bedrijf, vaak niet technisch. Komt meestal via een doorverwijzing, een netwerkbijeenkomst of LinkedIn en googelt "Forgeline" om te checken of Sander serieus is. Leest op een laptop, soms op een telefoon. Heeft twee minuten. Mislukt bezoek = twijfel, geen contact.

## Wat de site moet doen
Een visitekaartje dat in één oogopslag zegt: deze persoon is precies, eerlijk en kan het echt bouwen. Daarna één actie: contact opnemen via het formulier.

## Architectuurgeest
- **De site is zelf het bewijs.** Wie "production-grade" belooft, levert een snelle, toegankelijke, foutloze site. Lighthouse 95+ is geen wens maar een eis.
- **Eén sterk idee, niet vijftien effecten.** De forge line (één doorlopende lijn van chaos naar automatisering) draagt het hele verhaal. Elk ander effect moet die lijn dienen of verdwijnt.
- **Statisch en licht.** Astro, statische HTML, zo min mogelijk JavaScript. Geen framework-runtime als vanilla TypeScript volstaat.
- **Inhoud werkt zonder beweging.** Alles is leesbaar en bruikbaar zonder JavaScript en met `prefers-reduced-motion`. Animatie is een laag erbovenop.
- **Eén bron per waarde.** Kleuren, maten en tekst komen uit het design system en de i18n-bestanden, nooit hard-coded in componenten.
- **Simpel genoeg voor Sander om zelf te onderhouden.** Tekst aanpassen = één bestand in `src/i18n/`.

## Niet-onderhandelbaar
- Geen prijzen op de site.
- Geen cookies, geen tracking die een cookiebanner vereist (Plausible, cookieloos).
- Geen externe requests naar Google Fonts of andere CDN's: alles zelf gehost.
- Tekstcontrast ≥ 4,5:1 in beide thema's; focus altijd zichtbaar; betekenis nooit alleen via kleur.
- Logo nooit uitrekken, draaien, nabouwen of een gloed geven; woordmerk nooit naschrijven in een lettertype.
- Wettelijke bedrijfsgegevens (adres, KvK, btw, e-mail) altijd in de footer.
- Verzonnen voorbeeldgetallen staan altijd gelabeld als *Voorbeeld*.

## Wat dit nooit mag worden
- Geen generieke "AI-bureau"-site met paars-blauwe gradiënten, robots, hersenen of hologrammen.
- Geen terminal- of code-esthetiek: de bezoeker is niet technisch.
- Geen CMS, geen blogplatform, geen SaaS-dashboard. Case studies komen later als Markdown.
- Geen 3D/WebGL-scènes in deze versie.

## Documentatietoon
- Code, commentaar, commits en ADR's: Engels is toegestaan voor code-identifiers; uitleg in docs en ADR's in het Nederlands.
- Sitetekst: Nederlands, ik-vorm naar je, nuchter, concreet, geen hype-woorden, geen uitroeptekens, geen emoji.
- Commentaar legt *waarom* uit, niet *wat*.
- Kort en direct. Een junior developer moet elk bestand begrijpen.
