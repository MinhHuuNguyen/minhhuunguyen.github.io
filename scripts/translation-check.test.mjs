// scripts/translation-check.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { checkPair, bodyHash, vietnameseRatio } from "../src/lib/translation-check.mjs";

const VI = '## Giới thiệu\nĐoạn văn.\n\n```python\n# in ra màn hình\nprint("xin chào")\n```\n\n$$a^2$$ và $b$\n\n![Hình 1](https://raw.githubusercontent.com/x/a.png)\n\n[Bài trước](/blog/bai-truoc)\n';
const FM = `---\ntitle: "Intro"\ndescription: "d"\nsource_path: ai/x.md\nsource_slug: x\nsource_hash: ${"a".repeat(64)}\ntranslated_at: 2026-11-25\n---\n`;
const EN = FM + '## Introduction\nA paragraph.\n\n```python\n# print to the screen\nprint("xin chào")\n```\n\n$$a^2$$ and $b$\n\n![Figure 1](https://raw.githubusercontent.com/x/a.png)\n\n[Previous lesson](/blog/bai-truoc)\n';

test("đúng cấu trúc: chú thích code được dịch, chuỗi trong code giữ nguyên -> không lỗi", () => {
  assert.deepEqual(checkPair(VI, EN).errors, []);
});

test("đổi code, mất ảnh, đổi link, thiếu công thức -> lỗi", () => {
  assert.match(checkPair(VI, EN.replace('print("xin chào")', 'print("hello")')).errors.join("\n"), /code block 1 khác bản gốc/);
  assert.match(checkPair(VI, EN.replace(/!\[Figure 1\]\([^)]*\)/, "")).errors.join("\n"), /ảnh/);
  assert.match(checkPair(VI, EN.replace("/blog/bai-truoc", "/en/blog/previous")).errors.join("\n"), /link/);
  assert.match(checkPair(VI, EN.replace("$$a^2$$", "a^2")).errors.join("\n"), /công thức/);
});

test("còn nhiều chữ tiếng Việt -> lỗi; tên riêng trong ALLOWLIST không tính", () => {
  assert.match(checkPair(VI, EN.replace("A paragraph.", "Đoạn văn này còn nguyên tiếng Việt chưa được dịch.")).errors.join("\n"), /còn chữ tiếng Việt/);
  assert.equal(vietnameseRatio("Written by Nguyễn Hữu Minh in Hà Nội.", ["Nguyễn", "Hữu", "Hà", "Nội"]).ratio, 0);
});

test("tiếng Việt cố ý trong <span lang=\"vi\"> không bị tính", () => {
  const sample = 'Tokenizing <span lang="vi">"Tôi đang học xử lý ngôn ngữ tự nhiên"</span> gives five words.';
  assert.equal(vietnameseRatio(sample).ratio, 0);
  assert.deepEqual(checkPair(VI, EN.replace("A paragraph.", sample)).errors, []);
});

test("có khối video của pipeline trong bản EN -> lỗi", () => {
  const withBlock = EN + "<!-- publish:video:begin x -->\n## Video\n<!-- publish:video:end x -->\n";
  assert.match(checkPair(VI, withBlock).errors.join("\n"), /publish:video/);
});

test("missingLogEntries: mục nhật ký phải có phần đề xuất và dòng Review bản dịch (Q28)", async () => {
  const { missingLogEntries } = await import("../src/lib/translation-check.mjs");
  const log = [
    "## B02 — ai-lectures/1_python_basic/markdown/4-loop.md",
    "Không có đề xuất.",
    "**Review bản dịch:** đạt.",
    "## B02 — ai-lectures/1_python_basic/markdown/5-function.md",
    "| 1 | Thấp | Chính tả | Mục 2 | \"hàmm\" | \"hàm\" |",
  ].join("\n");
  assert.deepEqual(missingLogEntries(log, [
    "ai-lectures/1_python_basic/markdown/4-loop.md",
    "ai-lectures/1_python_basic/markdown/5-function.md",
    "ai-lectures/1_python_basic/markdown/6-oop.md",
  ]), ["ai-lectures/1_python_basic/markdown/5-function.md", "ai-lectures/1_python_basic/markdown/6-oop.md"]);
});

test("bodyHash bỏ khối video pipeline (C28)", () => {
  assert.equal(bodyHash("A\n<!-- publish:video:begin x -->\nV\n<!-- publish:video:end x -->\nB"), bodyHash("A\nB"));
  assert.notEqual(bodyHash("A\nB"), bodyHash("A\nC"));
});
test("docstring trong code được dịch -> không lỗi", () => {
  const vi = '```python\ndef f():\n    """\n    Hàm in ra\n    """\n    print(1)\n```\n';
  const en = FM + '```python\ndef f():\n    """\n    Prints\n    """\n    print(1)\n```\n';
  assert.deepEqual(checkPair(vi, en).errors, []);
});
