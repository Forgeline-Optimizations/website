/**
 * Contactformulier (ADR-003). Zonder JS post het formulier gewoon naar Web3Forms met browservalidatie en
 * redirect. Dit script neemt dat over: Nederlandse foutmeldingen per veld, geen dubbele verzending, `fetch`
 * naar Web3Forms en daarna door naar /request-received. Lukt verzenden niet, dan blijven de velden staan.
 * Teksten komen uit data-messages (JSON uit t().contact.errors), zodat het script taalonafhankelijk blijft.
 * Contract met de markup (Contact.astro, Field.astro): elk veld zit in [data-field] met een [data-error]-melding.
 */
type Messages = { required: string; email: string; privacy: string; send: string; sending: string };
type Control = HTMLInputElement | HTMLTextAreaElement;

export function initContactForm(form: HTMLFormElement): void {
  const msg: Messages = JSON.parse(form.dataset.messages!);
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  // Pas nu de browservalidatie uit: zonder dit script blijft die het vangnet.
  form.noValidate = true;

  const setError = (el: Control, text: string | null) => {
    const field = el.closest<HTMLElement>('[data-field]')!;
    const box = field.querySelector<HTMLElement>('[data-error]')!;
    field.classList.toggle('fl-field--error', !!text);
    if (text) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    const describedBy = new Set((el.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
    if (text) describedBy.add(box.id);
    else describedBy.delete(box.id);
    if (describedBy.size) el.setAttribute('aria-describedby', [...describedBy].join(' '));
    else el.removeAttribute('aria-describedby');
    box.querySelector('span')!.textContent = text ?? '';
    box.hidden = !text;
  };

  const errorFor = (el: Control): string | null => {
    if (el instanceof HTMLInputElement && el.type === 'checkbox')
      return el.required && !el.checked ? msg.privacy : null;
    if (el.required && !el.value.trim()) return msg.required;
    if (el.type === 'email' && el.value.trim() && !isEmail(el.value.trim())) return msg.email;
    return null;
  };

  const validate = (el: Control): boolean => {
    const error = errorFor(el);
    setError(el, error);
    return !error;
  };

  const hasError = (el: Control) => el.getAttribute('aria-invalid') === 'true';

  // Het honeypot-veld nooit valideren of focussen.
  const fields = [
    ...form.querySelectorAll<Control>('input:not([type="hidden"]):not([name="botcheck"]), textarea'),
  ];
  fields.forEach((el) => {
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      el.addEventListener('change', () => hasError(el) && validate(el));
      return;
    }
    // Niet al bij het langslopen van een leeg veld klagen; wel zodra er iets staat, en bij het herstellen.
    el.addEventListener('blur', () => (el.value.trim() || hasError(el)) && validate(el));
    el.addEventListener('input', () => hasError(el) && !errorFor(el) && setError(el, null));
  });

  let sending = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const invalid = fields.filter((el) => !validate(el));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    sending = true;
    submit.disabled = true;
    const label = submit.innerHTML;
    submit.textContent = msg.sending;
    status.hidden = true;
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message ?? res.statusText);
      // Alleen het pad: zo blijft de bezoeker op hetzelfde domein (ook op een preview of lokaal).
      location.assign(new URL(String(data.get('redirect')), location.href).pathname);
    } catch {
      status.querySelector('span')!.textContent = msg.send;
      status.hidden = false;
      submit.disabled = false;
      submit.innerHTML = label;
      sending = false;
    }
  });
}

/** Iets@iets.tld: strenger dan de browser (die `marieke@domein` goedkeurt), want dat is bijna altijd een typfout. */
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

document.querySelectorAll<HTMLFormElement>('form[data-contact-form]').forEach(initContactForm);
