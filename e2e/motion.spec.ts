import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("giảm chuyển động: CountUp hiện số cuối ngay, marquee đứng yên", async ({ page }) => {
  await page.goto("/styleguide");
  await expect(page.locator('[data-sg="count-up"] [data-countup]').first()).toHaveText("7+");
  const anim = await page.locator("[data-marquee-track]").first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe("none");
});
