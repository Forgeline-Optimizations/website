import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home has no serious or critical axe violations', async ({ page }) => {
  await page.goto('/');
  const { violations } = await new AxeBuilder({ page }).analyze();
  const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length}×)`)).toEqual([]);
});
