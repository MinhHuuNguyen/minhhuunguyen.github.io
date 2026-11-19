// scripts/videos.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { tiktokIdFromUrl, validateManualVideos, collectVideos } from "../src/lib/videos.mjs";

const TT = "https://www.tiktok.com/@minh.ai/video/7234567890123456789";

test("tiktokIdFromUrl", () => {
  assert.equal(tiktokIdFromUrl(TT), "7234567890123456789");
  assert.equal(tiktokIdFromUrl(TT + "?lang=vi"), "7234567890123456789");
  assert.equal(tiktokIdFromUrl("https://vm.tiktok.com/abc"), null);
});

test("validateManualVideos báo lỗi theo từng mục", () => {
  const { items, errors } = validateManualVideos({ items: [
    { platform: "youtube", ref: "AbCdEfGhIjK", title: { vi: "A" }, published_at: "2026-11-20" },
    { platform: "vimeo", ref: "1", title: { vi: "B" }, published_at: "2026-11-20" },
    { platform: "youtube", ref: "short", title: { vi: "C" }, published_at: "2026-11-20" },
    { platform: "youtube", ref: "AbCdEfGhIjK", title: { vi: "D" }, published_at: "2026-11-21" },
    { platform: "tiktok", ref: TT, title: {}, published_at: "20/11/2026" },
  ] });
  assert.equal(items.length, 1);
  assert.deepEqual(errors, [
    "items[1].platform: phải là youtube | youtube_short | tiktok",
    "items[2].ref: youtube cần id 11 ký tự",
    "items[3]: trùng khoá youtube:AbCdEfGhIjK với items[0]",
    "items[4].title.vi: bắt buộc",
    "items[4].published_at: phải là YYYY-MM-DD",
  ]);
  assert.deepEqual(validateManualVideos({ items: "x" }).errors, ["items: phải là mảng"]);
});

test("collectVideos: dài + Short + TikTok từ bài, file tay ghi đè, sắp mới trước", () => {
  const post = { slug: "am-thanh", title: "Âm thanh máy tính", tags: ["audio", "series"], video: {
    youtube_id: "AbCdEfGhIjK", name: "Âm thanh", description: "mô tả", upload_date: "2026-11-20T05:00:00Z", duration: "PT12M30S",
    thumbnail_url: "https://i.ytimg.com/vi/AbCdEfGhIjK/maxresdefault.jpg", clips: [{ name: "Mở đầu", start: 0 }],
    shorts: [{ youtube_id: "ShOrT123456" }, { tiktok_url: TT }] } };
  const manual = [
    { platform: "youtube", ref: "AbCdEfGhIjK", title: { vi: "Tiêu đề sửa", en: "Edited" }, published_at: "2026-11-20", tags: ["dsp"] },
    { platform: "youtube", ref: "OlDvIdEo123", title: { vi: "Video cũ" }, published_at: "2025-01-01" },
  ];
  const v = collectVideos([post], manual, { "tiktok:7234567890123456789": { thumbnail: "/video-thumbs/tiktok/7234567890123456789.jpg" } });
  assert.deepEqual(v.map((x) => x.key), ["youtube:AbCdEfGhIjK", "youtube_short:ShOrT123456", "tiktok:7234567890123456789", "youtube:OlDvIdEo123"]);
  assert.deepEqual(v[0].title, { vi: "Tiêu đề sửa", en: "Edited" });
  assert.deepEqual(v[0].tags, ["audio", "dsp"]);
  assert.deepEqual(v[0].chapters, [{ name: "Mở đầu", start: 0 }]);
  assert.equal(v[0].embedUrl, "https://www.youtube.com/embed/AbCdEfGhIjK");
  assert.equal(v[1].url, "https://www.youtube.com/shorts/ShOrT123456");
  assert.equal(v[2].embedUrl, "https://www.tiktok.com/player/v1/7234567890123456789");
  assert.equal(v[2].thumbnail, "/video-thumbs/tiktok/7234567890123456789.jpg");
  assert.equal(v[3].thumbnail, "https://i.ytimg.com/vi/OlDvIdEo123/hqdefault.jpg");
  assert.equal(v[3].post, null);
  assert.deepEqual(v[0].post, { slug: "am-thanh", title: "Âm thanh máy tính" });
});
