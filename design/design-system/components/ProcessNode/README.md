# ProcessNode

Eén processtap van een klant, als blok dat langs de forge line van chaos naar automatisering gaat.

**Wat je meegeeft:** de stapnaam in klantentaal ("Offerte opstellen", niet "Quote generation"), een index, en `data-state`: `chaos`, `mapped`, `standard` of `automated`.

**Toestanden**
- `chaos`: gestippelde rand in `line-strong`, licht gedraaid, naam in `ink-muted`. Hoofdstuk 01.
- `mapped`: rechte, massieve rand. Hoofdstuk 02.
- `standard`: rand in `ink`. Hoofdstuk 03.
- `automated`: rand en poort in `forge`, `glow-forge`. Hoofdstuk 04. Index-tekst zegt het ook ("Automatisch"), zodat het niet alleen aan kleur hangt.

**Regels**
- Overgangen tussen toestanden duren `dur-slow` met `ease-in-out`, aangestuurd door de scrollpositie.
- Nooit meer dan acht nodes tegelijk in beeld (mobiel: vier).
- De poort rechts is waar de forge line aankoppelt.
