// Test thuần logic cho tính năng PDF bài viết (không cần Chromium hay out/): chạy trong `yarn test`, trước build.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import QRCode from "qrcode";
import sharp from "sharp";
import { hasPdf, pdfHref, pdfFile, pdfHrefFor, eligiblePosts } from "../src/lib/pdf.mjs";
import { buildPrintHtml, esc, cssString, replaceMedia, eagerImages, absolutizeLinks, urlOf } from "./pdf/template.mjs";
import { sha256, loadManifest, saveManifest, hasFresh, store, restore, prune } from "./pdf/cache.mjs";
import { createImageProxy, shrink } from "./pdf/images.mjs";
import { parseArgs } from "./build-pdfs.mjs";

const POST = {
  slug: "bai-mau",
  title: "Bài mẫu",
  description: "Mô tả",
  time: "07/16/2022",
  tags: ["machine-learning"],
  readingMinutes: 4,
  banner_url: "https://raw.githubusercontent.com/x/y/banner.png",
  content: "Mở đầu.\n\n## Phần một\nĐoạn [link](/blog/vong-lap).\n\n### Chi tiết\n![hình](https://raw.githubusercontent.com/x/y/a.png)\n\n```python\nprint(1)\n```\n",
};

test("chọn bài có PDF: bỏ series và my-github-stats", () => {
  assert.equal(hasPdf({ slug: "a", tags: ["ml"] }), true);
  assert.equal(hasPdf({ slug: "series-x", tags: ["series"] }), false);
  assert.equal(hasPdf({ slug: "my-github-stats", tags: [] }), false);
  assert.equal(hasPdf({ slug: "" }), false);
  assert.equal(hasPdf(null), false);
  const data = {
    postsSummary: [{ slug: "a", tags: [] }, { slug: "s", tags: ["series"] }],
    postBySlug: (s) => ({ slug: s, content: "x" }),
    en: { posts: [{ slug: "a-en", tags: [] }, { slug: "s-en", tags: ["series"] }] },
  };
  assert.deepEqual(eligiblePosts(data).map((i) => `${i.locale}/${i.slug}`), ["vi/a", "en/a-en"]);
});

test("đường dẫn PDF theo ngôn ngữ", () => {
  assert.equal(pdfHref("a", "vi"), "/pdf/a.pdf");
  assert.equal(pdfHref("a", "en"), "/pdf/en/a.pdf");
  assert.equal(pdfFile("a", "en"), "pdf/en/a.pdf");
  assert.equal(pdfHrefFor({ slug: "s", tags: ["series"] }, "vi"), null);
  assert.equal(pdfHrefFor({ slug: "a", tags: [] }, "en"), "/pdf/en/a.pdf");
});

test("escape HTML và chuỗi CSS", () => {
  assert.equal(esc(`<a href="x">&'</a>`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
  const css = cssString(`a"}</style><script>\n\\`);
  assert.doesNotMatch(css, /["<>{}]|\n/);
  assert.ok(!css.includes("</style"));
});

test("iframe YouTube thành link, iframe khác bị bỏ, ảnh tải ngay, link nội bộ thành tuyệt đối", () => {
  const html = '<iframe src="https://www.youtube.com/embed/AbCdEfGhIjK?enablejsapi=1" loading="lazy"></iframe><iframe src="https://evil.example/x"></iframe>';
  const out = replaceMedia(html, "Video");
  assert.doesNotMatch(out, /<iframe/);
  assert.match(out, /href="https:\/\/www\.youtube\.com\/watch\?v=AbCdEfGhIjK"/);
  assert.doesNotMatch(out, /evil/);
  assert.equal(eagerImages('<img src="a.png" loading="lazy" alt="">'), '<img loading="eager" decoding="sync" src="a.png" alt="">');
  assert.equal(absolutizeLinks('<a href="/blog/x#h">'), '<a href="https://minhhuunguyen.github.io/blog/x#h">');
  assert.equal(absolutizeLinks('<a href="//cdn/x">'), '<a href="//cdn/x">');
});

test("HTML in: bìa, QR đúng URL, mục lục có anchor, nội dung độc hại bị escape", async () => {
  const evil = { ...POST, title: `<script>alert(1)</script>"`, description: "<img src=x onerror=alert(1)>", tags: ["<b>t</b>", "series"] };
  const html = await buildPrintHtml({ post: evil, locale: "vi" });
  assert.doesNotMatch(html, /<script>alert/);
  assert.doesNotMatch(html, /<img src=x onerror/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<li>series<\/li>/, "bỏ tag series");
  const url = urlOf("bai-mau", "vi");
  const qr = (await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M" })).replace(/<\?xml[^>]*\?>/, "");
  assert.ok(html.includes(qr), "QR mã hoá đúng URL bài gốc");
  assert.match(html, /<a href="#h-phan-mot">Phần một<\/a>/);
  assert.match(html, /<h2 id="h-phan-mot">/);
  assert.match(html, /href="https:\/\/minhhuunguyen\.github\.io\/blog\/vong-lap"/);
  assert.match(html, /<img loading="eager"[^>]*a\.png/);
  assert.match(html, /@page :first \{ margin: 0;/);
  assert.match(html, /<html lang="vi">/);
});

test("HTML in bản EN: URL /en, đổi link bài đã dịch, video thành link", async () => {
  const html = await buildPrintHtml({
    post: { ...POST, slug: "sample", video: { youtube_id: "AbCdEfGhIjK" } },
    locale: "en",
    viToEn: { "vong-lap": "loops-in-python" },
  });
  assert.match(html, /https:\/\/minhhuunguyen\.github\.io\/en\/blog\/sample/);
  assert.match(html, /href="https:\/\/minhhuunguyen\.github\.io\/en\/blog\/loops-in-python"/);
  assert.match(html, /watch\?v=AbCdEfGhIjK/);
  assert.match(html, /<html lang="en">/);
});

test("HTML in hợp lệ khi bài thiếu banner, mô tả, tag, mục lục", async () => {
  const html = await buildPrintHtml({ post: { slug: "x", title: "X", content: "Chỉ một đoạn.", time: "99/99/2022" }, locale: "en" });
  assert.match(html, /class="cover-band"/);
  assert.doesNotMatch(html, /class="cover-desc"|class="cover-tags"|class="toc"/);
});

test("cache: chỉ dùng lại khi đúng hash và file là PDF; prune bỏ bài không còn", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pdfcache-"));
  const src = path.join(dir, "src.pdf");
  fs.writeFileSync(src, Buffer.concat([Buffer.from("%PDF-1.7\n"), Buffer.alloc(2048)]));
  const m = {};
  store(dir, "vi/a", src);
  m["vi/a"] = sha256("h1");
  saveManifest(dir, m);
  const loaded = loadManifest(dir);
  assert.equal(hasFresh(dir, loaded, "vi/a", sha256("h1")), true);
  assert.equal(hasFresh(dir, loaded, "vi/a", sha256("h2")), false, "nội dung đổi thì render lại");
  assert.equal(hasFresh(dir, loaded, "vi/b", sha256("h1")), false);
  const dest = path.join(dir, "out/pdf/a.pdf");
  restore(dir, "vi/a", dest);
  assert.equal(fs.readFileSync(dest, "latin1").slice(0, 5), "%PDF-");
  fs.writeFileSync(path.join(dir, "vi/a.pdf"), "rác");
  assert.equal(hasFresh(dir, loaded, "vi/a", sha256("h1")), false, "file hỏng thì không dùng");
  assert.equal(prune(dir, loaded, ["vi/z"]), 1);
  assert.deepEqual(loaded, {});
  assert.deepEqual(loadManifest(path.join(dir, "khong-co")), {});
  fs.rmSync(dir, { recursive: true, force: true });
});

test("proxy ảnh: 404 là ảnh chết (không thử lại), lỗi tạm thời thì thử lại, gộp request trùng", async () => {
  const png = await sharp({ create: { width: 3000, height: 1000, channels: 3, background: "#09f" } }).png().toBuffer();
  const calls = {};
  const fetchImpl = async (url) => {
    calls[url] = (calls[url] ?? 0) + 1;
    if (url.endsWith("dead")) return new Response("", { status: 404 });
    if (url.endsWith("flaky") && calls[url] < 2) return new Response("", { status: 503 });
    if (url.endsWith("down")) throw new Error("ECONNRESET");
    return new Response(png, { status: 200, headers: { "content-type": "image/png" } });
  };
  const p = createImageProxy({ retries: 3, fetchImpl });
  const [a, b] = await Promise.all([p.get("u/ok"), p.get("u/ok")]);
  assert.equal(calls["u/ok"], 1, "gộp request trùng");
  assert.equal(a, b);
  assert.equal(a.status, 200);
  assert.equal((await sharp(a.body).metadata()).width, 1500, "ảnh lớn được thu nhỏ");
  const dead = await p.get("u/dead");
  assert.equal(dead.status, 404);
  assert.equal(calls["u/dead"], 1);
  assert.ok(!dead.transient);
  assert.equal((await p.get("u/flaky")).status, 200);
  assert.equal(calls["u/flaky"], 2);
  const down = await p.get("u/down");
  assert.equal(down.transient, true);
  assert.equal(calls["u/down"], 3);
});

test("shrink giữ nguyên SVG và dữ liệu không phải ảnh", async () => {
  const svg = Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>");
  assert.equal((await shrink(svg, "image/svg+xml")).body, svg);
  const junk = Buffer.from("không phải ảnh");
  assert.equal((await shrink(junk, "image/png")).body, junk);
});

test("tham số dòng lệnh", () => {
  assert.deepEqual(parseArgs(["--slug", "a", "--lang", "en", "--concurrency", "4"]), { slug: "a", lang: "en", out: "out", cache: ".pdf-cache", concurrency: 4, noCache: false });
  assert.throws(() => parseArgs(["--lang", "fr"]));
  assert.throws(() => parseArgs(["--bogus"]));
});
