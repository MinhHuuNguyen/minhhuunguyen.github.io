import test from "node:test";
import assert from "node:assert/strict";
import { rewritePostLinks } from "../src/lib/links.mjs";
test("đổi link bài VI có bản EN, giữ hash; bài chưa dịch và link ngoài giữ nguyên", () => {
  const html = '<a href="/blog/vong-lap">x</a> <a href="/blog/ham#h-tham-so">y</a> <a href="/blog/chua-dich">z</a> <a href="https://e.com/blog/vong-lap">w</a>';
  assert.equal(rewritePostLinks(html, { "vong-lap": "loops", "ham": "functions" }),
    '<a href="/en/blog/loops">x</a> <a href="/en/blog/functions#h-tham-so">y</a> <a href="/blog/chua-dich">z</a> <a href="https://e.com/blog/vong-lap">w</a>');
});
