import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const OUT = process.env.CONTRACT_OUT;
const html = () => fs.readFileSync(`${OUT}/blog/contract-fixture-video-post.html`, "utf8");

test("K4: trang có chuỗi youtube.com/embed/<id> mà check_page tìm", { skip: !OUT }, () => {
  assert.ok(html().includes("youtube.com/embed/AbCdEfGhIjK"));
});

test("K3: JSON-LD VideoObject có embedUrl đúng", { skip: !OUT }, () => {
  const blocks = [...html().matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
  const v = blocks.find((b) => b["@type"] === "VideoObject");
  assert.equal(v.embedUrl, "https://www.youtube.com/embed/AbCdEfGhIjK");
});
