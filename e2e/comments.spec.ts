// e2e/comments.spec.ts
import { test, expect } from "./fixtures";

// Chạy với fixture dev (playwright.config.ts): COMMENTS_CONFIG=test/fixtures/comments.json có id giả,
// POSTS_EXTRA_ROOT/POSTS_EN_EXTRA_ROOT có cặp bài contract-fixture. giscus.app được thay bằng trang giả.
const SITE = "https://minhhuunguyen.github.io";
const LESSON = "/blog/" + process.env.E2E_SLUG_LESSON; // ai-lectures/1_python_basic/markdown/4-loop.md
const LONG = "/blog/" + process.env.E2E_SLUG_LONG;
const LESSON_KEY = "ai-lectures/1_python_basic/markdown/4-loop.md";
const FIXTURE_VI = "/blog/contract-fixture-video-post";
const FIXTURE_EN = "/en/blog/contract-fixture-video-post-en";
const FIXTURE_KEY = "contract/contract-fixture.md";
const DISCUSSIONS = "https://github.com/MinhHuuNguyen/minhhuunguyen.github.io/discussions";
const WIDGET = /^https:\/\/giscus\.app\/(vi|en)\/widget\?/;
const STUB = { status: 200, contentType: "text/html", body: "<!doctype html><title>giscus stub</title>" };
const params = (url: string) => new URL(url).searchParams;

test.beforeEach(async ({ page }) => {
  await page.route("https://giscus.app/**", (r) => r.fulfill(STUB));
});

test("@dev khối thảo luận nằm sau LessonNav và trước Bài liên quan, khóa là đường dẫn file VI", async ({ page }) => {
  await page.goto(LESSON);
  await expect(page.locator("[data-comments]")).toHaveAttribute("data-comments-term", LESSON_KEY);
  const order = await page.evaluate(() => {
    const after = (a: Element | null, b: Element | null) => !!a && !!b && !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    const c = document.querySelector("[data-comments]");
    return { navBefore: after(document.querySelector("[data-lesson-nav]"), c), relatedAfter: after(c, document.querySelector("[data-related]")) };
  });
  expect(order).toEqual({ navBefore: true, relatedAfter: true });
});

test("@dev chỉ nạp giscus khi cuộn tới, với đúng tham số", async ({ page }) => {
  await page.goto(LONG);
  await page.waitForTimeout(1000); // chờ hydrate: nếu widget bị nạp sớm thì lúc này đã có
  await expect(page.locator("giscus-widget")).toHaveCount(0);
  const section = page.locator("[data-comments]");
  const term = await section.getAttribute("data-comments-term");
  const pending = page.waitForRequest(WIDGET);
  await section.scrollIntoViewIfNeeded();
  const url = (await pending).url();
  expect(new URL(url).pathname).toBe("/vi/widget");
  const p = params(url);
  expect(p.get("term")).toBe(term);
  expect(p.get("strict")).toBe("1");
  expect(p.get("repo")).toBe("MinhHuuNguyen/minhhuunguyen.github.io");
  expect(p.get("repoId")).toBe("R_test_repo");
  expect(p.get("category")).toBe("Blog comments");
  expect(p.get("categoryId")).toBe("DIC_test_category");
  expect(p.get("reactionsEnabled")).toBe("1");
  expect(p.get("emitMetadata")).toBe("1");
  expect(p.get("inputPosition")).toBe("bottom");
  expect(p.get("theme")).toBe("noborder_light");
  expect(p.get("backLink")).toBe(`${SITE}${LONG}`);
  expect(p.get("origin")).toMatch(/#giscus-thread$/);
  expect(await page.evaluate(() => (window as any).__ev)).toContainEqual(["event", "comments_view", { lang: "vi" }]);
});

test("@dev bản VI và EN dùng chung thread; đổi ngôn ngữ thì đổi lang, giữ term và backLink bản VI", async ({ page }) => {
  await page.goto(FIXTURE_VI);
  const section = page.locator("[data-comments]");
  await expect(section).toHaveAttribute("data-comments-term", FIXTURE_KEY);
  const vi = page.waitForRequest(/^https:\/\/giscus\.app\/vi\/widget\?/);
  await section.scrollIntoViewIfNeeded();
  expect(params((await vi).url()).get("term")).toBe(FIXTURE_KEY);
  const en = page.waitForRequest(/^https:\/\/giscus\.app\/en\/widget\?/);
  await page.getByRole("button", { name: "Đổi ngôn ngữ" }).click();
  await expect(page).toHaveURL(new RegExp(`${FIXTURE_EN}$`));
  await expect(section).toHaveAttribute("data-comments-term", FIXTURE_KEY);
  await section.scrollIntoViewIfNeeded();
  const p = params((await en).url());
  expect(p.get("term")).toBe(FIXTURE_KEY);
  expect(p.get("backLink")).toBe(`${SITE}${FIXTURE_VI}`);
});

test("@dev quay về từ GitHub sau khi đăng nhập: phiên rời URL trước khi trang chạy script khác, giscus nạp ngay với phiên đó", async ({ page }) => {
  // Ghi lại URL đúng lúc DOMContentLoaded: lúc đó GA/AdSense (afterInteractive) chưa chạy.
  await page.addInitScript(() => document.addEventListener("DOMContentLoaded", () => ((window as any).__hrefAtDcl = location.href)));
  const pending = page.waitForRequest(WIDGET);
  await page.goto(`${FIXTURE_VI}?giscus=test-session#giscus-thread`);
  const hrefAtDcl: string = await page.evaluate(() => (window as any).__hrefAtDcl);
  expect(hrefAtDcl).not.toContain("giscus=");
  expect(hrefAtDcl).toMatch(/#giscus-thread$/);
  expect(params((await pending).url()).get("session")).toBe("test-session");
  expect(await page.evaluate(() => localStorage.getItem("giscus-session"))).toBe('"test-session"');
  await expect(page.locator("[data-comments]")).toBeInViewport();
});

test("@dev nút Báo lỗi mở issue form của repo site, điền sẵn, không có labels", async ({ page }) => {
  await page.goto(LESSON);
  const title = (await page.locator("article h1").textContent())!.trim();
  const link = page.locator("[data-comments-report]");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  const u = new URL((await link.getAttribute("href"))!);
  expect(`${u.origin}${u.pathname}`).toBe("https://github.com/MinhHuuNguyen/minhhuunguyen.github.io/issues/new");
  expect(u.searchParams.get("template")).toBe("bao-loi-bai.yml");
  expect(u.searchParams.get("title")).toBe(`[Báo lỗi] ${title}`);
  expect(u.searchParams.get("page_url")).toBe(`${SITE}${LESSON}`);
  expect(u.searchParams.get("source_file")).toBe(`posts/${LESSON_KEY}`);
  expect(u.searchParams.has("labels")).toBe(false);
  await link.evaluate((a) => a.addEventListener("click", (e) => e.preventDefault(), { once: true }));
  await link.click();
  expect(await page.evaluate(() => (window as any).__ev)).toContainEqual(["event", "comments_report_click", { lang: "vi" }]);
});

test("@dev bài trong exclude (My GitHub Stats) không có khối thảo luận", async ({ page }) => {
  await page.goto("/blog/my-github-stats");
  await expect(page.locator("article h1")).toBeVisible();
  await expect(page.locator("[data-comments]")).toHaveCount(0);
});

test("@dev sang bài liên quan: widget nạp lại với khóa của bài mới", async ({ page }) => {
  await page.goto(LESSON);
  const first = page.waitForRequest(WIDGET);
  await page.locator("[data-comments]").scrollIntoViewIfNeeded();
  expect(params((await first).url()).get("term")).toBe(LESSON_KEY);
  await page.locator("[data-related] a").first().click();
  await expect(page).not.toHaveURL(new RegExp(`${LESSON}$`));
  const section = page.locator("[data-comments]");
  await expect(section).not.toHaveAttribute("data-comments-term", LESSON_KEY);
  const term = await section.getAttribute("data-comments-term");
  const second = page.waitForRequest((r) => WIDGET.test(r.url()) && params(r.url()).get("term") === term);
  await section.scrollIntoViewIfNeeded();
  await second;
});

// T4
test("@dev giscus.app bị chặn: vẫn có tiêu đề, nút báo lỗi, link GitHub, không lỗi JS", async ({ page }) => {
  await page.unroute("https://giscus.app/**");
  await page.route("https://giscus.app/**", (r) => r.abort());
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(LESSON);
  const section = page.locator("[data-comments]");
  await section.scrollIntoViewIfNeeded();
  await expect(page.locator("giscus-widget")).toHaveCount(1);
  await expect(section.getByRole("heading", { name: "Thảo luận" })).toBeVisible();
  await expect(section.locator("[data-comments-report]")).toBeVisible();
  await expect(section.locator("[data-comments-github]")).toHaveAttribute("href", DISCUSSIONS);
  expect(errors).toEqual([]);
});
