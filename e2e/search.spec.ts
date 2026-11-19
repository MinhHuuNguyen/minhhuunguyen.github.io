// e2e/search.spec.ts
import { test, expect } from "./fixtures";

test("⌘K / Ctrl+K / '/' mở, Esc đóng", async ({ page }) => {
  await page.goto("/");
  await page.locator("header kbd").waitFor(); // gợi ý phím chỉ hiện sau khi hydrate xong (phím tắt đã gắn)
  await page.keyboard.press(process.platform === "darwin" ? "Meta+k" : "Control+k");
  await expect(page.getByRole("dialog", { name: "Tìm kiếm" })).toBeVisible({ timeout: 30_000 }); // dev biên dịch chunk bảng lần đầu
  await page.keyboard.press("Escape");
  await page.keyboard.press("/");
  await expect(page.getByRole("dialog", { name: "Tìm kiếm" })).toBeVisible();
});

test("gõ không dấu ra bài có dấu, Enter mở bài (Review Focus 1)", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Tìm kiếm/ }).click();
  await page.getByRole("combobox").fill("co che attention");
  const first = page.getByRole("option").first();
  await expect(first).toContainText("Cơ chế Attention");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/blog\/co-che-attention-attention-mechanism/, { timeout: 30_000 }) /* dev biên dịch trang bài lần đầu */;
});

test("không có kết quả: hiện thông báo và mục Hỏi AI; chọn thì chat trả lời sắp ra mắt", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Tìm kiếm/ }).click();
  await page.getByRole("combobox").fill("zzqqxx");
  await expect(page.getByText("Không có kết quả")).toBeVisible();
  await page.getByRole("option", { name: /Hỏi AI: “zzqqxx”/ }).click();
  await expect(page.getByRole("dialog", { name: "Hỏi AI về bài giảng" }).locator('[data-role="assistant"]').last()).toHaveText("Tính năng này sắp ra mắt");
});

test("chỉ mục tải đúng 1 lần cho 2 lần mở", async ({ page }) => {
  let hits = 0;
  page.on("request", (r) => { if (r.url().includes("/search-index.json")) hits++; });
  await page.goto("/");
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: /Tìm kiếm/ }).click();
    await page.getByRole("combobox").fill("transformer");
    await page.keyboard.press("Escape");
  }
  expect(hits).toBe(1);
});
