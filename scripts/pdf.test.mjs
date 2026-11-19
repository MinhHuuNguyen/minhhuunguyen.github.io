import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("chỉ còn 2 file PDF cũ của CV, bản đầy đủ lớn hơn bản gọn", () => {
  for (const f of ["public/resume.pdf", "public/resume-full.pdf"]) {
    assert.ok(fs.statSync(f).size > 20_000, f);
  }
  assert.ok(fs.statSync("public/resume-full.pdf").size > fs.statSync("public/resume.pdf").size);
  assert.equal(fs.existsSync("public/resume-designed.pdf"), false);
});
