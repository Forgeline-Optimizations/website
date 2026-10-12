# NavBar

Vaste balk bovenaan: logo, de hoofdstukken van de forge line als voortgang, en de hoofdactie.

**Wat je meegeeft:** de hoofdstukken (anker + kort label) en welk hoofdstuk actief is (`aria-current="step"`) of al gepasseerd (`is-done`).

**Regels**
- Hoogte `nav-height`. Achtergrond `surface`; na de hero een `line`-onderrand.
- Logo: horizontaal, wit op donker (`/_blob/a670e4afb824a3ed60027faf6b56c8a6`), zwart op licht. Minimaal 140px breed (huisstijl), hier 34px hoog.
- Voortgangspunten zijn vierkant: `forge` gevuld = huidig, `forge` rand = gepasseerd, `line-strong` = nog te gaan. Het woord staat er altijd bij.
- Mobiel (< 900px): hoofdstukken verdwijnen, alleen logo-icoon + knop; voortgang wordt een 2px `forge`-balk onder de nav.
