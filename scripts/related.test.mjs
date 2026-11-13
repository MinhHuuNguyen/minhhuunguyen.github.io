import test from "node:test";
import assert from "node:assert/strict";
import { relatedPosts } from "../src/lib/related.mjs";

test("Jaccard tag (bỏ series) + 0.5 cùng lộ trình, hoà điểm thì bài mới trước, bỏ chính nó", () => {
  const all = [
    { slug: "a", tags: ["ml", "series"], time: "01/01/2022" },
    { slug: "b", tags: ["ml"], time: "01/01/2023" },
    { slug: "c", tags: ["ml"], time: "01/01/2024" },
    { slug: "d", tags: ["cv"], time: "01/01/2025" },
    { slug: "e", tags: [], time: "01/01/2021" },
  ];
  const pathOf = (s) => (s === "a" || s === "e" ? "p" : null);
  assert.deepEqual(relatedPosts(all[0], all, pathOf, 3), ["c", "b", "e"]);
});
