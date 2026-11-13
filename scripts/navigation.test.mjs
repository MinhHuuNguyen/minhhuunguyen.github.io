import test from "node:test";
import assert from "node:assert/strict";
import { isAdRoute, shouldHardNavigate } from "../src/lib/navigation.mjs";

test("isAdRoute chỉ đúng với trang bài", () => {
  assert.equal(isAdRoute("/blog/mo-hinh-transformer"), true);
  assert.equal(isAdRoute("/blog/mo-hinh-transformer/"), true);
  assert.equal(isAdRoute("/blog"), false);
  assert.equal(isAdRoute("/blog/"), false);
  assert.equal(isAdRoute("/learn/python"), false);
});

test("shouldHardNavigate khi đi vào hoặc ra khỏi trang có quảng cáo", () => {
  const cases = [
    ["/", "/blog/abc", true, true],
    ["/blog/abc", "/", true, true],
    ["/blog/abc", "/blog/xyz", true, true],
    ["/blog/abc", "/blog/abc#h-gioi-thieu", true, false],
    ["/blog/abc", "#h-gioi-thieu", true, false],
    ["/learn", "/videos", true, false],
    ["/blog", "/blog/abc", true, true],
    ["/blog/abc", "https://www.youtube.com/watch?v=x", true, false],
    ["/", "/blog/abc", false, false],
  ];
  for (const [cur, href, live, want] of cases) {
    assert.equal(shouldHardNavigate(cur, href, live), want, `${cur} -> ${href} (live=${live})`);
  }
});
