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

// Công thức KaTeX dài cuộn ngang trong khung riêng, không làm tràn trang.
for (const slug of [process.env.E2E_SLUG_STATS, process.env.E2E_SLUG_OD]) {
  test(`375px không cuộn ngang: /blog/${slug}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(`/blog/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  });
}
