import { test, expect } from "./fixtures";

test("menu Tải CV có 2 bản PDF cũ và bắn resume_download", async ({ page }) => {
  await page.goto("/resume");
  await page.getByRole("button", { name: "Tải CV" }).click();
  const items = page.getByRole("menuitem");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toHaveAttribute("href", "/resume.pdf");
  await expect(items.nth(1)).toHaveAttribute("href", "/resume-full.pdf");
  await items.nth(0).click();
  expect(await page.evaluate(() => (window as any).__ev.some((e: any[]) => e[1] === "resume_download" && e[2].variant === "resume"))).toBe(true);
});

test("/resume giữ body CV cũ: #resume và #project-detail", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.locator("#resume")).toBeVisible();
  await expect(page.locator("#project-detail")).toBeVisible();
});
