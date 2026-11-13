import { test, expect } from "./fixtures";

test("desktop: menu ngang, không có mục Video khi chưa có video", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/blog");
  const nav = page.getByRole("navigation", { name: "Chính" });
  for (const label of ["Blog", "Lộ trình", "Dự án", "CV"]) await expect(nav.getByRole("link", { name: label })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Video" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Hợp tác/ })).toHaveAttribute("href", "/#lien-he");
});

test("mobile: nút ≡ mở ngăn kéo có đủ mục", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Mở menu" }).click();
  const sheet = page.getByRole("dialog", { name: "Menu" });
  for (const label of ["Blog", "Lộ trình", "Dự án", "CV", "Hỏi AI"]) await expect(sheet.getByRole("link", { name: label })).toBeVisible();
});

test("đổi ngôn ngữ chuyển sang trang /en tương ứng và quay lại", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await expect(page).toHaveURL(/\/en\/blog$/);
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Learn" })).toHaveAttribute("href", "/en/learn");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute("href", "https://minhhuunguyen.github.io/blog");
  await page.getByRole("button", { name: "Change language" }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test("footer: tên cỡ lớn, không có icon kênh chưa cấu hình", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer [data-wordmark]")).toHaveText("Nguyễn Hữu Minh");
  await expect(page.locator('footer a[href*="youtube.com"], footer a[href*="tiktok.com"]')).toHaveCount(0);
  await expect(page.locator('footer a[href="/blog/my-github-stats"]')).toBeVisible();
});

test("sự kiện GA: bấm Hợp tác bắn cta_click", async ({ page }) => {
  // fixture e2e/fixtures.ts (T01) đã gom mọi sự kiện "site:analytics" vào window.__ev dạng ["event", tên, params]
  await page.goto("/blog");
  await page.getByRole("link", { name: /Hợp tác/ }).click();
  const ev = await page.evaluate(() => (window as any).__ev);
  expect(ev).toContainEqual(["event", "cta_click", { cta_id: "collab", location: "header" }]);
});
