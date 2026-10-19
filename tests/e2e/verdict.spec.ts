import { expect, test } from './fixtures';
import { nl } from '../../src/i18n/nl';
import { verdicts, defaultVerdict } from '../../src/data/verdicts';

const pressed = '.fl-verdict__step[aria-pressed="true"]';
const step = (id: string) => `[data-verdict-step="${id}"]`;

test.beforeEach(async ({ page }) => {
  await page.goto('/#werkwijze');
  // De kaart fadet in zodra stap "advies" in beeld komt (motion/chapters/werkwijze.ts): wachten tot
  // motion geladen is en dan erheen scrollen, anders staat de knoppenrij nog op autoAlpha 0.
  await expect(page.locator('html')).toHaveClass(/forge-js/, { timeout: 10_000 });
  await page.locator('[data-step="advies"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
});

test('default open', async ({ page }) => {
  await expect(page.locator(step(defaultVerdict))).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.fl-verdict__panel:visible')).toHaveCount(1);
  await expect(page.locator(`#verdict-${defaultVerdict}`)).toBeVisible();
});

test('click switches', async ({ page }) => {
  await page.locator(step('persoonlijk')).click();
  const panel = page.locator('#verdict-persoonlijk');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.fl-badge')).toHaveText(nl.werkwijze.verdict.labels.no);
  await expect(panel).toContainText(nl.werkwijze.verdict.items.persoonlijk.reason);
  await expect(page.locator('.fl-verdict__panel:visible')).toHaveCount(1);
  await expect(page.locator(`#verdict-${defaultVerdict}`)).toBeHidden();
});

test('one pressed', async ({ page }) => {
  for (const { id } of verdicts) {
    const button = page.locator(step(id));
    await button.click();
    await expect(page.locator(pressed)).toHaveCount(1);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`#verdict-${id}`)).toBeVisible();
  }
});

test('ai vs rules are told apart by text and icon', async ({ page }) => {
  const badge = (id: string) => page.locator(`#verdict-${id} .fl-badge`);
  await page.locator(step('overtypen')).click();
  await expect(badge('overtypen')).toHaveText(/zonder AI/);
  await page.locator(step('documenten')).click();
  await expect(badge('documenten')).toHaveText(/met AI/);
  const iconOf = (id: string) => badge(id).locator('svg').innerHTML();
  expect(await iconOf('overtypen')).not.toEqual(await iconOf('documenten'));
});

test('arrow keys move selection and focus', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop: vier stappen onder elkaar');
  const first = page.locator(step('overtypen'));
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  const documenten = page.locator(step('documenten'));
  await expect(documenten).toBeFocused();
  await expect(documenten).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#verdict-documenten')).toBeVisible();
  await expect(page.locator('#verdict-documenten .fl-badge')).toHaveText(nl.werkwijze.verdict.labels.ai);

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp'); // van stap 1 naar de laatste
  const last = page.locator(step(verdicts[verdicts.length - 1].id));
  await expect(last).toBeFocused();
  await expect(last).toHaveAttribute('aria-pressed', 'true');
});

test('mobile chips', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'alleen mobiel');
  await expect(page.locator('.fl-verdict__step:visible')).toHaveCount(verdicts.length);
  // Laatste chip (persoonlijk) → ArrowRight springt terug naar de eerste.
  await page.locator(step('persoonlijk')).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator(step(defaultVerdict))).toBeFocused();
  await expect(page.locator(pressed)).toHaveCount(1);
  await expect(page.locator(step(defaultVerdict))).toHaveAttribute('aria-pressed', 'true');
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
