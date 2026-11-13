import { test, expect } from "./fixtures";

test("@static chưa có video: màn hình trống, menu không có mục Video", async ({ page }) => {
  await page.goto("/videos");
  await expect(page.getByText("Video đang được sản xuất")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Chính" }).getByRole("link", { name: "Video" })).toHaveCount(0);
});

test("dev (fixture): 3 mục, lọc TikTok, phát YouTube, phát TikTok, sự kiện", async ({ page }) => {
  test.skip(!!process.env.E2E_STATIC, "fixture chỉ có ở dev");
  await page.goto("/videos");
  await expect(page.locator("[data-video-card]")).toHaveCount(3);
  await page.getByRole("button", { name: "TikTok" }).click();
  await expect(page.locator("[data-video-card]")).toHaveCount(1);
  await page.getByRole("button", { name: "Tất cả" }).click();
  await page.locator('[data-video-card][data-platform="youtube"] button[aria-label^="Phát"]').click();
  await expect(page.locator('[data-video-card][data-platform="youtube"] iframe')).toHaveAttribute("src", /youtube\.com\/embed\/AbCdEfGhIjK\?autoplay=1&enablejsapi=1/);
  await page.locator('[data-video-card][data-platform="tiktok"] button[aria-label^="Phát"]').click();
  await expect(page.locator('[data-video-card][data-platform="tiktok"] iframe')).toHaveAttribute("src", /^https:\/\/www\.tiktok\.com\/player\/v1\/\d+/);
  const ev = await page.evaluate(() => (window as any).__ev.map((e: any[]) => e[1]));
  expect(ev.filter((n: string) => n === "video_play").length).toBe(2);
  await expect(page.getByRole("navigation", { name: "Chính" }).getByRole("link", { name: "Video" })).toBeVisible();
});
