import test from "node:test";
import assert from "node:assert/strict";
import { renderPost, renderMarkdown } from "../src/lib/render.mjs";

const MD = "Mở đầu ngắn.\n\n## Giới thiệu\nĐoạn một.\n\n```python\nprint(1)\n```\n\n## Giới thiệu\nTrùng tiêu đề.\n\n### Chi tiết\n$$\na^2 + b^2 = c^2\n$$\n";

const BLOCK = `Đoạn mở đầu.

<!-- publish:video:begin x -->
## Video bài giảng

<iframe width="100%" height="480" src="https://www.youtube.com/embed/AbCdEfGhIjK" title="Âm thanh máy tính" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

**Mốc thời gian**

- [00:00](https://www.youtube.com/watch?v=AbCdEfGhIjK&t=0s) Mở đầu
<!-- publish:video:end x -->

## Phần tiếp theo
Nội dung.
`;

test("chia section tại h2 cấp cao nhất, id duy nhất có tiền tố h-", () => {
  const r = renderPost(MD);
  assert.equal(r.sections.length, 3);
  assert.deepEqual(r.toc.map((t) => [t.id, t.level]), [["h-gioi-thieu", 2], ["h-gioi-thieu-2", 2], ["h-chi-tiet", 3]]);
  assert.match(r.sections[1].html, /<h2 id="h-gioi-thieu">Giới thiệu<\/h2>/);
  assert.equal(r.sections[1].last, "code");
  assert.equal(r.sections[2].last, "math");
});

test("bài không có h2 là một section, mục lục rỗng", () => {
  const r = renderPost("Chỉ một đoạn.\n");
  assert.equal(r.sections.length, 1);
  assert.deepEqual(r.toc, []);
});

test("K5: khối video nằm trọn một section, iframe có enablejsapi và lazy", () => {
  const r = renderPost(BLOCK);
  const s = r.sections.find((x) => x.html.includes("youtube.com/embed/AbCdEfGhIjK"));
  assert.ok(s.html.includes('src="https://www.youtube.com/embed/AbCdEfGhIjK?enablejsapi=1"'));
  assert.ok(s.html.includes('loading="lazy"'));
  assert.ok(s.html.includes("Mốc thời gian"));
  assert.equal(s.first, "media");
  assert.equal(s.hasMedia, true);
});

test("renderMarkdown bằng nối các section", () => {
  assert.equal(renderMarkdown(MD), renderPost(MD).sections.map((s) => s.html).join(""));
});

test("đếm từ chỉ tính chữ inline, bỏ code", () => {
  assert.equal(renderPost("## A\nmột hai ba\n\n```\nx y z\n```\n").words, 4);
});
