# ForgeLine

De doorlopende lijn die de bezoeker van boven naar beneden volgt: het proces van de klant, van chaos naar gestroomlijnd. Het centrale beeldmotief van de site.

**Wat je meegeeft:** een SVG-pad per hoofdstuk en de scrollvoortgang (0–1); de lijn tekent zich op met `stroke-dashoffset`.

**Onderdelen**
- `fl-line__chaos`: gestippelde, verwarde lijnen in `line-strong` (alleen hoofdstuk 01).
- `fl-line__path`: het nog niet bereikte deel in `forge-soft`.
- `fl-line__lit`: het bereikte deel in `forge`, `line-width` (2px).
- `fl-line__flow`: korte `ink`-streepjes die over een verlicht deel lopen, één cyclus per `dur-flow`. Alleen op geautomatiseerde delen.
- `fl-line__head`: het vierkante "gloeiende" kopje waar de bezoeker nu is.
- `fl-line__tick`: vierkante punten per hoofdstuk; gevuld `forge` als bereikt.

**Regels**
- Hoeken zijn recht of 90°; geen golvende lijnen buiten hoofdstuk 01.
- Punten zijn vierkant (net als de tandwieltanden), nooit rond.
- Bij `prefers-reduced-motion: reduce`: lijn direct volledig getekend, geen stroom.
- De lijn is decoratief naast tekst die hetzelfde zegt; geef de SVG een `aria-label` of `aria-hidden`.
