import { test, expect } from "@playwright/test";

const PAGES = ["/", "/blog", "/learn", "/videos", "/projects", "/resume", "/ask", "/en", "/en/learn"];

for (const w of [360, 768, 1280, 1440]) {
  for (const url of PAGES) {
    test(`${w}px không cuộn ngang: ${url}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(w);
    });
  }
}
