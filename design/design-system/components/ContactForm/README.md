# ContactForm

Het contactformulier, verzonden via Web3Forms naar info@forgelineoptimizations.nl, met redirect naar `/request-received`.

**Wat je meegeeft:** de Web3Forms `access_key` (publiek, domein vastzetten in Web3Forms), de `redirect`-URL, een `subject`.

**Velden:** naam (verplicht), bedrijf, e-mail (verplicht), telefoon (optioneel), bericht ("Welk proces kost je te veel tijd?"), akkoord privacyverklaring (verplicht), plus de verborgen honeypot `botcheck`.

**Regels**
- Invoervelden op `surface-sunken` met `line-strong` rand (≥3:1); focus: `focus-ring` + `forge` rand.
- Elk label staat boven het veld, nooit alleen een placeholder.
- Fout: rand en melding in `status-error`, altijd met '!'-icoon en een zin die zegt wat te doen. `aria-invalid` + `aria-describedby`.
- Bevestiging (bij JS-verzending) in `status-ok` met vinkje + tekst; zonder JS doet de redirect het werk.
- Geen prijsvraag-veld: wie een prijs wil, vraagt het hier.
- Twee kolommen op desktop, één op mobiel.
