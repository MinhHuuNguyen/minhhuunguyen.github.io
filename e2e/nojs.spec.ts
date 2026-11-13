import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("không có JS: khối reveal vẫn hiện", async ({ page }) => {
  await page.goto("/styleguide");
  const opacity = await page.locator("[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});
