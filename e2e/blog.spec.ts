// e2e/blog.spec.ts
import { test, expect } from "@playwright/test";

test("lọc theo tag cập nhật URL và giảm số thẻ", async ({ page }) => {
  await page.goto("/blog");
  const cards = page.locator("[data-post-card]");
  const all = await cards.count();
  await page.getByRole("button", { name: /^python/ }).click();
  await expect(page).toHaveURL(/\?tag=python/);
  expect(await cards.count()).toBeLessThan(all);
});

// Chạy trọn sau T22 (bảng ⌘K); ở T17 ô tìm chỉ gọi useSearch().open("blog_field").
test.fixme("có khu Lộ trình với 8 thẻ; ô tìm mở bảng ⌘K", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator("[data-path-card]")).toHaveCount(8);
  await page.getByRole("button", { name: /Tìm bài viết/ }).click();
  await expect(page.getByRole("dialog", { name: "Tìm kiếm" })).toBeVisible();
});
