import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

/** Axe op de hele pagina, met een bepaalde sectie in beeld (de nav wisselt mee van thema). */
async function blockingViolations(page: import('@playwright/test').Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
}

for (const id of ['chaos', 'werkwijze', 'aanbod', 'contact']) {
  test(`no serious or critical axe violations with #${id} in view`, async ({ page }) => {
    await page.goto(`/#${id}`);
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await blockingViolations(page)).toEqual([]);
  });
}

test('no serious or critical axe violations with form errors shown', async ({ page }) => {
  await page.route('https://api.web3forms.com/**', (route) => route.abort());
  await page.goto('/#contact');
  await page.locator('form[data-contact-form] button[type="submit"]').click();
  await expect(page.locator('[data-field="name"] [data-error]')).toBeVisible();
  expect(await blockingViolations(page)).toEqual([]);
});

for (const path of ['/request-received/', '/privacy/', '/voorwaarden/', '/visitekaart/', '/bestaat-niet']) {
  test(`no serious or critical axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    expect(await blockingViolations(page)).toEqual([]);
  });
}
