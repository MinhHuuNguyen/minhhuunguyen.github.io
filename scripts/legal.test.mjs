import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const CASES = [
  ["src/utils/data/legal.json", "Bình luận", "Website không có biểu mẫu đăng ký, không có tài khoản người dùng và không thu thập thông tin nhận dạng cá nhân nào khác."],
  ["src/utils/data/legal.en.json", "Comments", "The website has no sign-up form, no user accounts, and does not collect any other personally identifiable information."],
];

for (const [file, heading, oldSentence] of CASES) {
  test(`${file}: privacy và terms có mục ${heading}, nêu giscus, GitHub, giscus-session; bỏ câu cũ`, () => {
    const j = JSON.parse(fs.readFileSync(file, "utf8"));
    const section = j.privacy.sections.find((s) => s.heading === heading);
    assert.ok(section, "privacy thiếu mục bình luận");
    const text = section.paragraphs.join(" ");
    for (const w of ["giscus", "GitHub", "giscus-session"]) assert.ok(text.includes(w), `privacy thiếu "${w}"`);
    assert.ok(!JSON.stringify(j.privacy).includes(oldSentence), "privacy còn câu cũ");
    assert.ok(j.terms.sections.some((s) => s.heading === heading), "terms thiếu mục bình luận");
    for (const k of ["privacy", "terms"]) {
      assert.equal(j[k].draft, false);
      assert.match(j[k].updated, /^\d{4}-\d{2}-\d{2}$/);
    }
  });
}
