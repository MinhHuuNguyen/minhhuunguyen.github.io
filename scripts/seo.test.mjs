import test from "node:test";
import assert from "node:assert/strict";
import { blogPostingLd, normalizeText, sitemapXml, slugify, toIsoDate, toPostVideo, videoObjectLd } from "../src/lib/seo.mjs";

const VIDEO = {
  youtube_id: "AbCdEfGhIjK",
  name: "Âm thanh máy tính",
  description: "Bài giảng về âm thanh máy tính",
  upload_date: "2026-11-20T13:00:00Z",
  duration: "PT31M4S",
  thumbnail_url: "https://i.ytimg.com/vi/AbCdEfGhIjK/maxresdefault.jpg",
  clips: [{ name: "Mở đầu", start: 0, end: 65 }, { name: "Lấy mẫu", start: 65 }],
};

test("slugify keeps the rule the site always used", () => {
  assert.equal(slugify("Âm thanh máy tính Computer Audition"), "am-thanh-may-tinh-computer-audition");
  assert.equal(slugify("Đường dẫn: A/B"), "duong-dan-ab");
  assert.equal(slugify("  nhiều   khoảng   trắng "), "-nhieu-khoang-trang-");
  assert.equal(slugify(""), "");
  assert.equal(slugify(undefined), "");
});

test("normalizeText strips diacritics and maps đ", () => {
  assert.equal(normalizeText("Công nghệ Đà Nẵng"), "cong nghe da nang");
  assert.equal(normalizeText(""), "");
});

test("toIsoDate reads the posts' MM/DD/YYYY and ISO strings", () => {
  assert.equal(toIsoDate("05/13/2022"), "2022-05-13");
  assert.equal(toIsoDate("2026-11-20T13:00:00Z"), "2026-11-20");
  assert.equal(toIsoDate(new Date("2026-11-20T13:00:00Z")), "2026-11-20");
  assert.equal(toIsoDate("hôm qua"), null);
  assert.equal(toIsoDate(undefined), null);
});

test("toPostVideo accepts a good video and refuses a broken one", () => {
  assert.equal(toPostVideo({ ...VIDEO, youtube_id: "x" }), null);
  assert.equal(toPostVideo({ ...VIDEO, duration: "31 phút" }), null);
  assert.equal(toPostVideo({ ...VIDEO, clips: [{ name: "a", start: -1 }] }), null);
  assert.equal(toPostVideo({ ...VIDEO, clips: [{ name: "a", start: 10, end: 5 }] }), null);
  assert.equal(toPostVideo({ ...VIDEO, shorts: [{ tiktok_url: "http://evil.example/x" }] }), null);
  assert.equal(toPostVideo(null), null);
  const good = toPostVideo({ ...VIDEO, upload_date: new Date("2026-11-20T13:00:00Z") });
  assert.equal(good.upload_date, "2026-11-20T13:00:00.000Z");
  assert.deepEqual(good.shorts, []);
  assert.deepEqual(good.clips[1], { name: "Lấy mẫu", start: 65 });
});

test("videoObjectLd describes the embed and its clips", () => {
  const ld = videoObjectLd(toPostVideo(VIDEO), "https://minhhuunguyen.github.io/blog/x");
  assert.equal(ld["@type"], "VideoObject");
  assert.equal(ld.embedUrl, "https://www.youtube.com/embed/AbCdEfGhIjK");
  assert.equal(ld.uploadDate, "2026-11-20T13:00:00Z");
  assert.deepEqual(ld.hasPart[0], {
    "@type": "Clip", name: "Mở đầu", startOffset: 0, endOffset: 65, url: "https://www.youtube.com/watch?v=AbCdEfGhIjK&t=0s",
  });
  assert.deepEqual(ld.hasPart[1], {
    "@type": "Clip", name: "Lấy mẫu", startOffset: 65, url: "https://www.youtube.com/watch?v=AbCdEfGhIjK&t=65s",
  });
});

test("blogPostingLd carries the dates, the image and the author", () => {
  const ld = blogPostingLd({ title: "T", description: "D", time: "05/13/2022", banner_url: "https://b/x.png", tags: ["a", "b"] }, "https://u");
  assert.equal(ld["@type"], "BlogPosting");
  assert.equal(ld.datePublished, "2022-05-13");
  assert.deepEqual(ld.image, ["https://b/x.png"]);
  assert.equal(ld.keywords, "a, b");
  assert.equal(ld.author.name, "Nguyen Huu Minh");
  assert.equal(blogPostingLd({ title: "T", description: "D" }, "https://u").datePublished, undefined);
});

test("sitemapXml escapes and lists lastmod", () => {
  const xml = sitemapXml([{ loc: "https://a/" }, { loc: "https://a/b?x=1&y=2", lastmod: "2026-11-20" }]);
  assert.match(xml, /<loc>https:\/\/a\/<\/loc><\/url>/);
  assert.match(xml, /<loc>https:\/\/a\/b\?x=1&amp;y=2<\/loc><lastmod>2026-11-20<\/lastmod>/);
  assert.equal((xml.match(/<url>/g) || []).length, 2);
});
