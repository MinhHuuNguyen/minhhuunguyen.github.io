import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { readCommentsConfig } from "../src/lib/comments-config.mjs";
import { reportUrl } from "../src/lib/comments.mjs";

test("giscus.json chỉ cho site thật và localhost nạp thread, thứ tự cũ → mới", () => {
  assert.deepEqual(JSON.parse(fs.readFileSync("giscus.json", "utf8")), {
    origins: ["https://minhhuunguyen.github.io"],
    originsRegex: ["http://localhost:[0-9]+"],
    defaultCommentOrder: "oldest",
  });
});

test("issue form báo lỗi: đúng tên file trong cấu hình, đủ id mà reportUrl điền sẵn, tự gắn nhãn", () => {
  const cfg = readCommentsConfig();
  const yml = fs.readFileSync(`.github/ISSUE_TEMPLATE/${cfg.report.template}`, "utf8");
  const ids = [...yml.matchAll(/^\s+id:\s*([a-z_]+)\s*$/gm)].map((m) => m[1]);
  assert.deepEqual(ids, ["page_url", "source_file", "problem", "suggestion"]);
  assert.match(yml, /^labels:\s*\["báo lỗi bài"\]\s*$/m);
  const keys = [...new URL(reportUrl(cfg, { locale: "vi", title: "t", pageUrl: "p", sourceFile: "s" })).searchParams.keys()];
  for (const k of keys.filter((k) => k !== "template" && k !== "title")) assert.ok(ids.includes(k), `issue form thiếu id ${k}`);
});
