// e2e/smoke.spec.ts
import { test, expect } from "./fixtures";

test("trang chủ trả 200 và có tiêu đề", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/MinhHuuNguyen/);
});
