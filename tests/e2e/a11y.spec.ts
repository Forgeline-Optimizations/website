import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Axe op de hele pagina, met een bepaalde sectie in beeld (de nav wisselt mee van thema). */
async function blockingViolations(page: import('@playwright/test').Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`);
}

for (const id of ['chaos', 'oordeel', 'aanbod', 'contact']) {
  test(`no serious or critical axe violations with #${id} in view`, async ({ page }) => {
    await page.goto(`/#${id}`);
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await blockingViolations(page)).toEqual([]);
  });
}
