import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("không có JS: khối reveal vẫn hiện", async ({ page }) => {
  await page.goto("/");
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
test("không có JS: trang bài vẫn có phần thảo luận, link GitHub Discussions và nút báo lỗi", async ({ page }) => {
  await page.goto("/blog/" + process.env.E2E_SLUG_LESSON);
  const section = page.locator("[data-comments]");
  await expect(section.getByRole("heading", { name: "Thảo luận" })).toBeVisible();
  await expect(section.getByRole("link", { name: "GitHub Discussions" })).toHaveAttribute("href", "https://github.com/MinhHuuNguyen/minhhuunguyen.github.io/discussions");
  await expect(section.locator("[data-comments-report]")).toHaveAttribute("href", /\/issues\/new\?template=bao-loi-bai\.yml&/);
});
