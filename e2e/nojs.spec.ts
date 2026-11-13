import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("không có JS: khối reveal vẫn hiện", async ({ page }) => {
  await page.goto("/styleguide");
  const opacity = await page.locator("[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});

test("không có JS: trang chủ vẫn có H1 hero và 4 số liệu là số cuối", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="hero"] h1')).toHaveText(/Xây dựng AI\s*Giảng dạy AI/);
  const stats = page.locator('[data-section="stats"] [data-countup]');
  await expect(stats).toHaveCount(4);
  await expect(stats.first()).toHaveText(/^\d+\+$/);
});
