import { expect, test } from './fixtures';
import { card } from '../../src/data/visitekaart';
import { site } from '../../src/data/site';

test('loads hidden, noindex, no nav', async ({ page }) => {
  const response = await page.goto('/visitekaart');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('nav.fl-nav')).toHaveCount(0);
  await expect(page.locator('h1')).toHaveText(card.name);
});

test('shows all four contact actions with the right targets', async ({ page }) => {
  await page.goto('/visitekaart');
  const save = page.getByRole('link', { name: 'Contact opslaan' });
  await expect(save).toHaveAttribute('href', '/sander-forgeline.vcf');
  await expect(save).toHaveAttribute('download', '');

  const call = page.getByRole('link', { name: new RegExp(card.phoneDisplay) });
  await expect(call).toHaveAttribute('href', `tel:${card.phoneE164}`);

  const email = page.getByRole('link', { name: 'Mailen' });
  await expect(email).toHaveAttribute('href', `mailto:${site.email}`);

  const website = page.getByRole('link', { name: 'Website bekijken' });
  await expect(website).toHaveAttribute('href', `${site.url}/?ref=visitekaart`);

  for (const btn of [save, call, email, website]) {
    const box = await btn.boundingBox();
    expect(box?.height, 'tap target >= 48px').toBeGreaterThanOrEqual(48);
  }
});

test('button clicks fire a Plausible goal', async ({ page }) => {
  await page.goto('/visitekaart');
  await page.evaluate(() => {
    (window as unknown as { __goals: string[] }).__goals = [];
    window.plausible = (...args: unknown[]) =>
      (window as unknown as { __goals: string[] }).__goals.push(String(args[0]));
  });
  await page.getByRole('link', { name: 'Mailen' }).click(); // mailto: navigeert de pagina niet weg
  const goals = await page.evaluate(() => (window as unknown as { __goals: string[] }).__goals);
  expect(goals).toEqual(['Mailen']);
});

test('no GSAP / ForgeLine bundle loads', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => r.resourceType() === 'script' && scripts.push(r.url()));
  await page.goto('/visitekaart');
  await page.waitForLoadState('load');
  await expect(page.locator('[data-forge-svg]')).toHaveCount(0);
  expect(await page.evaluate(() => 'gsap' in window)).toBe(false);
  const bodies = await Promise.all(scripts.map((url) => page.request.get(url).then((r) => r.text())));
  expect(bodies.some((b) => b.includes('ScrollTrigger'))).toBe(false);
});

test('not linked from anywhere on the main site', async ({ page }) => {
  for (const path of ['/', '/privacy/', '/voorwaarden/', '/request-received/', '/bestaat-niet']) {
    await page.goto(path);
    const html = await page.content();
    expect(html, path).not.toContain('/visitekaart');
  }
});

test('vcf is served with CRLF and the right fields', async ({ page }) => {
  const res = await page.request.get('/sander-forgeline.vcf');
  expect(res.ok()).toBe(true);
  const body = await res.text();
  expect(body).toContain('\r\n');
  expect(body).toContain(`FN:${card.name}`);
  expect(body).toContain(`TEL;TYPE=CELL,VOICE:${card.phoneE164}`);
  expect(body).toContain(`EMAIL;TYPE=INTERNET,WORK:${site.email}`);
});

test('no horizontal scroll on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/visitekaart');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
