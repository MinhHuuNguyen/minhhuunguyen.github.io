import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  commentsKey, assertUniqueCommentKeys, validateCommentsConfig, isReady, reportUrl, commentsProps,
  parseGiscusMessage, wantsImmediateMount, REPORT_TITLE_MAX, SESSION_HANDOFF_SCRIPT, SESSION_KEY,
} from "../src/lib/comments.mjs";

const RAW = {
  enabled: true, repo: "MinhHuuNguyen/minhhuunguyen.github.io", repoId: " R_x ", category: " General ", categoryId: "DIC_y",
  exclude: ["minhhuunguyen/README.md"], report: { template: "bao-loi-bai.yml", titlePrefix: { vi: "[Báo lỗi] ", en: "[Error report] " } },
};
const CFG = validateCommentsConfig(RAW).config;
const VI = { relPath: "ai-lectures/1_python_basic/markdown/4-loop.md", commentsKey: null };
const VI_URL = "https://minhhuunguyen.github.io/blog/vong-lap-trong-python";

// Chạy SESSION_HANDOFF_SCRIPT trong một "trình duyệt" giả: location, localStorage, history.
const handoff = (href, { storageThrows = false } = {}) => {
  const store = new Map();
  const replaced = [];
  vm.runInNewContext(SESSION_HANDOFF_SCRIPT, {
    URL,
    location: { href },
    localStorage: { setItem: (k, v) => { if (storageThrows) throw new Error("blocked"); store.set(k, v); } },
    history: { state: null, replaceState: (_state, _title, url) => replaced.push(url) },
  });
  return { store, replaced };
};

test("commentsKey: mặc định là đường dẫn file, không phụ thuộc tiêu đề", () => {
  assert.equal(commentsKey({ ...VI, title: "Vòng lặp trong Python" }), VI.relPath);
  assert.equal(commentsKey({ ...VI, title: "Vòng lặp trong Python (bản sửa)" }), VI.relPath);
});

test("commentsKey: comments_key trong frontmatter thắng và được trim; chuỗi trắng bị bỏ qua", () => {
  assert.equal(commentsKey({ relPath: "moi/4-loop.md", commentsKey: "  ai-lectures/1_python_basic/markdown/4-loop.md " }), VI.relPath);
  assert.equal(commentsKey({ relPath: "moi/4-loop.md", commentsKey: "   " }), "moi/4-loop.md");
});

test("assertUniqueCommentKeys: hai bài cùng khóa thì ném lỗi nêu cả hai file", () => {
  assert.throws(() => assertUniqueCommentKeys([{ relPath: "a.md" }, { relPath: "b.md", commentsKey: "a.md" }]), /khóa bình luận trùng "a\.md": a\.md và b\.md/);
  assert.doesNotThrow(() => assertUniqueCommentKeys([{ relPath: "a.md" }, { relPath: "b.md" }]));
});

test("validateCommentsConfig: cấu hình đúng được chuẩn hóa (trim id và category, exclude mặc định [])", () => {
  const { config, errors } = validateCommentsConfig({ ...RAW, exclude: undefined });
  assert.deepEqual(errors, []);
  assert.equal(config.repoId, "R_x");
  assert.equal(config.category, "General");
  assert.deepEqual(config.exclude, []);
});

test("validateCommentsConfig: báo từng trường sai, đúng thứ tự", () => {
  const { config, errors } = validateCommentsConfig({
    enabled: "yes", repo: "khong-co-gach", repoId: 1, category: " ", categoryId: null, exclude: "a",
    report: { template: "x.md", titlePrefix: { vi: "" } },
  });
  assert.equal(config, null);
  assert.deepEqual(errors, [
    "enabled phải là true hoặc false",
    'repo phải có dạng "owner/name"',
    'repoId phải là chuỗi ("" khi chưa có)',
    'categoryId phải là chuỗi ("" khi chưa có)',
    "category không được rỗng",
    "exclude phải là mảng chuỗi",
    "report.template phải là tên file .yml trong .github/ISSUE_TEMPLATE",
    "report.titlePrefix.en phải là chuỗi",
  ]);
});

test("validateCommentsConfig: id rỗng hợp lệ nhưng isReady là false", () => {
  const { config } = validateCommentsConfig({ ...RAW, repoId: "", categoryId: "" });
  assert.equal(isReady(config), false);
  assert.equal(isReady(CFG), true);
});

test("reportUrl: đúng repo, template, tiêu đề có tiền tố, link bài, file nguồn; không có labels", () => {
  const url = reportUrl(CFG, { locale: "vi", title: "Vòng lặp trong Python", pageUrl: VI_URL, sourceFile: "posts/ai-lectures/1_python_basic/markdown/4-loop.md" });
  assert.equal(url, "https://github.com/MinhHuuNguyen/minhhuunguyen.github.io/issues/new?template=bao-loi-bai.yml&title=%5BB%C3%A1o+l%E1%BB%97i%5D+V%C3%B2ng+l%E1%BA%B7p+trong+Python&page_url=https%3A%2F%2Fminhhuunguyen.github.io%2Fblog%2Fvong-lap-trong-python&source_file=posts%2Fai-lectures%2F1_python_basic%2Fmarkdown%2F4-loop.md");
  for (const k of ["labels", "assignees", "milestone", "projects"]) assert.equal(new URL(url).searchParams.has(k), false);
});

test("reportUrl: ký tự đặc biệt trong tiêu đề đi nguyên vẹn qua URL", () => {
  const title = 'C++ & "Python" #1 — đúng 100%?';
  const u = new URL(reportUrl(CFG, { locale: "en", title, pageUrl: "https://minhhuunguyen.github.io/en/blog/x", sourceFile: "posts-en/x.md" }));
  assert.equal(u.searchParams.get("title"), `[Error report] ${title}`);
  assert.equal(u.hash, "");
});

test("reportUrl: tiêu đề dài hơn 120 ký tự bị cắt còn 119 ký tự và dấu …, đếm theo code point", () => {
  const u = new URL(reportUrl(CFG, { locale: "vi", title: "a".repeat(200), pageUrl: "p", sourceFile: "s" }));
  assert.equal(u.searchParams.get("title"), `[Báo lỗi] ${"a".repeat(REPORT_TITLE_MAX - 1)}…`);
  const e = new URL(reportUrl(CFG, { locale: "vi", title: "😀".repeat(130), pageUrl: "p", sourceFile: "s" }));
  assert.equal(e.searchParams.get("title"), `[Báo lỗi] ${"😀".repeat(REPORT_TITLE_MAX - 1)}…`);
});

test("commentsProps: bản VI và bản EN của cùng bài có cùng term; reportUrl theo trang", () => {
  const vi = commentsProps({ config: CFG, post: VI, locale: "vi", title: "Vòng lặp trong Python", pageUrl: VI_URL, sourceFile: `posts/${VI.relPath}`, backLink: VI_URL });
  const en = commentsProps({ config: CFG, post: VI, locale: "en", title: "Loops in Python", pageUrl: "https://minhhuunguyen.github.io/en/blog/loops-in-python", sourceFile: `posts-en/${VI.relPath}`, backLink: VI_URL });
  assert.equal(en.term, vi.term);
  assert.equal(en.backLink, VI_URL);
  assert.match(en.reportUrl, /title=%5BError\+report%5D\+Loops\+in\+Python&/);
  assert.match(en.reportUrl, /source_file=posts-en%2Fai-lectures/);
  const { reportUrl: _ignored, ...rest } = vi;
  assert.deepEqual(rest, {
    term: VI.relPath, repo: "MinhHuuNguyen/minhhuunguyen.github.io", repoId: "R_x", category: "General", categoryId: "DIC_y",
    ready: true, backLink: VI_URL, discussionsUrl: "https://github.com/MinhHuuNguyen/minhhuunguyen.github.io/discussions",
  });
});

test("commentsProps: null khi tắt bình luận hoặc bài nằm trong exclude", () => {
  const args = { post: VI, locale: "vi", title: "t", pageUrl: "p", sourceFile: "s", backLink: "b" };
  assert.equal(commentsProps({ ...args, config: { ...CFG, enabled: false } }), null);
  assert.equal(commentsProps({ ...args, config: CFG, post: { relPath: "minhhuunguyen/README.md" } }), null);
});

test("parseGiscusMessage: chỉ nhận tin từ giscus.app có discussion và URL GitHub; cộng bình luận với trả lời", () => {
  const ok = { origin: "https://giscus.app", data: { giscus: { discussion: { url: "https://github.com/o/r/discussions/7", totalCommentCount: 3, totalReplyCount: 2 } } } };
  assert.deepEqual(parseGiscusMessage(ok), { count: 5, url: "https://github.com/o/r/discussions/7" });
  assert.equal(parseGiscusMessage({ ...ok, origin: "https://evil.example" }), null);
  assert.equal(parseGiscusMessage({ origin: "https://giscus.app", data: { giscus: { error: "Discussion not found" } } }), null);
  assert.equal(parseGiscusMessage({ origin: "https://giscus.app", data: { giscus: { discussion: { url: "javascript:alert(1)" } } } }), null);
  assert.equal(parseGiscusMessage({ origin: "https://giscus.app", data: "x" }), null);
  assert.equal(parseGiscusMessage(null), null);
});

test("wantsImmediateMount: ?giscus=…, #giscus-thread, #comments thì nạp ngay; còn lại chờ cuộn", () => {
  assert.equal(wantsImmediateMount("?giscus=abc", ""), true);
  assert.equal(wantsImmediateMount("?x=1&giscus=abc", "#giscus-thread"), true);
  assert.equal(wantsImmediateMount("", "#giscus-thread"), true);
  assert.equal(wantsImmediateMount("", "#comments"), true);
  assert.equal(wantsImmediateMount("?x=1", "#h-1-vong-lap-for"), false);
  assert.equal(wantsImmediateMount("", ""), false);
});

test("SESSION_HANDOFF_SCRIPT: ?giscus= vào localStorage dạng JSON, xóa khỏi URL, giữ query khác và hash", () => {
  const { store, replaced } = handoff("https://minhhuunguyen.github.io/blog/x?a=1&giscus=abc#giscus-thread");
  assert.equal(store.get(SESSION_KEY), '"abc"');
  assert.deepEqual(replaced, ["/blog/x?a=1#giscus-thread"]);
});

test("SESSION_HANDOFF_SCRIPT: không có ?giscus= thì không làm gì; localStorage bị chặn thì vẫn xóa khỏi URL", () => {
  assert.deepEqual(handoff("https://minhhuunguyen.github.io/blog/x#h").replaced, []);
  const blocked = handoff("https://minhhuunguyen.github.io/blog/x?giscus=abc", { storageThrows: true });
  assert.equal(blocked.store.size, 0);
  assert.deepEqual(blocked.replaced, ["/blog/x"]);
});
