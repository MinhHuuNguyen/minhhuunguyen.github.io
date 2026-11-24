// e2e/fonts.spec.ts
import { test, expect } from "@playwright/test";

test("Be Vietnam Pro được nạp và hiển thị đủ dấu tiếng Việt", async ({ page }) => {
  await page.goto("/");
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toMatch(/Be[_ ]Vietnam[_ ]Pro/);
  const loaded = await page.evaluate(async () => {
    const probe = document.createElement("span");
    probe.textContent = "Nguyễn Hữu Minh Ễ Ỗ Ữ";
    probe.style.fontWeight = "800";
    document.body.appendChild(probe);
    await document.fonts.ready;
    return [...document.fonts].some((f) => /Be[_ ]Vietnam[_ ]Pro/.test(f.family) && f.status === "loaded");
  });
  expect(loaded).toBe(true);
});
