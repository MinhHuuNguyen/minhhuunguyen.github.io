import test from "node:test";
import assert from "node:assert/strict";
import { parseSeriesLessons, pathSlugOf, buildPaths, lessonNav } from "../src/lib/learn.mjs";

const SERIES = [
  "### [Bài 0: Cài đặt môi trường](/blog/cai-dat-moi-truong)", "mô tả",
  "### [Bài 1: Giới thiệu](/blog/gioi-thieu/)",
  "### [Bài 1: Giới thiệu](/blog/gioi-thieu)",
  "- [không phải heading](/blog/khong-tinh)",
  "#### [Bài 2: Kiểu dữ liệu](/blog/kieu-du-lieu)",
].join("\n");

const posts = [
  { slug: "series-python", title: "[SERIES] Python cơ bản", description: "d", banner_url: "b", time: "12/12/2021", tags: ["python", "series"], content: SERIES, filePath: "posts/ai-lectures/0_series/markdown/1-python-basic.md", readingMinutes: 3, video: null },
  { slug: "series-rong", title: "[SERIES] Rỗng", description: "", banner_url: "", time: "", tags: ["series"], content: "không có bài", filePath: "posts/ai-lectures/8_time_series/markdown/1-time-series.md", readingMinutes: 1, video: null },
  { slug: "cai-dat-moi-truong", title: "Cài đặt", tags: ["python"], content: "", filePath: "posts/a.md", readingMinutes: 5, video: null },
  { slug: "kieu-du-lieu", title: "Kiểu dữ liệu", tags: ["python"], content: "", filePath: "posts/b.md", readingMinutes: 7, video: { youtube_id: "AbCdEfGhIjK" } },
];

test("parseSeriesLessons lấy heading-link theo thứ tự, bỏ trùng, bỏ dòng list", () => {
  assert.deepEqual(parseSeriesLessons(SERIES).map((l) => [l.order, l.slug]), [[1, "cai-dat-moi-truong"], [2, "gioi-thieu"], [3, "kieu-du-lieu"]]);
});

test("pathSlugOf bỏ tiền tố series-", () => {
  assert.equal(pathSlugOf("series-ngon-ngu-lap-trinh-python-co-ban"), "ngon-ngu-lap-trinh-python-co-ban");
});

test("buildPaths: bài chưa publish không có link (Review Focus 2), lộ trình rỗng bị loại, bỏ [SERIES]", () => {
  const paths = buildPaths(posts);
  assert.equal(paths.length, 1);
  assert.equal(paths[0].slug, "python");
  assert.equal(paths[0].title, "Python cơ bản");
  assert.deepEqual(paths[0].lessons.map((l) => [l.slug, l.available]), [["cai-dat-moi-truong", true], ["gioi-thieu", false], ["kieu-du-lieu", true]]);
  assert.deepEqual(paths[0].stats, { total: 3, available: 2, minutes: 12, videos: 1 });
});

test("lessonNav bỏ qua bài chưa có", () => {
  const nav = lessonNav(buildPaths(posts), "cai-dat-moi-truong");
  assert.equal(nav.path.slug, "python");
  assert.equal(nav.prev, null);
  assert.equal(nav.next.slug, "kieu-du-lieu");
  assert.deepEqual([nav.position, nav.total], [1, 2]);
  assert.equal(lessonNav(buildPaths(posts), "khong-co"), null);
});
