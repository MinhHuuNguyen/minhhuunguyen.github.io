import test from "node:test";
import assert from "node:assert/strict";
import { getSiteData } from "../src/lib/site-data.mjs";

test("getSiteData trên fixture: đếm, lộ trình, nổi bật, props không chứa content", () => {
  const d = getSiteData({ postsRoot: "scripts/fixtures/posts", enRoot: "scripts/fixtures/posts-en-empty", projectsRoot: "scripts/fixtures/projects-empty", today: "2026-11-13" });
  assert.equal(d.counts.careerYears, 7);
  assert.equal(d.paths[0].slug, "python-co-ban");
  assert.ok(d.postsSummary.every((p) => !("content" in p)));
  assert.equal(d.featured.projects.length, 4);
  assert.ok(d.featured.projects.every((p) => p.href === null));
});
