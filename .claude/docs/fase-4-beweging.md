# Fase 4 — Beweging: de forge line komt tot leven

**Wat deze fase oplevert:** de scroll-choreografie uit `docs/storyboard.md` → Beweging: één doorlopende SVG-lijn die met het scrollen oplicht, en per hoofdstuk één bewegend idee (chaos → kaart → standaard → aan).
**Bepalende keuze:** GSAP + ScrollTrigger binnen één `gsap.matchMedia()` met drie contexten (ADR-005). Zonder JS of met reduced motion blijft de pagina exact zoals na fase 2–3 (eindtoestand).
**Buiten scope:** Lenis is optioneel en pas na de Lighthouse-meting in fase 5; geen 3D, geen geluid, geen cursor-effecten.

Lees vooraf: ADR-005, ADR-010, `docs/storyboard.md` (vooral de tabel Beweging), de oranje notities in `design/storyboard/canvas.json`, `src/scripts/CLAUDE.md`.

---

### Stap 1 — Installeer GSAP

```bash
npm install gsap
```
Alleen `gsap` en `gsap/ScrollTrigger`. Importeer GSAP uitsluitend in `src/scripts/motion/` (ADR-005).

---

### Stap 2 — Maak `src/scripts/motion/index.ts`

**Waarom:** één plek die beslist óf en welke beweging draait, zodat hoofdstukmodules nooit zelf media queries of reduced-motion-checks doen.

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setupForgeLine } from './forge-line';
import * as hero from './chapters/hero';
import * as inzicht from './chapters/inzicht';
import * as standaard from './chapters/standaard';
import * as automatisch from './chapters/automatisch';
import * as aanbod from './chapters/aanbod';
import * as overMij from './chapters/over-mij';
import * as contact from './chapters/contact';

gsap.registerPlugin(ScrollTrigger);

export type MotionContext = { desktop: boolean; mobile: boolean };
const chapters = [hero, inzicht, standaard, automatisch, aanbod, overMij, contact];

const mm = gsap.matchMedia();
mm.add(
  {
    desktop: '(prefers-reduced-motion: no-preference) and (min-width: 900px)',
    mobile: '(prefers-reduced-motion: no-preference) and (max-width: 899.98px)',
  },
  (ctx) => {
    const c = ctx.conditions as MotionContext;
    if (!c.desktop && !c.mobile) return; // reduced motion: niets doen = eindtoestand
    document.documentElement.classList.add('forge-js');
    setupForgeLine(c);
    chapters.forEach((ch) => ch.setup(c));
    return () => document.documentElement.classList.remove('forge-js');
  },
);
```
Laad het lazy vanuit `BaseLayout.astro` zodat GSAP de eerste paint niet blokkeert:
```astro
<script>
  const start = () => void import('../scripts/motion/index');
  const idle = (cb: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(cb) : setTimeout(cb, 1));
  if (document.readyState === 'complete') idle(start);
  else addEventListener('load', () => idle(start), { once: true });
</script>
```
Alleen op `/` (prop `motion` op `BaseLayout`, default `false`).

**Begintoestanden zonder flits:** elementen die invliegen mogen niet eerst zichtbaar zijn en dan verspringen. Gebruik `gsap.from()`/`fromTo()` binnen de context (GSAP zet de begintoestand direct bij het aanmaken) en geen CSS die elementen standaard verbergt.

---

### Stap 3 — Maak `src/components/site/ForgeLine.astro` (SVG-laag) en `src/scripts/motion/forge-line.ts`

**Waarom:** het centrale motief: één lijn over de hele pagina die oplicht tot waar de bezoeker is, met een gloeiend kopje. Een lijn per sectie zou bij elke sectiegrens knippen.

**Markup** (toevoegen aan de bestaande component uit fase 2):
```astro
<svg class="fl-forge" aria-hidden="true" data-forge-svg>
  <path class="fl-forge__track" data-forge-track />  <!-- hele pad, forge-soft -->
  <path class="fl-forge__lit" data-forge-lit />      <!-- opgelicht deel, forge -->
  <rect class="fl-forge__head" data-forge-head width="12" height="12" />
</svg>
```
```css
.fl-forge { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; display: none; z-index: 1; }
html.forge-js .fl-forge { display: block; }
.fl-forge__track { fill: none; stroke: var(--forge-soft); stroke-width: 2; }
.fl-forge__lit   { fill: none; stroke: var(--forge); stroke-width: 2; }
.fl-forge__head  { fill: var(--forge); filter: drop-shadow(0 0 10px rgba(255,135,0,.55)); }
```
`<main>` krijgt `position: relative`. In lichte secties blijft de lijn oranje (`--forge` is in beide thema's gelijk); `forge-soft` mag daar wegvallen.

**Pad:** rechte segmenten met 90°-hoeken door de anchors uit fase 2.
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionContext } from './index';

/** Bouwt het pad: start (hero, midden onder) → naar links naar de rail → omlaag langs alle hoofdstukken → haak naar de verzendknop. */
export function buildPath(main: HTMLElement): string {
  const box = main.getBoundingClientRect();
  const pt = (el: Element, ax: 'center' | 'left' = 'center') => {
    const r = el.getBoundingClientRect();
    return { x: (ax === 'center' ? r.left + r.width / 2 : r.left) - box.left, y: r.top - box.top, h: r.height };
  };
  const start = pt(main.querySelector('[data-forge-anchor="start"]')!);
  const rails = [...main.querySelectorAll('[data-forge-anchor="chapter"]')].map((el) => pt(el));
  const end = pt(main.querySelector('[data-forge-anchor="end"]')!, 'left');
  const railX = rails[0].x;
  const bendY = rails[0].y - 48; // boven het eerste hoofdstuk naar links buigen

  // Omlaag vanaf de start, naar links naar de rail, langs alle rails omlaag, dan een haak naar de knop.
  return [
    `M ${start.x} ${start.y + 6}`,
    `V ${bendY}`,
    `H ${railX}`,
    `V ${end.y + end.h / 2}`,
    `H ${end.x - 8}`,
  ].join(' ');
}

export function setupForgeLine(c: MotionContext): void {
  const main = document.querySelector<HTMLElement>('main')!;
  const track = main.querySelector<SVGPathElement>('[data-forge-track]')!;
  const lit = main.querySelector<SVGPathElement>('[data-forge-lit]')!;
  const head = main.querySelector<SVGRectElement>('[data-forge-head]')!;

  // Opzoektabel: voor elke y de padlengte, zodat het kopje steeds op 60% van het scherm staat.
  let samples: { y: number; len: number }[] = [];
  let total = 0;

  const measure = () => {
    const d = buildPath(main);
    track.setAttribute('d', d);
    lit.setAttribute('d', d);
    total = lit.getTotalLength();
    lit.style.strokeDasharray = `${total}`;
    samples = [];
    for (let len = 0; len <= total; len += 8) samples.push({ y: lit.getPointAtLength(len).y, len });
  };

  const lengthAtY = (y: number) => {
    // het pad gaat alleen omlaag of horizontaal, dus y is monotoon niet-dalend: binair zoeken mag
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; samples[mid].y <= y ? (lo = mid) : (hi = mid - 1); }
    return samples[lo]?.len ?? 0;
  };

  const render = () => {
    const y = scrollY + innerHeight * (c.desktop ? 0.6 : 0.7) - (main.getBoundingClientRect().top + scrollY);
    const len = Math.min(total, lengthAtY(y));
    lit.style.strokeDashoffset = `${total - len}`;
    const p = lit.getPointAtLength(len);
    head.setAttribute('x', String(p.x - 6));
    head.setAttribute('y', String(p.y - 6));
  };

  measure();
  ScrollTrigger.create({ trigger: main, start: 'top top', end: 'bottom bottom', onUpdate: render, onRefresh: () => (measure(), render()) });
  new ResizeObserver(() => ScrollTrigger.refresh()).observe(main);
  render();
}
```
Mobiel: dezelfde functie; `buildPath` gebruikt dan de rail op x = 16 (de anchors staan daar al door de mobiele layout). De hero-start ligt op mobiel links onder de scroll-cue.

**Waarom een opzoektabel:** `getPointAtLength` per scroll-frame over het hele pad is duur; één keer samplen bij `refresh` en daarna binair zoeken houdt het scrollen soepel.

---

### Stap 4 — Maak `src/scripts/motion/chapters/hero.ts`

**Waarom:** het eerste scherm moet "levend" voelen voordat de bezoeker iets doet (notitie s1).

```ts
import { gsap } from 'gsap';
import type { MotionContext } from '../index';

export function setup(c: MotionContext): void {
  if (!c.desktop) return; // mobiel: geen zweef-animatie
  const nodes = gsap.utils.toArray<HTMLElement>('[data-motion="hero-chaos"] .fl-node');
  nodes.forEach((n) => {
    // langzaam zweven; transform op een wrapper-variabele zodat de rotatie (--fl-rotate) blijft
    gsap.to(n, { y: gsap.utils.random(-3, 3), x: gsap.utils.random(-2, 2), duration: gsap.utils.random(2.4, 3.6),
                 ease: 'sine.inOut', yoyo: true, repeat: -1, delay: gsap.utils.random(0, 1.5) });
  });
  gsap.to('[data-motion="hero-chaos"] .fl-wire--chaos', { strokeDashoffset: -40, duration: 6, ease: 'none', repeat: -1 });
  // Stoppen als de hero uit beeld is: scheelt CPU.
  // ScrollTrigger.create({ trigger: '#chaos', start: 'top top', end: 'bottom top', onToggle: (s) => tl.paused(!s.isActive) })
}
```
Let op: GSAP's `x`/`y` combineert met `rotate` in één `transform`. Zet de rotatie daarom via `gsap.set(n, { rotate: Number(getComputedStyle(n).getPropertyValue('--fl-rotate').replace('deg','')) })` vóór het zweven en laat de CSS-rotatie in `.forge-js` vervallen, of zweef een binnen-element. Kies één, documenteer het in de code.

---

### Stap 5 — Maak `chapters/inzicht.ts`

**Waarom:** "dezelfde stappen uit de hero vallen op hun plek" (notitie s2).

**Wat (desktop):** tijdlijn met `scrollTrigger: { trigger: '[data-motion="inzicht-map"]', start: 'top 75%', end: 'center 55%', scrub: 0.6 }`:
1. Elke node `from`: `x: random(-120, 120)`, `y: random(-80, 80)`, `rotate: random(-6, 6)`, `borderStyle: 'dashed'` → eindpositie; `stagger: 0.08`, `ease: 'power2.inOut'` (≈ `ease-in-out`-token).
2. Verbindingslijnen (`::after` kan GSAP niet animeren → render ze in fase 2 als `<span class="fl-node-link">` i.p.v. pseudo-element, of schaal de node-rij-container): `scaleX` 0 → 1, `transformOrigin: 'left center'`.
3. Knelpunt-tags: `autoAlpha` 0 → 1, `y: 8 → 0`, `stagger: 0.15`, als laatste.
**Mobiel:** alleen stap 3 als fade, zonder scrub (`toggleActions: 'play none none reverse'`).

---

### Stap 6 — Maak `chapters/standaard.ts`

**Waarom:** "drie werkwijzen worden één" (notitie s3).

**Wat (desktop):** pin de visual: `scrollTrigger: { trigger: '#standaard', start: 'top top', end: '+=100%', pin: '[data-motion="standaard"]', pinSpacing: true, scrub: 0.6 }`. Volgorde:
1. Chips die niet in de standaard voorkomen ("Mail werkplaats", "Werkplaats bellen", "Briefje op bureau") → `autoAlpha: 0.25`.
2. De drie banen schuiven verticaal naar de middelste (`y` naar elkaar toe, ± 40px) en terug — het "samenkomen".
3. Gestippelde curves: `strokeDasharray` naar `none` door ze te vervangen door `fl-wire--ink` via een `onUpdate`-klasse op 60% voortgang (stippel → doorgetrokken).
4. Standaard-nodes: `borderColor` van `--line-strong` naar `--ink` (lees beide uit `getComputedStyle(document.body)`), `stagger: 0.12`.
**Mobiel:** geen pin; stap 4 als fade.

**Let op pin + anker-links:** test dat de nav-link `#standaard` en de volgende ankers na het pinnen nog op de goede plek uitkomen (`ScrollTrigger.refresh()` na fonts geladen: `document.fonts.ready.then(() => ScrollTrigger.refresh())` in `index.ts`).

---

### Stap 7 — Maak `chapters/automatisch.ts`

**Waarom:** "de lijn gaat aan" — het enige doorlopende effect (notitie s4).

**Wat (desktop):** pin zoals stap 6 (`end: '+=120%'`). Volgorde:
1. Oranje lijn achter de nodes: `strokeDashoffset` van lengte → 0.
2. Nodes 1–3 één voor één van `data-state="standard"` naar `automated`: wissel het attribuut in een `onStart`/`onReverseComplete`-paar per stap (zodat terugscrollen terugzet), plus `boxShadow` van `none` naar de `--glow-forge`-waarde.
3. Resultaatchips: in fase 2 bevat elke chip `<span data-old>25</span> → <span data-new>4 min</span>`; begin met alleen `data-old` zichtbaar, toon `→` en `data-new` als de bijbehorende node aangaat.
4. Pas als alles aan is: de `fl-wire--flow`-streepjes zichtbaar maken (`autoAlpha` 0 → 1). Daarna loopt de CSS-animatie door.
**Fase-2-aanpassing nodig:** zonder JS en met reduced motion moeten nodes direct `automated` zijn en de chips beide waarden tonen; de JS zet bij setup eerst de begintoestand (nodes `standard`, `data-new` verborgen). Doe dat binnen de matchMedia-context zodat het bij reduced motion niet gebeurt.

---

### Stap 8 — Maak `chapters/aanbod.ts`, `over-mij.ts`, `contact.ts`

**Waarom:** de rustige tweede helft; beweging ondersteunt alleen nog (notities s6–s8).

- **`aanbod.ts`:** "het licht gaat aan": de overgang van donker naar licht gebeurt door de sectie zelf; voeg vóór `#aanbod` een `<div class="fl-dawn" aria-hidden="true">` toe (in fase 2-markup) van 30vh hoog met `background: var(--werkplaatswit)` in `data-theme="light"`, waarvan GSAP `opacity` 0 → 1 scrubt (`start: 'top bottom', end: 'top 40%'`). Kaarten: `from { autoAlpha: 0, y: 16 }`, `stagger: 0.12`, `start: 'top 70%'`. Mobiel: alleen de kaarten.
- **`over-mij.ts`:** foto en tekstkolom `from { autoAlpha: 0, y: 16 }`, `duration: tokens.durSlow` (0,64 s), eenmalig. De oranje streep onder de foto `scaleX` 0 → 1.
- **`contact.ts`:** zodra het lijnkopje de verzendknop bereikt (ScrollTrigger op de knop, `start: 'center 60%'`): één keer `boxShadow` → `--glow-forge` en terug in 900ms. Verder niets.

Alle durations uit de tokens: lees ze één keer in `index.ts` met `parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-slow')) / 1000` en geef ze via een kleine `tokens`-helper door.

---

### Stap 9 — Ruim de fallback op in `layout.css` en controleer `forge-js`

**Waarom:** met JS-beweging mag de CSS-rail (fase 1/2) niet dubbel zichtbaar zijn; zonder JS moet hij er juist staan.

**Wat:** controleer dat `html.forge-js .chapter__rail::before { display: none }` en de ticks per hoofdstuk alleen zonder `forge-js` getoond worden (de SVG-laag heeft een eigen kopje). Zet de hero-start (statisch vierkant) op `visibility: hidden` onder `forge-js`: het SVG-kopje begint op dezelfde plek.

---

## Tests

### `tests/e2e/motion.spec.ts`
**Bewijst:** beweging is een laag erbovenop: zonder beweging klopt alles, met beweging werkt de lijn en breekt niets.
| Test | Controleert |
|---|---|
| `reduced motion = end state` | `page.emulateMedia({ reducedMotion: 'reduce' })`: geen `html.forge-js`; Automatisch-nodes 1–3 `data-state="automated"`; chips tonen nieuwe waarden; CSS-rail zichtbaar |
| `no JS = end state` | met JS uit: zelfde als hierboven |
| `forge line draws` | desktop, motion aan: na scrollen naar `#oordeel` is `strokeDashoffset` van `[data-forge-lit]` kleiner dan bij `#chaos` |
| `head follows` | `y` van `[data-forge-head]` stijgt monotoon over 5 scrollposities |
| `anchors still land` | klik nav "Aanbod" → `#aanbod` staat binnen 80px van de bovenkant (ondanks pins) |
| `no layout shift from motion` | CLS uit `PerformanceObserver('layout-shift')` < 0.05 na laden + 1 s |
| `automatisch switches on` | na scrollen door `#automatisch`: nodes 1–3 `automated`; terugscrollen → weer `standard` |
| `gsap only on home` | `/privacy` laadt geen `gsap`-chunk (`page.on('request')`) |

Representatieve test:
```ts
test('reduced motion shows the end state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('load');
  await expect(page.locator('html')).not.toHaveClass(/forge-js/);
  const nodes = page.locator('#automatisch .fl-node');
  for (const i of [0, 1, 2]) await expect(nodes.nth(i)).toHaveAttribute('data-state', 'automated');
  await expect(page.locator('#automatisch [data-new]').first()).toBeVisible();
});
```

---

## Acceptatiecriteria
- [ ] Desktop: de forge line licht op tot ± 60% van het scherm en heeft een gloeiend kopje; hoofdstuk 02–04 doen wat `docs/storyboard.md` beschrijft; 03 en 04 pinnen.
- [ ] Mobiel: alleen lijn, fades, de flow in 04 en het verdict; geen pins.
- [ ] Reduced motion en zonder JS: exact de eindtoestand, niets verborgen.
- [ ] Nav-ankers landen goed; geen zichtbare sprongen bij laden.
- [ ] GSAP wordt alleen op `/` geladen, na `load`.
- [ ] Alle tests groen.

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `package.json` | **Edit** | `gsap` |
| `src/scripts/motion/index.ts` | **Create** | matchMedia, setup, fonts-refresh |
| `src/scripts/motion/forge-line.ts` | **Create** | Pad, opzoektabel, kopje |
| `src/scripts/motion/chapters/hero.ts`, `inzicht.ts`, `standaard.ts`, `automatisch.ts`, `aanbod.ts`, `over-mij.ts`, `contact.ts` | **Create** | Eén idee per hoofdstuk |
| `src/components/site/ForgeLine.astro` | **Edit** | SVG-laag |
| `src/layouts/BaseLayout.astro` | **Edit** | Lazy motion-loader, prop `motion` |
| `src/pages/index.astro` | **Edit** | `motion` aan |
| `src/sections/Inzicht.astro` | **Edit** | Verbindingen als elementen i.p.v. `::after` |
| `src/sections/Automatisch.astro` | **Edit** | `data-old`/`data-new` in chips |
| `src/sections/Aanbod.astro` | **Edit** | `fl-dawn`-overgang |
| `src/styles/layout.css`, `components.css` | **Edit** | `forge-js`-regels, `.fl-forge*` |
| `tests/e2e/motion.spec.ts` | **Create** | 8 tests |
