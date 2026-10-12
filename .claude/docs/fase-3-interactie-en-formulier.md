# Fase 3 — Interactie en formulier

**Wat deze fase oplevert:** het verdict-paneel reageert op klikken en toetsenbord; het contactformulier valideert in het Nederlands, verstuurt via Web3Forms en stuurt door naar `/request-received`; de losse pagina's `/request-received`, `/privacy`, `/voorwaarden` en `404` bestaan.
**Bepalende keuze:** progressive enhancement zonder UI-framework (ADR-003, ADR-004): de HTML uit fase 2 werkt al zonder JS; deze fase voegt alleen gedrag toe en verwijdert nooit inhoud.
**Buiten scope:** animatie (fase 4), Plausible-doelen (fase 6), definitieve juridische teksten (Sander).

Lees vooraf: ADR-003, ADR-004, `src/scripts/CLAUDE.md`, `design/design-system/components/VerdictCard/README.md` en `ContactForm/README.md`, artboards `Oordeel.dc.html`, `MobielOordeel.dc.html`, `Contact.dc.html`.

---

### Stap 1 — Maak `src/scripts/verdict.ts`

**Waarom:** de bezoeker moet zelf een stap kiezen en het oordeel zien; dit is het moment waarop de pijler "eerlijk over wat níet" tastbaar wordt. Gedrag zoals in de interactieve artboards.

**Wat:**
```ts
/**
 * Koppelt de stapknoppen aan de panelen van één verdict-blok.
 * Contract met de markup (fase 2): [data-verdict-root] > [data-verdict-step=id] + [data-verdict-panel=id].
 * Zichtbaarheid via data-active (zie fase 2, stap 9): CSS toont met JS alleen het actieve paneel.
 */
export function initVerdict(root: HTMLElement): void {
  const steps = [...root.querySelectorAll<HTMLButtonElement>('[data-verdict-step]')];
  const panels = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-verdict-panel]')].map((p) => [p.dataset.verdictPanel!, p]),
  );

  const select = (id: string, focus = false) => {
    steps.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.verdictStep === id)));
    panels.forEach((p, key) => p.toggleAttribute('data-active', key === id));
    if (focus) steps.find((b) => b.dataset.verdictStep === id)?.focus();
  };

  steps.forEach((b, i) => {
    b.addEventListener('click', () => select(b.dataset.verdictStep!));
    // Pijltjes verplaatsen binnen de lijst; Tab verlaat hem (gewone knoppen, geen roving tabindex nodig).
    b.addEventListener('keydown', (e) => {
      const visible = steps.filter((s) => s.offsetParent !== null); // mobiel: inkoop is verborgen
      const at = visible.indexOf(b);
      const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
      if (!next) return;
      e.preventDefault();
      const target = visible[(at + next + visible.length) % visible.length];
      select(target.dataset.verdictStep!, true);
    });
  });

  const initial = steps.find((b) => b.getAttribute('aria-pressed') === 'true') ?? steps[0];
  select(initial.dataset.verdictStep!);
}

document.querySelectorAll<HTMLElement>('[data-verdict-root]').forEach(initVerdict);
```
Laad het vanuit `Oordeel.astro` met `<script>import '../scripts/verdict';</script>`.

**Overgang:** paneelwissel met `opacity` 0 → 1 in `dur-base`/`ease-out` via een CSS-klasse; `prefers-reduced-motion: reduce` → geen overgang. De paneelcontainer krijgt `aria-live="polite"`.

---

### Stap 2 — Maak `src/components/ui/Field.astro` en zet het formulier om

**Waarom:** consistente labels, foutmeldingen en ARIA-koppeling per veld; markup één keer goed.

**Wat:** props uit `src/components/CLAUDE.md`. Rendert:
```astro
<div class="fl-field" class:list={{ 'fl-form__full': full }} data-field={name}>
  <label class="fl-field__label" for={id}>{label}{optionalLabel && <small> {optionalLabel}</small>}</label>
  {textarea
    ? <textarea class="fl-input" id={id} name={name} required={required} placeholder={placeholder}
                aria-describedby={hint ? `${id}-hint` : undefined} />
    : <input class="fl-input" id={id} name={name} type={type} required={required} autocomplete={autocomplete}
             aria-describedby={hint ? `${id}-hint` : undefined} />}
  {hint && <p class="fl-field__hint" id={`${id}-hint`}>{hint}</p>}
  <p class="fl-field__msg" id={`${id}-error`} data-error hidden><Icon name="alert" /><span></span></p>
</div>
```
Vervang in `Contact.astro` de losse velden door `Field` (naam, bedrijf, e-mail, telefoon met `optionalLabel`, bericht als `textarea full`). De privacy-checkbox blijft een `fl-check` met eigen foutmelding. Zet nu `novalidate` op het formulier.

---

### Stap 3 — Maak `src/scripts/contact-form.ts`

**Waarom:** duidelijke Nederlandse foutmeldingen (de browser-standaard is inconsistent en vaak Engels), geen dubbele verzending, en een nette fout als Web3Forms niet bereikbaar is. Zonder JS blijft de gewone POST + redirect werken.

**Wat:** teksten via een `data-messages`-attribuut op het formulier (JSON uit `t().contact.errors`), zodat het script taalonafhankelijk blijft.
```ts
type Messages = { required: string; email: string; privacy: string; send: string; sending: string };

export function initContactForm(form: HTMLFormElement): void {
  const msg: Messages = JSON.parse(form.dataset.messages!);
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;

  const setError = (el: HTMLInputElement | HTMLTextAreaElement, text: string | null) => {
    const field = el.closest('.fl-field, .fl-check')!;
    const box = field.querySelector<HTMLElement>('[data-error]')!;
    field.classList.toggle('fl-field--error', !!text);
    el.setAttribute('aria-invalid', text ? 'true' : 'false');
    const describedBy = new Set((el.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
    text ? describedBy.add(box.id) : describedBy.delete(box.id);
    el.setAttribute('aria-describedby', [...describedBy].join(' '));
    box.hidden = !text;
    box.querySelector('span')!.textContent = text ?? '';
  };

  const validate = (el: HTMLInputElement | HTMLTextAreaElement): boolean => {
    if (el.name === 'privacy' && el instanceof HTMLInputElement && !el.checked) return setError(el, msg.privacy), false;
    if (el.required && !el.value.trim()) return setError(el, msg.required), false;
    if (el.type === 'email' && el.value && !el.validity.valid) return setError(el, msg.email), false;
    setError(el, null);
    return true;
  };

  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type=hidden]):not([name=botcheck]), textarea')];
  fields.forEach((el) => el.addEventListener('blur', () => el.value && validate(el)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = fields.filter((el) => !validate(el));
    if (invalid.length) return invalid[0].focus();

    submit.disabled = true;
    const label = submit.innerHTML;
    submit.textContent = msg.sending;
    status.hidden = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message ?? res.statusText);
      location.assign(new FormData(form).get('redirect') as string);
    } catch {
      status.hidden = false; // fout in status-error met alert-icoon + mailadres
      status.querySelector('span')!.textContent = msg.send;
      submit.disabled = false;
      submit.innerHTML = label;
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-contact-form]').forEach(initContactForm);
```
In `Contact.astro`: `data-messages={JSON.stringify({ ...d.contact.errors, sending: d.contact.sending })}`, een `<p class="fl-field__msg" data-form-status role="alert" hidden><Icon name="alert" /><span></span></p>` naast de knop, en `<script>import '../scripts/contact-form';</script>`.

**Let op:** het honeypot-veld nooit valideren of focussen; Web3Forms filtert submissions waarin `botcheck` is aangevinkt.

---

### Stap 4 — Maak `src/pages/request-received.astro`

**Waarom:** het doel van de redirect (ADR-003) en het conversiedoel voor Plausible (ADR-007).

**Wat:** `BaseLayout` met `noindex`, `showChapters={false}`, titel `received.metaTitle`. Eén `chapter` (donker, `fl-grid-bg`) met volledig getekende rail (CSS) en een oranje eindvierkant (`fl-tick`), `h1` (`received.title`, `fl-display` op 56px max), lead, de drie vervolgstappen (zelfde lijst als in Contact, als component `NextSteps.astro` gedeeld met `Contact.astro`), en `Button secondary` "Terug naar de site" → `/`.

---

### Stap 5 — Maak `src/pages/privacy.astro` en `src/pages/voorwaarden.astro`

**Waarom:** het formulier verwerkt persoonsgegevens (AVG); de footer linkt ernaar. Claude Code schrijft **geen** juridische tekst (`docs/content-nl.md`).

**Wat:** een gedeelde `src/layouts/LegalLayout.astro` (licht thema, `max-width: var(--measure)`, `h1`, datum "Laatst bijgewerkt", koppen `h2`). Privacy krijgt deze koppen met placeholder `[TEKST VOLGT — Sander]` eronder: Wie we zijn (gegevens uit `site.ts`), Welke gegevens, Waarvoor, Verwerkers (Web3Forms, GitHub Pages, Plausible — namen wel invullen), Bewaartermijn, Cookies (geen), Jouw rechten, Contact. Voorwaarden: één placeholder met de notitie uit `docs/README.md` open punt 5.

---

### Stap 6 — Maak `src/pages/404.astro`

**Waarom:** GitHub Pages serveert `404.html` bij onbekende paden; ook die moet in stijl zijn.

**Wat:** `BaseLayout` met `noindex`; donker; `h1` `notFound.title`, lead, `Button primary` naar `/`. Visueel: drie gestippelde `fl-wire--chaos`-lijnen die op een `fl-tick` eindigen ("de lijn loopt hier dood").

---

## Tests

### `tests/e2e/verdict.spec.ts`
**Bewijst:** het eerlijke oordeel werkt met muis en toetsenbord, en toont altijd precies één paneel.
| Test | Controleert |
|---|---|
| `default open` | `offerte` heeft `aria-pressed="true"`, alleen dat paneel zichtbaar |
| `click switches` | klik "Klachten afhandelen" → paneel toont badge "Niet automatiseren" en de reden; andere panelen niet zichtbaar |
| `one pressed` | na elke klik precies één knop `aria-pressed="true"` |
| `arrow keys` | focus op stap 1, `ArrowDown` ×2 → "Productieplanning" geselecteerd én gefocust; `ArrowUp` op stap 1 → laatste zichtbare stap |
| `mobile chips` | project `mobile`: 4 zichtbare chips, `ArrowRight` slaat de verborgen `inkoop` over |
| `badge never color-only` | elke badge bevat tekst en een `svg` |

Representatieve test:
```ts
test('arrow keys move selection and focus', async ({ page }) => {
  await page.goto('/#oordeel');
  const first = page.locator('[data-verdict-step="offerte"]');
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const planning = page.locator('[data-verdict-step="planning"]');
  await expect(planning).toBeFocused();
  await expect(planning).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#verdict-planning')).toBeVisible();
  await expect(page.locator('#verdict-planning .fl-badge')).toHaveText(/Eerst standaardiseren/);
});
```

### `tests/e2e/contact.spec.ts`
**Bewijst:** het formulier helpt de bezoeker, verstuurt correct en faalt netjes. **Netwerk altijd onderscheppen** (`page.route('https://api.web3forms.com/**', …)`).
| Test | Controleert |
|---|---|
| `empty submit` | foutmeldingen bij naam, e-mail, bericht en privacy; focus op naam; geen request |
| `bad email` | `marieke@` → "Vul een volledig e-mailadres in."; `aria-invalid="true"`; melding gekoppeld via `aria-describedby` |
| `error clears` | na corrigeren + blur verdwijnt de melding |
| `success redirects` | route antwoordt `{ success: true }` → URL wordt `/request-received`; body bevat `access_key`, `email`, `message`, `redirect` |
| `failure keeps data` | route antwoordt 500 → statusmelding met het mailadres zichtbaar, velden behouden, knop weer actief |
| `honeypot untouched` | `botcheck` niet in de tab-volgorde, niet aangevinkt in de verzonden body |
| `no JS fallback` | met JS uit: `form` heeft `method=POST`, juiste `action` en `redirect` (niet versturen) |

### `tests/e2e/pages.spec.ts`
| Test | Controleert |
|---|---|
| `request-received` | 200, `h1` uit `received.title`, `meta robots` bevat `noindex`, link terug naar `/` |
| `privacy` | 200, noemt Web3Forms, GitHub en Plausible |
| `voorwaarden` | 200 |
| `404` | `/bestaat-niet` toont de 404-pagina met link naar `/` |

### `tests/e2e/a11y.spec.ts` (uitbreiden)
Axe ook op `/request-received`, `/privacy`, `/voorwaarden`, en op `/` met zichtbare formulierfouten.

---

## Acceptatiecriteria
- [ ] Verdict: klik en pijltjes werken; zonder JS staan alle vijf panelen open.
- [ ] Formulier: Nederlandse fouten per veld, geen verzending bij fouten, succes → `/request-received`, fout → melding met mailadres.
- [ ] Zonder JS: formulier post naar Web3Forms met redirect.
- [ ] Vier losse pagina's bestaan; privacy en voorwaarden met duidelijke placeholders.
- [ ] Alle tests groen; e2e verstuurt nooit een echte aanvraag.

## Samenvatting

| Bestand | Actie | Wat |
|---|---|---|
| `src/scripts/verdict.ts` | **Create** | Selectie, toetsenbord |
| `src/sections/Oordeel.astro` | **Edit** | Script laden, `aria-live`, overgang |
| `src/components/ui/Field.astro` | **Create** | Veld met label, hint, fout |
| `src/components/site/NextSteps.astro` | **Create** | Gedeelde vervolgstappen |
| `src/sections/Contact.astro` | **Edit** | `Field`, `novalidate`, `data-messages`, status, script |
| `src/scripts/contact-form.ts` | **Create** | Validatie en verzending |
| `src/i18n/nl.ts` | **Edit** | Eventuele ontbrekende foutteksten |
| `src/layouts/LegalLayout.astro` | **Create** | Lay-out juridische pagina's |
| `src/pages/request-received.astro`, `privacy.astro`, `voorwaarden.astro`, `404.astro` | **Create** | Losse pagina's |
| `src/styles/components.css` | **Edit** | Paneelovergang, status-melding |
| `tests/e2e/verdict.spec.ts`, `contact.spec.ts`, `pages.spec.ts` | **Create** | 6 + 7 + 4 tests |
| `tests/e2e/a11y.spec.ts` | **Edit** | Extra pagina's en foutstaat |
