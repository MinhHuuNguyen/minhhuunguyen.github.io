import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readEnPosts } from "../src/lib/posts-en-reader.mjs";
import { bodyHash } from "../src/lib/translation-check.mjs";
const vi = [{ slug: "vong-lap-trong-python", relPath: "ai/1_python/markdown/4-loop.md", title: "Vòng lặp trong Python", time: "01/01/2022",
  banner_url: "b.jpg", tags: ["python"], isHighlight: false, video: null, content: "## Vòng for\nNội dung." }];
const write = (files) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "en-"));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  }
  return root;
};
const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n")}\n---\n`;
test("ghép cặp, kế thừa trường từ bài VI, slug EN từ tiêu đề EN, phát hiện bản cũ", () => {
  const root = write({ "ai/1_python/markdown/4-loop.md": fm({ title: "Loops in Python", description: "d", source_path: "ai/1_python/markdown/4-loop.md",
    source_slug: "vong-lap-trong-python", source_hash: bodyHash("## Vòng for\nNội dung cũ."), translated_at: "2026-11-25" }) + "## The for loop\nBody." });
  const { enPosts, pairs, errors } = readEnPosts([root], vi);
  assert.deepEqual(errors, []);
  assert.equal(enPosts[0].slug, "loops-in-python");
  assert.equal(enPosts[0].viSlug, "vong-lap-trong-python");
  assert.equal(enPosts[0].banner_url, "b.jpg");
  assert.deepEqual(enPosts[0].tags, ["python"]);
  assert.equal(enPosts[0].stale, true);
  assert.deepEqual(pairs, { viToEn: { "vong-lap-trong-python": "loops-in-python" }, enToVi: { "loops-in-python": "vong-lap-trong-python" } });
});
test("bản EN khớp hash thì không cũ; gốc không tồn tại được bỏ qua", () => {
  const root = write({ "ai/1_python/markdown/4-loop.md": fm({ title: "Loops in Python", description: "d", source_path: "ai/1_python/markdown/4-loop.md",
    source_slug: "vong-lap-trong-python", source_hash: bodyHash(vi[0].content), translated_at: "2026-11-25" }) + "Body." });
  const { enPosts, errors } = readEnPosts(["/khong/ton/tai", root], vi);
  assert.deepEqual(errors, []);
  assert.equal(enPosts.length, 1);
  assert.equal(enPosts[0].stale, false);
});
test("source_path sai và trùng slug EN là lỗi", () => {
  const root = write({
    "a.md": fm({ title: "Same", description: "d", source_path: "khong/co.md", source_slug: "x", source_hash: "a".repeat(64), translated_at: "2026-11-25" }),
    "ai/1_python/markdown/4-loop.md": fm({ title: "Same", description: "d", source_path: "ai/1_python/markdown/4-loop.md", source_slug: "vong-lap-trong-python", source_hash: "a".repeat(64), translated_at: "2026-11-25" }),
  });
  const { errors } = readEnPosts([root], vi);
  assert.match(errors.join("\n"), /source_path "khong\/co\.md" không trỏ tới bài VI đang publish/);
});
