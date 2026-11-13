import { test, expect } from "./fixtures";

test("/learn có 8 lộ trình kèm số bài, phút, video", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.locator("[data-path-card]")).toHaveCount(8);
  await expect(page.locator("[data-path-card]").first()).toContainText(/\d+ bài · \d+ phút/);
});

test("không có link 404 trong mọi trang lộ trình (Review Focus 2)", async ({ page, request }) => {
  await page.goto("/learn");
  const paths = await page.locator("[data-path-card] a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  for (const p of paths) {
    await page.goto(p!);
    const hrefs = await page.locator('a[href^="/blog/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const h of hrefs) expect((await request.get(h!)).status(), h!).toBe(200);
    await expect(page.locator('[data-lesson][data-available="false"] a')).toHaveCount(0);
  }
});

test("đánh dấu đã học ở trang bài thì trang lộ trình hiện tiến độ và 'Tiếp tục'", async ({ page }) => {
  await page.goto("/learn/" + process.env.E2E_PATH_PYTHON);
  const firstLesson = page.locator('[data-lesson][data-available="true"] a').first();
  await firstLesson.click();
  await page.getByRole("button", { name: "Đánh dấu đã học" }).click();
  await page.goto("/learn/" + process.env.E2E_PATH_PYTHON);
  await expect(page.locator("[data-progress-text]")).toHaveText(/^1\/\d+/);
  await expect(page.getByRole("link", { name: /Tiếp tục/ })).toBeVisible();
});

test("storage bị chặn: trang vẫn chạy và hiện ghi chú (Review Focus 4)", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("SecurityError");
      },
    });
  });
  await page.goto("/learn/" + process.env.E2E_PATH_PYTHON);
  await expect(page.getByText("Trình duyệt không cho lưu tiến độ")).toBeVisible();
});
