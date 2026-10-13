import { expect, test, type Page } from '@playwright/test';
import { nl } from '../../src/i18n/nl';
import { site } from '../../src/data/site';

// Nooit een echte aanvraag versturen: elke test onderschept Web3Forms.
const WEB3FORMS = 'https://api.web3forms.com/**';
const e = nl.contact.errors;

const form = (page: Page) => page.locator('form[data-contact-form]');
const submit = (page: Page) => form(page).locator('button[type="submit"]');
const error = (page: Page, field: string) => form(page).locator(`[data-field="${field}"] [data-error]`);

async function fillValid(page: Page) {
  await page.locator('#contact-name').fill('Marieke de Vries');
  await page.locator('#contact-company').fill('Voorbeeld bv');
  await page.locator('#contact-email').fill('marieke@voorbeeld.nl');
  await page.locator('#contact-message').fill('We typen elke order over.');
  await page.locator('#contact-privacy').check();
}

test.beforeEach(async ({ page }) => {
  await page.route(WEB3FORMS, (route) => route.abort());
  await page.goto('/#contact');
});

test('empty submit', async ({ page }) => {
  let requests = 0;
  await page.route(WEB3FORMS, (route) => {
    requests++;
    return route.abort();
  });
  await submit(page).click();
  await expect(error(page, 'name')).toHaveText(e.required);
  await expect(error(page, 'email')).toHaveText(e.required);
  await expect(error(page, 'message')).toHaveText(e.required);
  await expect(error(page, 'privacy')).toHaveText(e.privacy);
  await expect(error(page, 'company')).toBeHidden();
  await expect(error(page, 'phone')).toBeHidden();
  await expect(page.locator('#contact-name')).toBeFocused();
  expect(requests).toBe(0);
});

test('bad email', async ({ page }) => {
  const email = page.locator('#contact-email');
  await email.fill('marieke@');
  await email.blur();
  await expect(error(page, 'email')).toHaveText(e.email);
  await expect(error(page, 'email')).toHaveAttribute('id', 'contact-email-error');
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await expect(email).toHaveAttribute('aria-describedby', /contact-email-error/);
});

test('error clears', async ({ page }) => {
  const email = page.locator('#contact-email');
  await email.fill('marieke@');
  await email.blur();
  await expect(error(page, 'email')).toBeVisible();
  await email.fill('marieke@voorbeeld.nl');
  await email.blur();
  await expect(error(page, 'email')).toBeHidden();
  await expect(email).not.toHaveAttribute('aria-invalid', /.*/);
  await expect(email).not.toHaveAttribute('aria-describedby', /contact-email-error/);

  const privacy = page.locator('#contact-privacy');
  await submit(page).click();
  await expect(error(page, 'privacy')).toBeVisible();
  await privacy.check();
  await expect(error(page, 'privacy')).toBeHidden();
});

test('success redirects', async ({ page }) => {
  let body: Record<string, string> = {};
  await page.route(WEB3FORMS, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { success: true, message: 'Email sent successfully!' } });
  });
  await fillValid(page);
  await submit(page).click();
  await expect(page).toHaveURL(/\/request-received\/?$/);
  expect(body.access_key).toBe(site.web3formsAccessKey);
  expect(body.email).toBe('marieke@voorbeeld.nl');
  expect(body.message).toBe('We typen elke order over.');
  expect(body.redirect).toBe(site.formRedirect);
  expect(body.subject).toBe(nl.contact.subject);
});

test('failure keeps data', async ({ page }) => {
  await page.route(WEB3FORMS, (route) =>
    route.fulfill({ status: 500, json: { success: false, message: 'Server error' } }),
  );
  await fillValid(page);
  await submit(page).click();
  const status = form(page).locator('[data-form-status]');
  await expect(status).toBeVisible();
  await expect(status).toContainText(site.email);
  await expect(status).toHaveAttribute('role', 'alert');
  await expect(page.locator('#contact-name')).toHaveValue('Marieke de Vries');
  await expect(page.locator('#contact-message')).toHaveValue('We typen elke order over.');
  await expect(submit(page)).toBeEnabled();
  await expect(submit(page)).toContainText(nl.contact.submit);
  await expect(page).toHaveURL(/#contact$/);
});

test('no double submit while sending', async ({ page }) => {
  let requests = 0;
  let release!: () => void;
  const held = new Promise<void>((r) => (release = r));
  await page.route(WEB3FORMS, async (route) => {
    requests++;
    await held;
    await route.fulfill({ status: 500, json: { success: false } });
  });
  await fillValid(page);
  await submit(page).click();
  await expect(submit(page)).toBeDisabled();
  await expect(submit(page)).toHaveText(nl.contact.sending);
  await form(page).evaluate((f: HTMLFormElement) => f.requestSubmit());
  release();
  await expect(submit(page)).toBeEnabled();
  expect(requests).toBe(1);
});

test('honeypot untouched', async ({ page }) => {
  let body: Record<string, string> = {};
  await page.route(WEB3FORMS, async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { success: true } });
  });
  const botcheck = form(page).locator('input[name="botcheck"]');
  await expect(botcheck).toHaveAttribute('tabindex', '-1');
  await expect(botcheck).not.toBeChecked();
  await fillValid(page);
  await submit(page).click();
  await expect(page).toHaveURL(/\/request-received\/?$/);
  expect(body.botcheck).toBeUndefined();
});

test('optional label keeps its space', async ({ page }) => {
  await expect(page.locator('label[for="contact-phone"]')).toHaveText(
    `${nl.contact.fields.phone} ${nl.contact.fields.optional}`,
  );
});

test('with JS the browser validation is off', async ({ page }) => {
  await expect(form(page)).toHaveAttribute('novalidate', '');
});

test('no JS fallback', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route(WEB3FORMS, (route) => route.abort());
  await page.goto('/#contact');
  const f = form(page);
  await expect(f).toHaveAttribute('method', /post/i);
  await expect(f).toHaveAttribute('action', 'https://api.web3forms.com/submit');
  await expect(f.locator('input[name="redirect"]')).toHaveValue(site.formRedirect);
  // Zonder script blijft de browservalidatie het vangnet.
  await expect(f).not.toHaveAttribute('novalidate', /.*/);
  for (const name of ['name', 'email', 'message', 'privacy']) {
    await expect(f.locator(`[name="${name}"]`)).toHaveAttribute('required', '');
  }
  await context.close();
});
