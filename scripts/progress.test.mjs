import test from "node:test";
import assert from "node:assert/strict";
import { parseProgress, serializeProgress, setLesson, pathProgress, safeStorage } from "../src/lib/progress.mjs";

test("parseProgress chịu dữ liệu hỏng", () => {
  for (const raw of [null, "", "{", "[]", '{"version":2,"paths":{}}', '{"version":1,"paths":3}']) {
    assert.deepEqual(parseProgress(raw), { version: 1, paths: {} });
  }
});

test("setLesson bất biến, bỏ đánh dấu được, serialize vòng lại", () => {
  const p0 = parseProgress(null);
  const p1 = setLesson(p0, "python", "a", true, "2026-11-20T00:00:00.000Z");
  assert.deepEqual(p0.paths, {});
  assert.equal(p1.paths.python.a, "2026-11-20T00:00:00.000Z");
  assert.deepEqual(setLesson(p1, "python", "a", false, "x").paths.python, {});
  assert.deepEqual(parseProgress(serializeProgress(p1)), p1);
});

test("pathProgress chỉ đếm bài có sẵn", () => {
  const path = { slug: "python", lessons: [{ slug: "a", available: true }, { slug: "b", available: false }, { slug: "c", available: true }] };
  const p = setLesson(parseProgress(null), "python", "a", true, "t");
  assert.deepEqual(pathProgress(p, path), { done: 1, total: 2, percent: 50, complete: false });
});

test("storage ném lỗi thì safeStorage trả null (Review Focus 4)", () => {
  const blocked = { get localStorage() { throw new Error("SecurityError"); } };
  assert.equal(safeStorage("local", blocked), null);
  const broken = { localStorage: { setItem() { throw new Error("QuotaExceeded"); }, removeItem() {}, getItem() { return null; } } };
  assert.equal(safeStorage("local", broken), null);
});
