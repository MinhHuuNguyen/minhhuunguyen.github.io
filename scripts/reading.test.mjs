import test from "node:test";
import assert from "node:assert/strict";
import { plainText, readingMinutes } from "../src/lib/reading.mjs";

test("plainText bỏ code, công thức, html, cú pháp link và nhấn mạnh", () => {
  const md = 'Xin **chào** [bạn](https://x.y)!\n\n```py\nx = 1\n```\n\n$$a+b$$ và $c$ <img src="a.png"> hết.';
  assert.equal(plainText(md), "Xin chào bạn! và hết.");
});

test("plainText cắt theo số từ", () => {
  assert.equal(plainText("một hai ba bốn", 2), "một hai");
});

test("readingMinutes: 200 từ/phút, làm tròn, tối thiểu 1", () => {
  assert.equal(readingMinutes("a"), 1);
  assert.equal(readingMinutes(Array(450).fill("từ").join(" ")), 2);
  assert.equal(readingMinutes(Array(6532).fill("w").join(" ")), 33);
});
