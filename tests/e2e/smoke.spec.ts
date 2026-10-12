import { expect, test } from '@playwright/test';
import { nl } from '../../src/i18n/nl';
import { site } from '../../src/data/site';

const isMobile = (name: string) => name === 'mobile';

test('home renders', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page).toHaveTitle(nl.meta.title);
});

test('one h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
});

test('nav works', async ({ page }, testInfo) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: nl.nav.label });
  await expect(nav).toBeVisible();

  const cta = nav.getByRole('link', { name: nl.nav.cta });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', /#contact$/);

  const chapters = nav.locator('.fl-nav__chapters');
  if (isMobile(testInfo.project.name)) {
    await expect(chapters).toBeHidden();
    await expect(nav.locator('.fl-nav__icon.fl-only-dark')).toBeVisible();
  } else {
    await expect(chapters).toBeVisible();
    await expect(chapters.getByRole('link')).toHaveCount(nl.nav.chapters.length);
    await expect(nav.locator('.fl-nav__logo-full.fl-only-dark')).toBeVisible();
  }
});

// ADR-012: in een licht blok binnen de donkere body moet precies het zwarte logo zichtbaar zijn.
test('nav logo follows the nearest theme', async ({ page }, testInfo) => {
  await page.goto('/');
  const nav = page.locator('nav.fl-nav');
  const kind = isMobile(testInfo.project.name) ? '.fl-nav__icon' : '.fl-nav__logo-full';

  await expect(nav.locator(`${kind}.fl-only-dark`)).toBeVisible();
  await expect(nav.locator(`${kind}.fl-only-light`)).toBeHidden();

  await nav.evaluate((el) => el.setAttribute('data-theme', 'light'));
  await expect(nav.locator(`${kind}.fl-only-dark`)).toBeHidden();
  await expect(nav.locator(`${kind}.fl-only-light`)).toBeVisible();
});

test('footer has legal data', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  for (const text of [site.kvk, site.vat, `${site.address.postalCode} ${site.address.city}`, site.email]) {
    await expect(footer).toContainText(text);
  }
});

test('skip link', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: nl.nav.skip });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('fonts self-hosted', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);
  expect(await page.evaluate(() => document.fonts.check('700 72px Saira'))).toBe(true);
});

test('no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
