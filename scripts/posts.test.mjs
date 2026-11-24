import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readPosts } from "./site-posts.mjs";

function postsTree(files) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "site-posts-"));
  const root = path.join(base, "posts");
  for (const [rel, text] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text, "utf8");
  }
  return root;
}

const md = (title, published = true) => `---\ntitle: "${title}"\nis_published: ${published}\ntime: 05/13/2022\n---\nbody\n`;

test("readPosts takes published posts, skips README.md and hidden folders, keeps the blog post my-github-stats.md", () => {
  const root = postsTree({
    "ai/markdown/1-a.md": md("Âm thanh máy tính"),
    "ai/markdown/2-draft.md": md("Chưa xong", false),
    "ai/README.md": md("Không lấy README này"),
    "minhhuunguyen/README.md": md("Không lấy README profile"),
    "minhhuunguyen/my-github-stats.md": md("Giới thiệu"),
    ".git/hooks/x.md": md("Trong thư mục ẩn"),
  });
  const slugs = readPosts(root).map((p) => p.slug).sort();
  assert.deepEqual(slugs, ["am-thanh-may-tinh", "gioi-thieu"]);
});

test("readPosts refuses two posts with the same slug", () => {
  const root = postsTree({ "a/1.md": md("Cùng tên"), "b/2.md": md("Cung ten") });
  assert.throws(() => readPosts(root), /slug trùng "cung-ten"/);
});

test("readPosts drops a post without a title (its slug would be empty)", () => {
  const root = postsTree({ "a/1.md": "---\nis_published: true\n---\nbody\n" });
  assert.deepEqual(readPosts(root), []);
});
