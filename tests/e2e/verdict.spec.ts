import { expect, test } from './fixtures';
import { nl } from '../../src/i18n/nl';
import { verdicts, verdictsMobile } from '../../src/data/verdicts';

const pressed = '.fl-verdict__step[aria-pressed="true"]';
const step = (id: string) => `[data-verdict-step="${id}"]`;

test.beforeEach(async ({ page }) => {
  await page.goto('/#oordeel');
});

test('default open', async ({ page }) => {
  await expect(page.locator(step('offerte'))).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.fl-verdict__panel:visible')).toHaveCount(1);
  await expect(page.locator('#verdict-offerte')).toBeVisible();
});

test('click switches', async ({ page }) => {
  await page.locator(step('klacht')).click();
  const panel = page.locator('#verdict-klacht');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.fl-badge')).toHaveText(nl.oordeel.verdictLabels.no);
  await expect(panel).toContainText(nl.oordeel.items.klacht.reason);
  await expect(page.locator('.fl-verdict__panel:visible')).toHaveCount(1);
  await expect(page.locator('#verdict-offerte')).toBeHidden();
});

test('one pressed', async ({ page }) => {
  for (const { id } of verdicts) {
    const button = page.locator(step(id));
    if (!(await button.isVisible())) continue; // mobiel: inkoop is verborgen
    await button.click();
    await expect(page.locator(pressed)).toHaveCount(1);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`#verdict-${id}`)).toBeVisible();
  }
});

test('arrow keys move selection and focus', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop: vijf stappen onder elkaar');
  const first = page.locator(step('offerte'));
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const planning = page.locator(step('planning'));
  await expect(planning).toBeFocused();
  await expect(planning).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#verdict-planning')).toBeVisible();
  await expect(page.locator('#verdict-planning .fl-badge')).toHaveText(nl.oordeel.verdictLabels.wait);

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp'); // van stap 1 naar de laatste
  const last = page.locator(step(verdicts[verdicts.length - 1].id));
  await expect(last).toBeFocused();
  await expect(last).toHaveAttribute('aria-pressed', 'true');
});

test('mobile chips', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'alleen mobiel');
  await expect(page.locator('.fl-verdict__step:visible')).toHaveCount(verdictsMobile.length);
  await expect(page.locator(step('inkoop'))).toBeHidden();
  // Laatste zichtbare chip (klacht) → ArrowRight springt over de verborgen inkoop terug naar de eerste.
  await page.locator(step('klacht')).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(step('offerte'))).toBeFocused();
  await expect(page.locator(pressed)).toHaveCount(1);
  await expect(page.locator(step('offerte'))).toHaveAttribute('aria-pressed', 'true');
});

test('badge never color-only', async ({ page }) => {
  const badges = page.locator('.fl-verdict__panel .fl-badge');
  await expect(badges).toHaveCount(verdicts.length);
  for (const badge of await badges.all()) {
    expect((await badge.textContent())?.trim()).toBeTruthy();
    await expect(badge.locator('svg')).toHaveCount(1);
  }
});

test('panel region is live', async ({ page }) => {
  await expect(page.locator('.fl-verdict__panels')).toHaveAttribute('aria-live', 'polite');
});
