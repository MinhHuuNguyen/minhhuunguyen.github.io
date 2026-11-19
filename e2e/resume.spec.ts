import { test, expect } from "./fixtures";

test("menu Tải CV có 3 bản PDF và bắn resume_download", async ({ page }) => {
  await page.goto("/resume");
  await page.getByRole("button", { name: "Tải CV" }).click();
  const items = page.getByRole("menuitem");
  await expect(items).toHaveCount(3);
  await expect(items.nth(2)).toHaveAttribute("href", "/resume-designed.pdf");
  await items.nth(0).click();
  expect(await page.evaluate(() => (window as any).__ev.some((e: any[]) => e[1] === "resume_download" && e[2].variant === "ats"))).toBe(true);
});

test("/resume/print: noindex, một cột, không ảnh", async ({ page }) => {
  await page.goto("/resume/print");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main img")).toHaveCount(0);
  expect(await page.locator("main").evaluate((el) => getComputedStyle(el).columnCount)).toBe("auto");
});
