# Button

Eén knopcomponent in drie varianten: `primary` voor de ene hoofdactie per scherm, `secondary` voor een alternatief, `link` voor een tekstuele vervolgstap.

**Wat je meegeeft:** het label (werkwoord + object, in het Nederlands: "Plan een kennismaking"), een `href` of `type`, en optioneel de pijl `→` in `.fl-btn__arrow`.

**Regels**
- Maximaal één `fl-btn--primary` per hoofdstuk. De hoofdactie van de hele site is *Plan een kennismaking* of *Vraag een audit aan*.
- Primair is `forge` met `on-forge` tekst (zwart op oranje, 7,8:1). Nooit witte tekst op oranje.
- Labels in `label`-stijl: Saira, hoofdletters, gespatieerd.
- Hover op primair: wordt `ink` met `surface` tekst. Focus: `focus-ring`, 2px, 3px afstand.
- `fl-btn--sm` alleen in de navigatiebalk.
- Gebruik `<a>` voor navigatie, `<button>` voor formulieracties.
