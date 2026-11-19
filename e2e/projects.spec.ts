import { test, expect } from "./fixtures";

test("@static chưa có case study: không có 'Xem chi tiết' ở / và /projects, vẫn có Các dự án khác", async ({ page }) => {
  for (const url of ["/", "/projects"]) {
    await page.goto(url);
    await expect(page.getByRole("link", { name: /Xem chi tiết/ })).toHaveCount(0);
  }
  await expect(page.locator("[data-other-project]")).toHaveCount(10);
});

test("dev (fixture): case study có trang, thiếu bản en thì hiện ghi chú", async ({ page }) => {
  test.skip(!!process.env.E2E_STATIC, "fixture chỉ có ở dev");
  await page.goto("/projects");
  await page.getByRole("link", { name: /Xem chi tiết/ }).first().click();
  await expect(page).toHaveURL(/\/projects\/demo-case-study$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await expect(page.getByText("The English version is being updated")).toBeVisible();
});
