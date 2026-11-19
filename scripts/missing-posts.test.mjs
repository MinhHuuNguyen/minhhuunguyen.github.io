import test from "node:test";
import assert from "node:assert/strict";
import { missingPostSlugs } from "../src/lib/missing-posts.mjs";
import { getSiteData } from "../src/lib/site-data.mjs";

test("missingPostSlugs: link markdown, tuyệt đối, href HTML, có hash; slug có thật không tính; trùng gộp một", () => {
  const vi = [
    { slug: "co-that", content: "[a](/blog/chua-co-1#muc) [b](https://minhhuunguyen.github.io/blog/chua-co-2) <a href=\"/blog/chua-co-3?x=1\">c</a> [d](/blog/co-that)" },
    { slug: "khac", content: "[e](/blog/chua-co-1) [f](https://example.com/blog/ngoai) [g](/en/blog/chua-co-4)" },
  ];
  const en = [{ content: "[h](/blog/chua-co-5)" }];
  assert.deepEqual(missingPostSlugs(vi, en), ["chua-co-1", "chua-co-2", "chua-co-3", "chua-co-5"]);
});

test("getSiteData trên fixture trả missingSlugs là mảng", () => {
  const d = getSiteData({ postsRoot: "scripts/fixtures/posts", enRoot: "scripts/fixtures/posts-en-empty", projectsRoot: "scripts/fixtures/projects-empty", today: "2026-11-13" });
  assert.ok(Array.isArray(d.missingSlugs));
  assert.ok(d.missingSlugs.every((s) => !d.postBySlug(s)));
});
