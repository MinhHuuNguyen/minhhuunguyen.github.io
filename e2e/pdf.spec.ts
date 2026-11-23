import { test, expect } from "./fixtures";
import { AxeBuilder } from "@axe-core/playwright";
// Nút "Tải PDF" trên trang bài. Bản static (out/ sau `yarn build && yarn build:pdf`) kiểm tra thêm file PDF thật.
const VI = process.env.E2E_SLUG_LESSON!; // vong-lap-trong-python
const PATH_PYTHON = process.env.E2E_PATH_PYTHON!;

test("bài VI có nút Tải PDF trỏ tới /pdf/<slug>.pdf, bấm thì bắn sự kiện", async ({ page }) => {
  await page.goto(`/blog/${VI}`);
  const btn = page.locator("[data-post-pdf]");
  await expect(btn).toBeVisible();
  await expect(btn).toHaveAttribute("href", `/pdf/${VI}.pdf`);
  await expect(btn).toHaveAttribute("download", "");
  await expect(btn).toHaveAccessibleName(/^Tải PDF: /);
  await btn.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault(), { once: true }));
  await btn.click();
  const ev = await page.evaluate(() => (window as any).__ev);
  expect(ev).toContainEqual(["event", "post_pdf_download", { slug: VI, lang: "vi" }]);
});

test("bài series không có nút Tải PDF", async ({ page }) => {
  await page.goto(`/blog/series-${PATH_PYTHON}`);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-post-pdf]")).toHaveCount(0);
});

test("@static bài EN có nút trỏ /pdf/en/<slug>.pdf", async ({ page }) => {
  await page.goto(`/blog/${VI}`);
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await expect(page).toHaveURL(/\/en\/blog\//);
  const slug = new URL(page.url()).pathname.split("/").pop();
  const btn = page.locator("[data-post-pdf]");
  await expect(btn).toHaveAttribute("href", `/pdf/en/${slug}.pdf`);
  await expect(btn).toHaveAccessibleName(/^Download PDF: /);
});

test("@static file PDF tồn tại, đúng content-type, là PDF thật", async ({ page, request }) => {
  await page.goto(`/blog/${VI}`);
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await expect(page).toHaveURL(/\/en\/blog\//);
  const enHref = await page.locator("[data-post-pdf]").getAttribute("href");
  for (const href of [`/pdf/${VI}.pdf`, enHref!]) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
    expect(res.headers()["content-type"], href).toContain("application/pdf");
    const body = await res.body();
    expect(body.subarray(0, 5).toString("latin1"), href).toBe("%PDF-");
    expect(body.length, href).toBeGreaterThan(5000);
  }
});

test("@static nút Tải PDF không gây lỗi axe mới trên khối thông tin bài", async ({ page }) => {
  await page.goto(`/blog/${VI}`);
  const results = await new AxeBuilder({ page }).include("[data-post-pdf]").analyze();
  expect(results.violations).toEqual([]);
});
