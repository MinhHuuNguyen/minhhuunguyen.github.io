import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/blog", "/learn", "/videos", "/projects", "/resume", "/ask", "/privacy", "/en", "/en/learn"];

for (const url of PAGES) {
  test(`axe không có lỗi serious/critical: ${url}`, async ({ page }) => {
    await page.goto(url);
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
  });
}

test("link Bỏ qua tới nội dung là phần tử focus đầu tiên", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveText("Bỏ qua tới nội dung");
});
