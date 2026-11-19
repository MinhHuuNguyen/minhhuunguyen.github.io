// e2e/post.spec.ts
import { test, expect } from "@playwright/test";

const YT = "/blog/" + process.env.E2E_SLUG_YT;          // slug của data-engineer-lectures/5_databricks/2-architecture.md
const LONG = "/blog/" + process.env.E2E_SLUG_LONG;      // 5-transfer-weakly-semi-un-self-supervised-learning.md
const SHORT = "/blog/" + process.env.E2E_SLUG_SHORT;    // llm_instruction_finetuning.md
const LESSON = "/blog/" + process.env.E2E_SLUG_LESSON;  // ai-lectures/1_python_basic/markdown/4-loop.md
const FIXTURE = "/blog/contract-fixture-video-post";    // chỉ có ở project dev (POSTS_EXTRA_ROOT)

test("K2/K4: iframe YouTube giữ src embed, có enablejsapi", async ({ page }) => {
  await page.goto(YT);
  const src = await page.locator("#content iframe").first().getAttribute("src");
  expect(src).toMatch(/^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}\?(?:[^#]*&)?enablejsapi=1(?:&[^#]*)?$/);
});

test("SEO: canonical + BlogPosting", async ({ page }) => {
  await page.goto(LONG);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://minhhuunguyen.github.io${LONG}`);
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join()).toContain('"@type":"BlogPosting"');
});

test("mục lục dính ở 1440, tô sáng mục đang đọc; ẩn ở bài ngắn không H2", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(LONG);
  const toc = page.getByRole("navigation", { name: "Mục lục" });
  await expect(toc).toBeVisible();
  const second = toc.getByRole("link").nth(1);
  await second.click();
  await expect(second).toHaveAttribute("aria-current", "true");
  await page.goto(SHORT);
  await expect(page.getByRole("navigation", { name: "Mục lục" })).toHaveCount(0);
});

test("quảng cáo (placeholder): ≤ 4 khối trong bài, không sát code/bảng/công thức/iframe, rail chỉ ≥ 1280, Multiplex sau bài liên quan", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(LONG);
  const ins = page.locator('[data-ad-slot="inArticle"]');
  expect(await ins.count()).toBeLessThanOrEqual(4);
  // Markup: <section data-post-section>…</section><div data-ad-slot="inArticle">…</div><section data-post-section><h2/>…</section>
  const bad = await ins.evaluateAll((els) => {
    const isMedia = (x: Element | null | undefined) => !!x && (x.matches("pre, table, iframe") || !!x.querySelector(".katex-display, iframe"));
    return els.filter((el) => {
      const prevSec = el.previousElementSibling, nextSec = el.nextElementSibling;
      return isMedia(prevSec?.lastElementChild) || isMedia(nextSec?.children[1]) || !!prevSec?.querySelector("iframe") || !!nextSec?.querySelector("iframe");
    }).length;
  });
  expect(bad).toBe(0);
  await expect(page.locator('[data-ad-slot="rail"]')).toBeVisible();
  const order = await page.evaluate(() => [...document.querySelectorAll('[data-related], [data-ad-slot="multiplex"]')].map((e) => e.getAttribute("data-ad-slot") ?? "related"));
  expect(order).toEqual(["related", "multiplex"]);
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(page.locator('[data-ad-slot="rail"]')).toBeHidden();
  await page.goto(SHORT);
  await expect(ins).toHaveCount(0);
});

test("thời gian đọc, bảng cuộn trong khung, không cuộn ngang ở 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(LONG);
  await expect(page.getByText(/\d+ phút đọc/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test("bài thuộc lộ trình: Bài trước/Bài tiếp và Đánh dấu đã học được lưu", async ({ page }) => {
  await page.goto(LESSON);
  const nav = page.locator("[data-lesson-nav]");
  await expect(nav.getByRole("link", { name: /Bài tiếp/ })).toBeVisible();
  await nav.getByRole("button", { name: "Đánh dấu đã học" }).click();
  await page.reload();
  await expect(nav.getByRole("button", { name: "Đã học ✓" })).toBeVisible();
});

test("chương video (fixture): bấm chương thì gửi seekTo tới iframe", async ({ page }) => {
  test.skip(!!process.env.E2E_STATIC, "fixture chỉ có ở dev");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(FIXTURE);
  await page.getByRole("button", { name: /00:30 Ý tưởng/ }).click();
  await expect(page.locator("#content iframe").first()).toHaveAttribute("data-last-seek", "30");
});
