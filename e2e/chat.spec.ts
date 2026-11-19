// e2e/chat.spec.ts
import { test, expect } from "./fixtures";

test("nút Hỏi AI mở khung chat; gửi câu hỏi nhận đúng 'Tính năng này sắp ra mắt'", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Hỏi AI" }).click();
  const dlg = page.getByRole("dialog", { name: "Hỏi AI về bài giảng" });
  await expect(dlg.locator("[data-suggestion]")).toHaveCount(3);
  const box = dlg.getByRole("textbox", { name: "Câu hỏi" });
  await box.fill("Attention là gì?");
  await box.press("Enter");
  await expect(dlg.locator('[data-role="user"]').last()).toHaveText("Attention là gì?");
  await expect(dlg.locator('[data-role="assistant"]').last()).toHaveText("Tính năng này sắp ra mắt");
});

test("tiếng Anh trả 'This feature is coming soon'", async ({ page }) => {
  await page.goto("/ask");
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await page.getByRole("textbox", { name: "Question" }).fill("What is attention?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.locator('[data-role="assistant"]').last()).toHaveText("This feature is coming soon");
});

test("Shift+Enter xuống dòng, quá 2000 ký tự thì khoá nút gửi", async ({ page }) => {
  await page.goto("/ask");
  const box = page.getByRole("textbox", { name: "Câu hỏi" });
  await box.press("a"); await box.press("Shift+Enter"); await box.press("b");
  await expect(box).toHaveValue("a\nb");
  await box.fill("x".repeat(2001));
  await expect(page.getByRole("button", { name: "Gửi" })).toBeDisabled();
  await expect(page.locator("[data-char-count]")).toHaveText("2001/2000");
});

test("lịch sử còn sau khi tải lại; Xoá hội thoại làm trống", async ({ page }) => {
  await page.goto("/ask");
  await page.getByRole("textbox", { name: "Câu hỏi" }).fill("Xin chào");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-role="assistant"]')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-role="user"]')).toHaveText(["Xin chào"]);
  await page.getByRole("button", { name: "Xoá hội thoại" }).click();
  await expect(page.locator("[data-role]")).toHaveCount(0);
});

test("Hỏi về bài này: có chip ngữ cảnh mang tên bài", async ({ page }) => {
  await page.goto("/blog/" + process.env.E2E_SLUG_LONG);
  const title = await page.getByRole("heading", { level: 1 }).textContent();
  await page.getByRole("button", { name: "Hỏi về bài này" }).first().click();
  await expect(page.getByRole("dialog").locator("[data-context-chip]")).toContainText(title!.trim());
});

test("sessionStorage bị chặn: chat vẫn trả lời (Review Focus 4)", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "sessionStorage", { get() { throw new Error("SecurityError"); } }); });
  await page.goto("/ask");
  await page.getByRole("textbox", { name: "Câu hỏi" }).fill("Hi");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-role="assistant"]').last()).toHaveText("Tính năng này sắp ra mắt");
});

test("mobile: launcher tròn, khung chat toàn màn hình", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Hỏi AI" }).click();
  const box = await page.getByRole("dialog").boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(374);
});
