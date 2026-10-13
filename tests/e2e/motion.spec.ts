import { expect, test, type Page } from '@playwright/test';

/** Wacht tot motion/index.ts draait (lazy na `load`). */
async function motionReady(page: Page) {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/forge-js/, { timeout: 10_000 });
}

async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
  // ScrollTrigger rendert op de volgende frame; scrub ijlt 0,6 s na.
  await page.waitForTimeout(150);
}

const sectionTop = (page: Page, id: string) =>
  page.evaluate((s) => document.getElementById(s)!.getBoundingClientRect().top + scrollY, id);

/** Getekende lengte van de opgelichte lijn: lengte van het `d`-pad. */
const litLength = (page: Page) =>
  page.evaluate(() => {
    const lit = document.querySelector<SVGPathElement>('[data-forge-lit]')!;
    return lit.getAttribute('d') ? lit.getTotalLength() : 0;
  });

async function expectEndState(page: Page) {
  await expect(page.locator('html')).not.toHaveClass(/forge-js/);
  const nodes = page.locator('#automatisch .fl-node');
  for (const i of [0, 1, 2]) await expect(nodes.nth(i)).toHaveAttribute('data-state', 'automated');
  await expect(page.locator('#automatisch [data-new]').first()).toBeVisible();
  await expect(page.locator('[data-forge-svg]')).toBeHidden();
  const rail = await page
    .locator('#inzicht .chapter__rail')
    .evaluate((el) => getComputedStyle(el, '::before').display);
  expect(rail).toBe('block');
}

test('reduced motion = end state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1500); // ruim na het lazy laden
  await expectEndState(page);
});

test('no JS = end state', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expectEndState(page);
  await context.close();
});

test('forge line draws', async ({ page }) => {
  await motionReady(page);
  const atStart = await litLength(page);
  await scrollToY(page, await sectionTop(page, 'oordeel'));
  await expect.poll(() => litLength(page)).toBeGreaterThan(atStart + 1000);
});

test('head follows', async ({ page }) => {
  await motionReady(page);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let last = -Infinity;
  for (const f of [0.1, 0.3, 0.5, 0.7, 0.9]) {
    await scrollToY(page, Math.round(max * f));
    const y = Number(await page.locator('[data-forge-head]').getAttribute('y'));
    expect(y, `kopje bij ${f}`).toBeGreaterThan(last);
    last = y;
  }
});

test('line ends at the submit button', async ({ page }) => {
  await motionReady(page);
  await scrollToY(page, 1e7);
  const [head, button] = await Promise.all([
    page.locator('[data-forge-head]').boundingBox(),
    page.locator('[data-forge-anchor="end"]').boundingBox(),
  ]);
  expect(Math.abs(head!.x + head!.width - button!.x)).toBeLessThanOrEqual(2);
  expect(Math.abs(head!.y + head!.height / 2 - (button!.y + button!.height / 2))).toBeLessThanOrEqual(2);
});

test('anchors still land', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'mobiel heeft geen hoofdstuklinks in de nav');
  await motionReady(page);
  await page.locator('nav.fl-nav').getByRole('link', { name: 'Aanbod' }).click();
  await expect
    .poll(() => page.locator('#aanbod').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeLessThanOrEqual(80);
  expect(
    await page.locator('#aanbod').evaluate((el) => el.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(-1);
});

test('no layout shift from motion', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/forge-js/, { timeout: 10_000 });
  await page.waitForTimeout(1000);
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const e of list.getEntries() as (PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          })[]) {
            if (!e.hadRecentInput) total += e.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(total), 200);
      }),
  );
  expect(cls).toBeLessThan(0.05);
});

test('automatisch switches on', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'mobiel: geen node-choreografie');
  await motionReady(page);
  const nodes = page.locator('#automatisch .fl-node');
  await scrollToY(page, (await sectionTop(page, 'automatisch')) - 200);
  for (const i of [0, 1, 2]) await expect(nodes.nth(i)).toHaveAttribute('data-state', 'standard');
  await expect(page.locator('#automatisch [data-new]').first()).toBeHidden();

  await scrollToY(page, await sectionTop(page, 'oordeel'));
  for (const i of [0, 1, 2]) await expect(nodes.nth(i)).toHaveAttribute('data-state', 'automated');
  await expect(page.locator('#automatisch [data-new]').first()).toBeVisible();
  await expect(nodes.nth(3)).toHaveAttribute('data-state', 'standard'); // blijft mensenwerk

  await scrollToY(page, (await sectionTop(page, 'automatisch')) - 200);
  for (const i of [0, 1, 2]) await expect(nodes.nth(i)).toHaveAttribute('data-state', 'standard');
});

test('gsap only on home', async ({ page }) => {
  const scripts: string[] = [];
  page.on('request', (r) => r.resourceType() === 'script' && scripts.push(r.url()));
  await page.goto('/privacy/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(1000);
  expect(
    await page.evaluate(() => 'gsap' in window || document.documentElement.classList.contains('forge-js')),
  ).toBe(false);
  // De motion-chunk heet naar zijn ingang (index) of bevat ScrollTrigger; geen van beide hoort hier.
  const bodies = await Promise.all(scripts.map((url) => page.request.get(url).then((r) => r.text())));
  expect(bodies.some((b) => b.includes('ScrollTrigger'))).toBe(false);
});
