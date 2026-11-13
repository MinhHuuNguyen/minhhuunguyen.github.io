import { test, expect } from "@playwright/test";

test("hero: tiêu đề, chân dung, 2 nút ngang hàng, số năm tự tính", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator('[data-section="hero"]');
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText(/Xây dựng AI\s*Giảng dạy AI/);
  const img = hero.getByRole("img", { name: "Nguyễn Hữu Minh" });
  await expect(img).toBeVisible();
  expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  await expect(hero.getByRole("link", { name: /Học AI/ })).toHaveAttribute("href", "/learn");
  await expect(hero.getByRole("link", { name: /Hợp tác/ })).toHaveAttribute("href", "#lien-he");
  await expect(hero).toContainText(/Hơn \d+ năm làm AI/);
});

test("dải neo cuộn tới Câu chuyện", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Câu chuyện" }).click();
  await expect(page.locator("#cau-chuyen")).toBeInViewport();
});

test("câu chuyện có 6 logo có alt; số liệu đủ 4 hàng", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="story"] [data-logo] img')).toHaveCount(6);
  const stats = page.locator('[data-section="stats"] [data-countup]');
  await expect(stats).toHaveCount(4);
  await stats.last().scrollIntoViewIfNeeded();
  await expect(stats.first()).toHaveText(/^\d+\+$/);
});

test("360px: không cuộn ngang", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});
