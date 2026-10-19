import { expect, test } from './fixtures';

test('four steps in order', async ({ page }) => {
  await page.goto('/#werkwijze');
  const steps = page.locator('#werkwijze .fl-step');
  await expect(steps).toHaveCount(4);
  const ids = await steps.evaluateAll((els) => els.map((e) => e.getAttribute('data-step')));
  expect(ids).toEqual(['kaart', 'standaard', 'automatisch', 'advies']);
  for (const step of await steps.all()) await expect(step.locator('h3')).toHaveCount(1);
});

test('core message', async ({ page }) => {
  await page.goto('/#werkwijze');
  await expect(page.locator('#werkwijze')).toContainText('Niet alles moet automatisch');
  await expect(page.locator('#werkwijze')).toContainText('niet alles heeft AI nodig');
});

test('ai vs rules distinct', async ({ page }) => {
  await page.goto('/#werkwijze');
  await expect(page.locator('html')).toHaveClass(/forge-js/, { timeout: 10_000 });
  await page.locator('[data-step="advies"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const badge = (id: string) => page.locator(`#verdict-${id} .fl-badge`);
  await page.locator('[data-verdict-step="overtypen"]').click();
  const rulesText = (await badge('overtypen').textContent())!.trim();
  await page.locator('[data-verdict-step="documenten"]').click();
  const aiText = (await badge('documenten').textContent())!.trim();
  expect(aiText).not.toEqual(rulesText);
  const iconOf = (id: string) => badge(id).locator('svg').innerHTML();
  expect(await iconOf('overtypen')).not.toEqual(await iconOf('documenten'));
});

test('human stays human', async ({ page }) => {
  await page.goto('/#werkwijze');
  const node = page.locator('#werkwijze [data-step="automatisch"] .fl-node').filter({ hasText: 'Mens' });
  await expect(node).toHaveCount(1);
  await expect(node).not.toHaveAttribute('data-state', 'automated');
});

test('no concrete numbers', async ({ page }) => {
  await page.goto('/#werkwijze');
  const text = await page.locator('#werkwijze').innerText();
  expect(text).not.toMatch(/\d+\s?(min|uur|×)/);
});

test('old anchors redirect', async ({ page }) => {
  await page.goto('/#oordeel');
  await expect(page).toHaveURL(/#werkwijze$/);
  await expect(page.locator('#werkwijze')).toBeInViewport();
});

test('page is shorter', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'schermhoogtes los van het apparaat');
  await page.goto('/');
  const innerHeight = await page.evaluate(() => window.innerHeight);
  const top = await page.evaluate(
    () => document.getElementById('aanbod')!.getBoundingClientRect().top + scrollY,
  );
  expect(top).toBeLessThan(innerHeight * 5);
});
