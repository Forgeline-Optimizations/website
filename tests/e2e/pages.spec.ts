import { expect, test } from '@playwright/test';
import { nl } from '../../src/i18n/nl';
import { site } from '../../src/data/site';

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
  await expect(page.locator('h1')).toHaveText(nl.legal.privacy.title);
  for (const name of ['Web3Forms', 'GitHub', 'Plausible'])
    await expect(page.locator('main')).toContainText(name);
  await expect(page.locator('main')).toContainText(`${site.address.postalCode} ${site.address.city}`);
  await expect(page.locator('main')).toContainText(`${nl.legal.privacy.kvk} ${site.kvk}`);
  await expect(page.locator('main h2')).toHaveCount(Object.keys(nl.legal.privacy.sections).length);
  await expect(page.locator('main')).toContainText(nl.legal.placeholder);
});

test('voorwaarden', async ({ page }) => {
  const res = await page.goto('/voorwaarden/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText(nl.legal.terms.title);
  await expect(page.locator('main')).toContainText(nl.legal.placeholder);
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
