// e2e/ads.spec.ts
import { test, expect } from "@playwright/test";

const NO_ADS = ["/", "/learn", "/videos", "/projects", "/resume", "/ask", "/blog"];

test("không có khối quảng cáo ngoài trang bài", async ({ page }) => {
  for (const url of NO_ADS) {
    await page.goto(url);
    await expect(page.locator("[data-ad-slot]")).toHaveCount(0);
  }
});

test("@static trang bài: link nội bộ là điều hướng cứng, script chỉ có ở trang bài", async ({ page }) => {
  await page.route("**/pagead2.googlesyndication.com/**", (r) => r.abort());
  await page.goto("/");
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(0);
  await page.goto("/blog/mo-hinh-transformer");
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(1);
  await expect(page.locator('header a[href="/learn"]')).toHaveAttribute("data-hard-nav", "true");
});
