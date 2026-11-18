import test from "node:test";
import assert from "node:assert/strict";
import { localeOf, localizePath, counterpartUrl, hreflangLinks } from "../src/lib/locale-routes.mjs";

test("localeOf", () => {
  for (const p of ["/en", "/en/learn", "/en#lien-he"]) assert.equal(localeOf(p), "en", p);
  for (const p of ["/enx", "/learn", "/"]) assert.equal(localeOf(p), "vi", p);
});

test("localizePath", () => {
  assert.equal(localizePath("/learn/python", "en"), "/en/learn/python");
  assert.equal(localizePath("/", "en"), "/en");
  assert.equal(localizePath("/#lien-he", "en"), "/en#lien-he");
  assert.equal(localizePath("/en/videos", "vi"), "/videos");
  assert.equal(localizePath("/en", "vi"), "/");
});

test("counterpartUrl: bài viết đi theo cặp slug, thiếu cặp thì về danh sách blog", () => {
  const postPairs = { viToEn: { "vong-lap": "loops-in-python" }, enToVi: { "loops-in-python": "vong-lap" } };
  assert.equal(counterpartUrl("/blog/vong-lap", "en", { postPairs }), "/en/blog/loops-in-python");
  assert.equal(counterpartUrl("/blog/chua-dich", "en", { postPairs }), "/en/blog");
  assert.equal(counterpartUrl("/en/blog/loops-in-python", "vi", { postPairs }), "/blog/vong-lap");
  assert.equal(counterpartUrl("/en/learn/x", "vi"), "/learn/x");
  assert.equal(counterpartUrl("/styleguide", "en"), "/en");
  assert.equal(counterpartUrl("/projects/demo#a", "en"), "/en/projects/demo");
});

test("hreflangLinks: vi, en, x-default; không có bản en thì bỏ en", () => {
  assert.deepEqual(hreflangLinks("/learn", { enPath: "/en/learn" }), [
    { hrefLang: "vi", href: "https://minhhuunguyen.github.io/learn" },
    { hrefLang: "en", href: "https://minhhuunguyen.github.io/en/learn" },
    { hrefLang: "x-default", href: "https://minhhuunguyen.github.io/learn" },
  ]);
  assert.deepEqual(hreflangLinks("/blog/chua-dich", { enPath: null }).map((l) => l.hrefLang), ["vi", "x-default"]);
});
