import test from "node:test";
import assert from "node:assert/strict";
import { parseStat, formatDuration, formatDate } from "../src/lib/format.mjs";

test("parseStat", () => {
  assert.deepEqual(parseStat("7+"), { prefix: "", value: 7, suffix: "+" });
  assert.deepEqual(parseStat("83"), { prefix: "", value: 83, suffix: "" });
  assert.deepEqual(parseStat("~1.5k"), { prefix: "~", value: 1.5, suffix: "k" });
  assert.equal(parseStat("abc"), null);
});

test("formatDuration", () => {
  assert.equal(formatDuration("PT12M30S"), "12:30");
  assert.equal(formatDuration("PT1H2M3S"), "1:02:03");
  assert.equal(formatDuration("PT45S"), "0:45");
  assert.equal(formatDuration("bad"), null);
});

test("formatDate theo ngôn ngữ, nhận cả định dạng MM/DD/YYYY của bài", () => {
  assert.equal(formatDate("2026-11-20", "vi"), "20/11/2026");
  assert.equal(formatDate("2026-11-20", "en"), "Nov 20, 2026");
  assert.equal(formatDate("05/13/2022", "vi"), "13/05/2022");
  assert.equal(formatDate("xx", "vi"), null);
});
