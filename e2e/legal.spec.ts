import { test, expect } from "./fixtures";

test("privacy/terms hiện tiêu đề và nhãn Bản nháp khi draft=true", async ({ page }) => {
  for (const url of ["/privacy", "/terms", "/en/privacy", "/en/terms"]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("[data-draft-banner]")).toBeVisible();
  }
});

test("@static trang 404 có lối về trang chủ và nút tìm kiếm", async ({ page }) => {
  const res = await page.goto("/khong-ton-tai-abc");
  expect(res?.status()).toBe(404);
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: /Về trang chủ/ })).toHaveAttribute("href", "/");
  await expect(main.getByRole("button", { name: /Tìm kiếm/ })).toBeVisible();
});
