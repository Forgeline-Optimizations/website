import { expect, test } from './fixtures';
import { nl } from '../../src/i18n/nl';
import { site } from '../../src/data/site';
import { readLegal } from '../support/legal';

const privacy = readLegal('privacy').meta;
const terms = readLegal('voorwaarden').meta;

test('request-received', async ({ page }) => {
  const res = await page.goto('/request-received/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText(nl.received.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('main').getByRole('link', { name: nl.received.back })).toHaveAttribute(
    'href',
    '/',
  );
  await expect(page.locator('main')).toContainText(nl.contact.next.steps[0]);
});

test('privacy', async ({ page }) => {
  const res = await page.goto('/privacy/');
  expect(res?.status()).toBe(200);
  const main = page.locator('main');
  await expect(page.locator('h1')).toHaveText(nl.legal.privacy.title);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(main.locator('h2')).toHaveCount(7);
  for (const name of ['Web3Forms', 'GitHub', 'Plausible', 'Zoho Mail'])
    await expect(main.locator('table').nth(1)).toContainText(name);
  await expect(main).toContainText(`${site.address.postalCode} ${site.address.city}`);
  await expect(main).toContainText(site.kvk);
  await expect(main.locator('.legal__updated')).toHaveText(`${nl.legal.updated}: ${privacy.updated}`);
  await expect(main).not.toContainText('[');
  // Link naar artikel 11 komt aan op het artikel (het anker is de slug van de kop in de Markdown).
  await main.getByRole('link', { name: /artikel 11/ }).click();
  await expect(page.locator(':target')).toHaveText(/^Artikel 11/);
});

test('voorwaarden', async ({ page }) => {
  const res = await page.goto('/voorwaarden/');
  expect(res?.status()).toBe(200);
  const main = page.locator('main');
  await expect(page.locator('h1')).toHaveText(nl.legal.terms.title);
  await expect(main.locator('h2')).toHaveCount(15);
  await expect(main.locator('.legal__updated')).toHaveText(
    `${nl.legal.updated}: ${terms.updated} · ${nl.legal.version} ${terms.version}`,
  );
  await expect(main).not.toContainText('[');
});

test('legal tables fit a small phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/privacy/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test('plausible loads on every page, from site.ts', async ({ page }) => {
  for (const path of ['/', '/privacy/', '/request-received/']) {
    const request = page.waitForRequest(site.plausibleScriptSrc);
    await page.goto(path);
    await request; // onderschept en afgebroken door fixtures.ts
    await expect(page.locator(`head script[src="${site.plausibleScriptSrc}"]`)).toHaveCount(1);
  }
});

test('404', async ({ page }) => {
  const res = await page.goto('/bestaat-niet');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText(nl.notFound.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('main').getByRole('link', { name: nl.notFound.back })).toHaveAttribute(
    'href',
    '/',
  );
});

test('footer links reach the legal pages', async ({ page }) => {
  await page.goto('/');
  await page.locator('footer').getByRole('link', { name: nl.footer.privacy }).click();
  await expect(page).toHaveURL(/\/privacy\/?$/);
  await page.locator('footer').getByRole('link', { name: nl.footer.terms }).click();
  await expect(page).toHaveURL(/\/voorwaarden\/?$/);
});
