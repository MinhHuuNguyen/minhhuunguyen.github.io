import test from "node:test";
import assert from "node:assert/strict";

test("videoListLd: ItemList các VideoObject có embedUrl", async () => {
  const { videoListLd } = await import("../src/lib/seo-extra.mjs");
  const ld = videoListLd([{ key: "youtube:AbCdEfGhIjK", title: { vi: "A", en: "A" }, description: null, thumbnail: "t", publishedAt: "2026-11-20", duration: "PT1M", embedUrl: "https://www.youtube.com/embed/AbCdEfGhIjK", url: "u" }], "https://minhhuunguyen.github.io/videos");
  assert.equal(ld["@type"], "ItemList");
  assert.equal(ld.itemListElement[0].item["@type"], "VideoObject");
  assert.equal(ld.itemListElement[0].item.embedUrl, "https://www.youtube.com/embed/AbCdEfGhIjK");
});
