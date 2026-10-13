import { expect, test } from '@playwright/test';
import { nl } from '../../src/i18n/nl';
import { site } from '../../src/data/site';
import { verdictsMobile } from '../../src/data/verdicts';

const order = ['chaos', 'inzicht', 'standaard', 'automatisch', 'oordeel', 'aanbod', 'over-mij', 'contact'];
const titles: Record<string, string> = {
  inzicht: nl.inzicht.title,
  standaard: nl.standaard.title,
  automatisch: nl.automatisch.title,
  oordeel: nl.oordeel.title,
  aanbod: nl.aanbod.title,
  'over-mij': nl.overMij.title,
  contact: nl.contact.title,
};

test('chapters in order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main > section[id]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(order);
});

test('headings', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('#chaos h1')).toHaveText(nl.hero.title);
  for (const [id, title] of Object.entries(titles)) {
    await expect(page.locator(`#${id} h2`)).toHaveText(title);
  }
});

test('themes', async ({ page }) => {
  await page.goto('/');
  for (const id of order) {
    const theme = id === 'aanbod' || id === 'contact' ? 'light' : 'dark';
    await expect(page.locator(`#${id}`)).toHaveAttribute('data-theme', theme);
  }
});

test('example labels', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#automatisch')).toContainText(nl.common.example);
  await expect(page.locator('#oordeel')).toContainText(nl.common.example);
});

test('no JS shows all verdicts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/#oordeel');
  const panels = page.locator('.fl-verdict__panel');
  await expect(panels).toHaveCount(5);
  for (const panel of await panels.all()) await expect(panel).toBeVisible();
  await expect(page.locator('.fl-verdict__steps')).toBeHidden();
  await context.close();
});

test('with JS one verdict panel is open', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.fl-verdict__panel:visible')).toHaveCount(1);
  await expect(page.locator('#verdict-offerte')).toBeVisible();
});

test('form posts to Web3Forms', async ({ page }) => {
  await page.goto('/');
  const form = page.locator('form[data-contact-form]');
  await expect(form).toHaveAttribute('action', 'https://api.web3forms.com/submit');
  await expect(form).toHaveAttribute('method', /post/i);
  await expect(form.locator('input[name="redirect"]')).toHaveValue(site.formRedirect);
  await expect(form.locator('input[name="botcheck"]')).toHaveCount(1);
  // novalidate zet contact-form.ts pas met JS (zie contact.spec.ts).
  for (const name of ['name', 'email', 'message', 'privacy']) {
    await expect(form.locator(`[name="${name}"]`)).toHaveAttribute('required', '');
  }
  await expect(form.locator('[data-forge-anchor="end"]')).toHaveAttribute('type', 'submit');
});

test('nav follows scroll', async ({ page }, testInfo) => {
  await page.goto('/');
  const nav = page.locator('nav.fl-nav');
  await page.locator('#aanbod h2').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const el = document.getElementById('aanbod')!;
    window.scrollTo({ top: el.offsetTop + 100, behavior: 'instant' });
  });
  await expect(nav).toHaveAttribute('data-theme', 'light');
  if (testInfo.project.name === 'desktop') {
    await expect(nav.getByRole('link', { name: 'Aanbod' })).toHaveAttribute('aria-current', 'step');
    await expect(nav.getByRole('link', { name: 'Oordeel' })).toHaveClass(/is-done/);
  }

  await page.evaluate(() => {
    const el = document.getElementById('over-mij')!;
    window.scrollTo({ top: el.offsetTop + 100, behavior: 'instant' });
  });
  await expect(nav).toHaveAttribute('data-theme', 'dark');
  if (testInfo.project.name === 'desktop') {
    await expect(nav.locator('[data-nav-chapter].is-done')).toHaveCount(nl.nav.chapters.length);
  }
});

test('mobile layout', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'alleen mobiel');
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  await expect(page.locator('#chaos .fl-node:visible')).toHaveCount(3);
  const steps = page.locator('.fl-verdict__step:visible');
  await expect(steps).toHaveCount(verdictsMobile.length);
  const tops = await steps.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(new Set(tops).size).toBe(1); // één rij
});

test('no horizontal scroll at in-between widths', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'breedtes los van het apparaat');
  for (const width of [900, 1024, 1199, 1200, 1279, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, `breedte ${width}`).toBeLessThanOrEqual(0);
  }
});
