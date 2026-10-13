import { test as base } from '@playwright/test';

// Alle e2e-specs importeren `test` hieruit. De productie-build laadt Plausible; tests mogen geen bezoek tellen
// en niet afhangen van plausible.io. Contexten met javaScriptEnabled: false laden het script toch niet.
export const PLAUSIBLE = 'https://plausible.io/**';

export const test = base.extend<{ blockAnalytics: void }>({
  blockAnalytics: [
    async ({ context }, use) => {
      await context.route(PLAUSIBLE, (route) => route.abort());
      await use();
    },
    { auto: true },
  ],
});

export { expect, type Page } from '@playwright/test';
