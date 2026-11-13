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

test("hành trình 3 chặng, stack ≥ 10 icon, 6 giải thưởng", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="journey"] [data-step]')).toHaveCount(3);
  await expect(page.locator('[data-section="journey"] [data-step]').first()).toContainText("[2026 – nay]");
  expect(await page.locator('[data-section="stack"] [data-tech]').count()).toBeGreaterThanOrEqual(10);
  await expect(page.locator('[data-section="awards"] [data-award]')).toHaveCount(6);
});

test("dự án nổi bật: //1–//4, chưa có case study thì không có Xem chi tiết @static", async ({ page }) => {
  await page.goto("/");
  const items = page.locator('[data-section="projects"] [data-project]');
  await expect(items).toHaveCount(4);
  await expect(items.first()).toContainText("//1");
  await expect(page.locator('[data-section="projects"] a', { hasText: "Xem chi tiết" })).toHaveCount(0);
});

test("dải chạy: 0 video thì dùng 5 ảnh sự kiện, bản nhân đôi bị ẩn khỏi trình đọc màn hình, dừng khi rê chuột", async ({ page }) => {
  await page.goto("/");
  const m = page.locator('[data-section="marquee"]');
  await expect(m.locator('[data-marquee-item]:not([aria-hidden="true"]) img')).toHaveCount(5);
  await m.hover();
  expect(await m.locator("[data-marquee-track]").evaluate((el) => getComputedStyle(el).animationPlayState)).toBe("paused");
});

// Môi trường dev nạp thêm case study mẫu (PROJECTS_EXTRA_ROOT): có case study thì chỉ hiện các case study đó, có link chi tiết.
test("dự án nổi bật khi có case study: //1 và link Xem chi tiết @dev", async ({ page }) => {
  await page.goto("/");
  const items = page.locator('[data-section="projects"] [data-project]');
  await expect(items.first()).toContainText("//1");
  await expect(items.first().getByRole("link", { name: /Xem chi tiết/ })).toHaveAttribute("href", /^\/projects\//);
});

test("dịch vụ [1]–[4], bấm mở mô tả", async ({ page }) => {
  await page.goto("/");
  const s = page.locator('[data-section="services"] [data-service]');
  await expect(s).toHaveCount(4);
  await s.nth(2).getByRole("button").click();
  await expect(s.nth(2).locator("[data-service-desc]")).toBeVisible();
});

test("slider lộ trình: 3 slide, mũi tên bàn phím, link tới /learn/", async ({ page }) => {
  await page.goto("/");
  const slider = page.locator('[data-section="paths"]');
  await expect(slider.locator("[data-slide]")).toHaveCount(3);
  await slider.getByRole("button", { name: "Lộ trình tiếp theo" }).press("Enter");
  await expect(slider.locator('[data-slide][aria-hidden="false"] a', { hasText: "Bắt đầu lộ trình" })).toHaveAttribute("href", /^\/learn\//);
});

test("khu bài viết tối có 3 bài và số 01–03; liên hệ có id lien-he, mailto, 3 mạng xã hội", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="articles"] [data-article-card] a[href^="/blog/"]')).toHaveCount(3);
  await expect(page.locator('[data-section="articles"] a[href="/blog"]')).toBeVisible();
  await expect(page.locator('[data-section="articles"] [data-outline-number]')).toHaveText(["01", "02", "03"]);
  const c = page.locator("#lien-he");
  await expect(c.locator('a[href^="mailto:"]').first()).toBeVisible();
  await expect(c.locator("[data-social]")).toHaveCount(3);
});

test("JSON-LD Person có trên trang chủ", async ({ page }) => {
  await page.goto("/");
  const types = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(types.some((t) => t.includes('"@type":"Person"'))).toBe(true);
});
