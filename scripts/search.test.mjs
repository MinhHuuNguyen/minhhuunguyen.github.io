import test from "node:test";
import assert from "node:assert/strict";
import MiniSearch from "minisearch";
import { processTerm, miniSearchOptions, buildSearchDocs, PLAIN_TEXT_WORDS } from "../src/lib/search.mjs";

const posts = [
  { slug: "hoc-may-la-gi", title: "Học máy là gì?", description: "Giới thiệu học máy", tags: ["machine-learning"], content: "## Định nghĩa\nHọc máy " + "từ ".repeat(600), time: "05/13/2022" },
  { slug: "mang-no-ron", title: "Mạng nơ-ron nhân tạo", description: "Neural network", tags: ["deep-learning"], content: "", time: "01/01/2023" },
  { slug: "duong-cong-roc", title: "Đường cong ROC", description: "Đánh giá mô hình", tags: [], content: "", time: "01/01/2023" },
];
const docs = buildSearchDocs({ posts, paths: [], videos: [], projects: [], pages: [] });
const ms = new MiniSearch(miniSearchOptions());
ms.addAll(docs);

test("processTerm gập dấu, bỏ ký tự lạ, bỏ từ 1 ký tự", () => {
  assert.equal(processTerm("Học"), "hoc");
  assert.equal(processTerm("Đường"), "duong");
  assert.equal(processTerm("nơ-ron"), "noron");
  assert.equal(processTerm("AI"), "ai");
  assert.equal(processTerm("a"), null);
});

test("không dấu khớp có dấu (Review Focus 1)", () => {
  assert.equal(ms.search("hoc may")[0].id, "post:hoc-may-la-gi");
  assert.equal(ms.search("mang no ron")[0].id, "post:mang-no-ron");
  assert.equal(ms.search("duong cong roc")[0].id, "post:duong-cong-roc");
  assert.equal(ms.search("học máy")[0].id, "post:hoc-may-la-gi");
});

test("loadJSON cùng options cho cùng kết quả", () => {
  const again = MiniSearch.loadJSON(JSON.stringify(ms), miniSearchOptions());
  assert.deepEqual(again.search("hoc may").map((r) => r.id), ms.search("hoc may").map((r) => r.id));
});

test("doc bài: url, snippet ≤ 160 ký tự, text tối đa PLAIN_TEXT_WORDS từ + mô tả, có heading", () => {
  const d = docs.find((x) => x.id === "post:hoc-may-la-gi");
  assert.equal(d.url, "/blog/hoc-may-la-gi");
  assert.ok(d.snippet.length <= 160);
  assert.ok(d.text.split(/\s+/).length <= PLAIN_TEXT_WORDS + 10);
  assert.deepEqual(d.headings, ["Định nghĩa"]);
});
