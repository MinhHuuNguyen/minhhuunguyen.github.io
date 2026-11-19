import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("giảm chuyển động: CountUp hiện số cuối ngay, marquee đứng yên", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-countup]").first()).toHaveText(/^\d+\+$/);
  const anim = await page.locator("[data-marquee-track]").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe("none");
});
test("giảm chuyển động: trang chủ hiện [data-reveal] ngay lúc tải", async ({ page }) => {
  await page.goto("/");
  const opacity = await page.locator("[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});
