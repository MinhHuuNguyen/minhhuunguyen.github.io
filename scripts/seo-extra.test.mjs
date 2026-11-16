import test from "node:test";
import assert from "node:assert/strict";

test("videoListLd: ItemList các VideoObject có embedUrl", async () => {
  const { videoListLd } = await import("../src/lib/seo-extra.mjs");
  const ld = videoListLd([{ key: "youtube:AbCdEfGhIjK", title: { vi: "A", en: "A" }, description: null, thumbnail: "t", publishedAt: "2026-11-20", duration: "PT1M", embedUrl: "https://www.youtube.com/embed/AbCdEfGhIjK", url: "u" }], "https://minhhuunguyen.github.io/videos");
  assert.equal(ld["@type"], "ItemList");
  assert.equal(ld.itemListElement[0].item["@type"], "VideoObject");
  assert.equal(ld.itemListElement[0].item.embedUrl, "https://www.youtube.com/embed/AbCdEfGhIjK");
});

test("personLd: sameAs chỉ chứa kênh đã cấu hình", async () => {
  const { personLd } = await import("../src/lib/seo-extra.mjs");
  const ld = personLd({ person: { name: { vi: "Nguyễn Hữu Minh", en: "Nguyen Huu Minh" }, roles: { en: ["AI Engineer"] } },
    socials: { linkedin: "https://www.linkedin.com/in/minhhuunguyen/", github: "https://github.com/minhhuunguyen", facebook: null, youtube: null, tiktok: null } });
  assert.equal(ld["@type"], "Person");
  assert.equal(ld.name, "Nguyen Huu Minh");
  assert.equal(ld.url, "https://minhhuunguyen.github.io");
  assert.deepEqual(ld.sameAs, ["https://www.linkedin.com/in/minhhuunguyen/", "https://github.com/minhhuunguyen"]);
});
test("blogPostingLdEn: inLanguage en và trỏ về bài VI gốc", async () => {
  const { blogPostingLdEn } = await import("../src/lib/seo-extra.mjs");
  const post = { title: "Loops", description: "d", time: "01/01/2022", tags: ["python"] };
  const ld = blogPostingLdEn(post, "https://minhhuunguyen.github.io/en/blog/loops", "https://minhhuunguyen.github.io/blog/vong-lap");
  assert.equal(ld["@type"], "BlogPosting");
  assert.equal(ld.inLanguage, "en");
  assert.equal(ld.url, "https://minhhuunguyen.github.io/en/blog/loops");
  assert.equal(ld.translationOfWork.url, "https://minhhuunguyen.github.io/blog/vong-lap");
  assert.equal(ld.translationOfWork.inLanguage, "vi");
});
