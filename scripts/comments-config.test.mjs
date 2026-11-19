import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readCommentsConfig, COMMENTS_CONFIG_FILE } from "../src/lib/comments-config.mjs";
import { readAllPosts } from "../src/lib/posts-reader.mjs";
import { commentsKey } from "../src/lib/comments.mjs";

test("comments.json của site hợp lệ, loại trang My GitHub Stats, đúng repo, category, template", () => {
  const c = readCommentsConfig(COMMENTS_CONFIG_FILE);
  assert.equal(typeof c.enabled, "boolean"); // không ép true: "enabled": false là cách tắt hợp lệ, CI vẫn phải xanh
  assert.equal(c.repo, "MinhHuuNguyen/minhhuunguyen.github.io");
  assert.equal(c.category, "Blog comments");
  assert.deepEqual(c.exclude, ["minhhuunguyen/README.md"]);
  assert.equal(c.report.template, "bao-loi-bai.yml");
});

test("fixture e2e có id giả để giscus được nạp", () => {
  const c = readCommentsConfig("test/fixtures/comments.json");
  assert.equal(c.repoId, "R_test_repo");
  assert.equal(c.categoryId, "DIC_test_category");
});

test("readCommentsConfig: file sai thì ném lỗi nêu tên file và từng lỗi", () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "comments-")), "bad.json");
  fs.writeFileSync(f, JSON.stringify({ enabled: true }));
  assert.throws(() => readCommentsConfig(f), (e) => e.message.startsWith(`[comments] ${f} sai:`) && e.message.includes('repo phải có dạng "owner/name"'));
});

test("readCommentsConfig: biến COMMENTS_CONFIG đổi file mặc định", () => {
  process.env.COMMENTS_CONFIG = "test/fixtures/comments.json";
  try {
    assert.equal(readCommentsConfig().repoId, "R_test_repo");
  } finally {
    delete process.env.COMMENTS_CONFIG;
  }
});

test("posts-reader: đọc comments_key từ frontmatter; hai bài cùng khóa thì dừng", () => {
  assert.throws(() => readAllPosts("test/fixtures/comments-dup", ""), /khóa bình luận trùng "a\.md": a\.md và b\.md/);
});

test("posts-reader: bài thật có khóa riêng, khóa là đường dẫn file", () => {
  const posts = readAllPosts("posts", "");
  assert.equal(new Set(posts.map(commentsKey)).size, posts.length);
  const loop = posts.find((p) => p.relPath === "ai-lectures/1_python_basic/markdown/4-loop.md");
  assert.equal(loop.commentsKey, null);
  assert.equal(commentsKey(loop), "ai-lectures/1_python_basic/markdown/4-loop.md");
});
