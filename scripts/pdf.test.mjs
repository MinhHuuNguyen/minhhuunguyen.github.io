import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const pages = (f) => (fs.readFileSync(f, "latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

test("3 file PDF tồn tại, bản ATS gọn ≤ 2 trang, bản đầy đủ dài hơn bản gọn", () => {
  for (const f of ["public/resume.pdf", "public/resume-full.pdf", "public/resume-designed.pdf"]) {
    assert.ok(fs.statSync(f).size > 20_000, f);
  }
  assert.ok(pages("public/resume.pdf") <= 2);
  assert.ok(fs.statSync("public/resume-full.pdf").size > fs.statSync("public/resume.pdf").size);
});
