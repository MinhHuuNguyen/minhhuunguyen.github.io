import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown } from "../src/lib/render.mjs";

// The block the publish pipeline writes into a post (publish_pipeline/publish/platforms/website.py, render_block).
const BLOCK = `<!-- publish:video:begin x -->
## Video bài giảng

<iframe width="100%" height="480" src="https://www.youtube.com/embed/AbCdEfGhIjK" title="Âm thanh máy tính" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

**Mốc thời gian**

- [00:00](https://www.youtube.com/watch?v=AbCdEfGhIjK&t=0s) Mở đầu
<!-- publish:video:end x -->
`;

test("the YouTube iframe of the publish block keeps its attributes through the sanitizer", () => {
  const html = renderMarkdown(BLOCK);
  assert.match(html, /<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/AbCdEfGhIjK"/);
  for (const attr of ['width="100%"', 'height="480"', 'title="Âm thanh máy tính"', "allowfullscreen", 'referrerpolicy="strict-origin-when-cross-origin"']) {
    assert.ok(html.includes(attr), `lost ${attr}: ${html}`);
  }
  assert.match(html, /allow="accelerometer; autoplay;/);
  assert.match(html, /<a href="https:\/\/www\.youtube\.com\/watch\?v=AbCdEfGhIjK&amp;t=0s">00:00<\/a>/);
});

test("an iframe that is not a YouTube embed is dropped", () => {
  const html = renderMarkdown('<iframe src="https://evil.example/x"></iframe>\n\ntext\n');
  assert.ok(!html.includes("iframe"), html);
  assert.ok(html.includes("text"));
});

test("a script and an event handler are stripped", () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n');
  assert.ok(!html.includes("<script") && !html.includes("onerror"), html);
});
