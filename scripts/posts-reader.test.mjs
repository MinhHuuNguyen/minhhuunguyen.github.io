import test from "node:test";
import assert from "node:assert/strict";
import { readAllPosts } from "../src/lib/posts-reader.mjs";

test("readAllPosts đọc fixture, chỉ bài publish, có readingMinutes và video hợp lệ", () => {
  const posts = readAllPosts("scripts/fixtures/posts", "test/fixtures/posts");
  assert.ok(posts.length >= 3);
  assert.ok(posts.every((p) => p.slug && p.readingMinutes >= 1));
  const fx = posts.find((p) => p.slug === "contract-fixture-video-post");
  assert.equal(fx.video.youtube_id, "AbCdEfGhIjK");
});

test("không truyền extraRoot thì không có bài fixture hợp đồng", () => {
  assert.equal(readAllPosts("scripts/fixtures/posts", undefined).some((p) => p.slug === "contract-fixture-video-post"), false);
});
