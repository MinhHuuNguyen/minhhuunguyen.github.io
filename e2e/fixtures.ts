// e2e/fixtures.ts
import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ guard: void }>({
  guard: [async ({ page }, use) => {
    for (const host of ["pagead2.googlesyndication.com", "googletagmanager.com", "google-analytics.com"]) {
      await page.route(`**://*${host}/**`, (r) => r.abort());
    }
    await page.addInitScript(() => {
      (window as any).__ev = [];
      window.addEventListener("site:analytics", (e: any) => (window as any).__ev.push(["event", e.detail.event, e.detail.params]));
    });
    await use();
  }, { auto: true }],
});
export { expect };
