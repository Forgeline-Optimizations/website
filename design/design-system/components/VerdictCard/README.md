# VerdictCard

Het interactieve hart van de site: de bezoeker kiest een processtap en ziet het eerlijke oordeel. Maakt de pijler "eerlijk over wat níet te automatiseren" tastbaar.

**Wat je meegeeft:** een lijst stappen, elk met `title`, `meta` (volume · tijd · systemen), `verdict` (`go` | `wait` | `no`) en een `reason` van één à twee zinnen.

**Verdicts** (altijd icoon + woord, nooit alleen kleur)
- `go` — **Automatiseren**: gevuld `verdict-go`, tekst `on-forge`, pijl-icoon.
- `wait` — **Eerst standaardiseren**: omlijnd in `verdict-wait`, pauze-icoon.
- `no` — **Niet automatiseren**: omlijnd in `verdict-no`, doorgestreept-vierkant-icoon.

**Regels**
- Laat minstens één `no` zien: dat is het verhaal.
- De reden noemt een concreet getal of een concrete oorzaak, geen jargon.
- Stappen zijn `<button aria-pressed>`; het paneel is `aria-live="polite"`. Toetsenbord: Tab + Enter.
- Voorbeelden zijn verzonnen maar realistisch (maakindustrie, handel, zakelijke dienstverlening); markeer ze op de site als voorbeeld.
- Mobiel: stappen worden een horizontale rij chips boven het paneel.
