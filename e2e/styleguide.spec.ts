import { test, expect } from "@playwright/test";

test("styleguide hiện đủ primitive và có focus ring", async ({ page }) => {
  await page.goto("/styleguide");
  for (const id of ["pill-buttons", "chips", "grid-frame", "count-up", "marquee", "rotating-badge", "brand-icons", "section-heading"]) {
    await expect(page.locator(`[data-sg="${id}"]`)).toBeVisible();
  }
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe("none");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
