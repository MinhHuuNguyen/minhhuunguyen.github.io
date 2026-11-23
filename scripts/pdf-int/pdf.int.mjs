// Test tích hợp PDF bài viết: cần Chromium (Puppeteer) và mạng (ảnh bài). Không nằm trong `yarn test` (chạy trước build trên CI).
// Chạy: yarn test:pdf
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { getSiteData } from "../../src/lib/site-data.mjs";
import { main } from "../build-pdfs.mjs";

const OUT = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-int-out-"));
const CACHE = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-int-cache-"));
const data = getSiteData();
// Bài dài nhiều công thức + bảng (VI) và bản EN của nó.
const VI = "mo-hinh-hoi-quy-tuyen-tinh-linear-regression";
const EN = data.postPairs.viToEn[VI];

/** URL dài bị ngắt dòng trên bìa: bỏ xuống dòng trước khi so. */
const flat = (t) => t.replace(/\n/g, "");

async function readPdf(file) {
  const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(file)), useSystemFonts: false, isEvalSupported: false }).promise;
  const pages = [];
  const items = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const c = await (await doc.getPage(i)).getTextContent();
    // pdfjs tách mảnh tại chỗ đổi subset font (glyph tiếng Việt ở file font riêng): ghép liền, xuống dòng theo hasEOL.
    items.push(c.items.map((it) => it.str.trim()).filter(Boolean));
    pages.push(c.items.map((it) => it.str + (it.hasEOL ? "\n" : "")).join(""));
  }
  return { doc, pages, items, outline: (await doc.getOutline()) ?? [] };
}

test.after(() => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.rmSync(CACHE, { recursive: true, force: true });
});

test("tạo PDF VI: A4 nhiều trang, text trích được, có bìa + QR URL + mục lục + outline + số trang", { timeout: 240_000 }, async () => {
  await main(["--slug", VI, "--lang", "vi", "--out", OUT, "--cache", CACHE]);
  assert.notEqual(process.exitCode, 1);
  const file = path.join(OUT, "pdf", `${VI}.pdf`);
  assert.equal(fs.readFileSync(file).subarray(0, 5).toString("latin1"), "%PDF-");
  const { doc, pages, items, outline } = await readPdf(file);
  assert.ok(doc.numPages > 3, `chỉ có ${doc.numPages} trang`);
  const vp = (await doc.getPage(1)).getViewport({ scale: 1 });
  assert.ok(Math.abs(vp.width - 595.3) < 2 && Math.abs(vp.height - 841.9) < 2, `khổ ${vp.width}x${vp.height} không phải A4`);
  const post = data.postBySlug(VI);
  assert.ok(pages[0].includes("Mô hình hồi quy tuyến tính"), "bìa có tiêu đề (tiếng Việt có dấu)");
  assert.ok(flat(pages[0]).includes(`minhhuunguyen.github.io/blog/${VI}`), "bìa có URL bài gốc");
  assert.ok(!items[0].includes("1"), "bìa không có số trang");
  assert.ok(pages[1].includes("Mục lục"));
  assert.ok(items[1].includes("2") && items[2].includes("3"), "trang 2, 3 có số trang ở footer");
  const count = (nodes) => nodes.reduce((n, o) => n + 1 + count(o.items ?? []), 0);
  assert.ok(count(outline) >= 5, "có bookmark/outline");
  assert.ok(pages.join(" ").normalize("NFC") === pages.join(" "), "text tiếng Việt ở dạng NFC (dấu không tách)");
  assert.ok(post.title.length > 0);
});

test("tạo PDF EN và cache: lần 2 không render lại", { timeout: 240_000 }, async () => {
  assert.ok(EN, "bài mẫu có bản EN");
  await main(["--slug", EN, "--lang", "en", "--out", OUT, "--cache", CACHE]);
  const file = path.join(OUT, "pdf", "en", `${EN}.pdf`);
  const { pages } = await readPdf(file);
  assert.ok(flat(pages[0]).includes(`minhhuunguyen.github.io/en/blog/${EN}`));
  assert.ok(pages[1].includes("Contents"));
  const before = fs.statSync(file).mtimeMs;
  const logs = [];
  const orig = console.log;
  console.log = (...a) => logs.push(a.join(" "));
  try {
    await main(["--slug", EN, "--lang", "en", "--out", OUT, "--cache", CACHE]);
  } finally {
    console.log = orig;
  }
  assert.ok(logs.some((l) => /1 từ cache, 0 cần render/.test(l)), logs.join("\n"));
  assert.ok(fs.statSync(file).mtimeMs >= before);
});
