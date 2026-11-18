import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("build-data --offline trên fixture ghi đủ 3 đầu ra hợp lệ", () => {
  const pub = fs.mkdtempSync(path.join(os.tmpdir(), "pub-"));
  const gen = fs.mkdtempSync(path.join(os.tmpdir(), "gen-"));
  const out = execFileSync("node", ["scripts/build-data.mjs", "--offline", "--posts-root", "scripts/fixtures/posts", "--public-dir", pub, "--generated-dir", gen], { encoding: "utf8" });
  assert.match(out, /\[search\] \d+ docs/);
  const idx = JSON.parse(fs.readFileSync(path.join(pub, "search-index.json"), "utf8"));
  assert.equal(idx.version, 1);
  assert.ok(Array.isArray(idx.suggestions));
  const sitemap = fs.readFileSync(path.join(pub, "sitemap.xml"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/minhhuunguyen\.github\.io\/learn\/python-co-ban<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/minhhuunguyen\.github\.io\/videos<\/loc>/);
  assert.doesNotMatch(sitemap, /styleguide/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(gen, "video-meta.json"), "utf8")), {});
});
