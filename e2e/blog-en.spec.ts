import { test, expect } from "./fixtures";
// Cần fixture dev: POSTS_EXTRA_ROOT + POSTS_EN_EXTRA_ROOT (playwright.config.ts).
test("bài EN: lang en, hreflang hai chiều, VideoBlock, nút VI|EN đi đúng cặp", async ({ page }) => {
  test.skip(!!process.env.E2E_STATIC, "fixture chỉ có ở dev");
  await page.goto("/en/blog/contract-fixture-video-post-en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute("href", "https://minhhuunguyen.github.io/blog/contract-fixture-video-post");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://minhhuunguyen.github.io/en/blog/contract-fixture-video-post-en");
  await expect(page.locator("[data-video-block] iframe")).toHaveAttribute("src", /youtube\.com\/embed\/AbCdEfGhIjK\?enablejsapi=1/);
  await page.getByRole("button", { name: "Change language" }).click();
  await expect(page).toHaveURL(/\/blog\/contract-fixture-video-post$/);
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await expect(page).toHaveURL(/\/en\/blog\/contract-fixture-video-post-en$/);
});
test("/en/blog liệt kê bài EN", async ({ page }) => {
  test.skip(!!process.env.E2E_STATIC, "fixture chỉ có ở dev");
  await page.goto("/en/blog");
  await expect(page.locator('[data-post-card] a[href="/en/blog/contract-fixture-video-post-en"]')).toBeVisible();
});
