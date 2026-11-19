import test from "node:test";
import assert from "node:assert/strict";
import { readPosts } from "./site-posts.mjs";

test("site-posts.readPosts giữ đúng định dạng cũ (cho print-slugs)", () => {
  const p = readPosts("scripts/fixtures/posts")[0];
  assert.deepEqual(Object.keys(p).sort(), ["file", "slug", "time", "title"]);
});
