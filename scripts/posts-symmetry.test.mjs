// Kiểm cây posts/ (VI) và posts-en/ (EN) luôn đối xứng và up-to-date. Chạy local và CI.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { bodyHash } from "../src/lib/translation-check.mjs";

const SCRIPT = path.resolve("scripts/check-translations.mjs");
const run = (cwd, extra = []) => {
  const env = { ...process.env };
  delete env.POSTS_EN_EXTRA_ROOT;
  return spawnSync(process.execPath, [SCRIPT, "--strict", ...extra], { cwd, env, encoding: "utf8" });
};
const hasEn = () => fs.existsSync("posts-en") && fs.readdirSync("posts-en").some((n) => !n.startsWith("."));

test("posts/ và posts-en/ thật: mỗi bài VI có bản EN cùng đường dẫn, không thừa, không cũ", (t) => {
  if (!hasEn()) {
    if (process.env.CI === "true") assert.fail("posts-en trống: kiểm secret POSTS_EN_DEPLOY_KEY, deploy key của posts-en và submodule posts-en");
    return t.skip("posts-en chưa được checkout (git submodule update --init posts-en)");
  }
  const r = run(process.cwd(), ["--json"]);
  const out = JSON.parse(r.stdout);
  assert.equal(out.errors, 0, r.stdout.slice(0, 3000));
  assert.equal(out.stale, 0);
  assert.equal(out.translated, out.total);
  assert.equal(r.status, 0);
});

// ---- fixture: cây tạm gồm posts/ và posts-en/ ----
const VI_BODY = "## Ý chính\nNội dung.";
const viFile = (title) => `---\ntime: 03/02/2023\ntitle: ${title}\ndescription: d\ntags: [x]\nis_published: true\n---\n${VI_BODY}\n`;
const enFile = (o) => {
  const fm = { title: "Sample", description: "d", source_path: "blog-sharing/x/markdown/a.md", source_slug: "chia-se-mau", source_hash: bodyHash(VI_BODY), translated_at: "2026-11-25", ...o };
  return `---\n${Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n")}\n---\n## Main idea\nContent.\n`;
};
const build = (enFiles, extraVi = {}) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "sym-"));
  const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(cwd, rel)), { recursive: true }); fs.writeFileSync(path.join(cwd, rel), text); };
  put("posts/blog-sharing/x/markdown/a.md", viFile("Chia sẻ mẫu"));
  for (const [rel, text] of Object.entries(extraVi)) put(`posts/${rel}`, text);
  for (const [rel, text] of Object.entries(enFiles)) put(`posts-en/${rel}`, text);
  return cwd;
};
const A = "blog-sharing/x/markdown/a.md";

test("fixture: cây đúng -> exit 0", () => {
  const r = run(build({ [A]: enFile({}) }));
  assert.equal(r.status, 0, r.stderr);
});
test("fixture: file EN sai đường dẫn -> exit 1", () => {
  const r = run(build({ "blog-sharing/x/a.md": enFile({}) }));
  assert.equal(r.status, 1);
  assert.match(r.stderr, /phải bằng source_path/);
});
test("fixture: file EN mồ côi -> exit 1", () => {
  const r = run(build({ [A]: enFile({}), "blog-sharing/x/markdown/b.md": enFile({ title: "Other", source_path: "blog-sharing/x/markdown/b.md" }) }));
  assert.equal(r.status, 1);
  assert.match(r.stderr, /không trỏ tới bài VI/);
});
test("fixture: bản EN cũ hơn bản VI -> exit 1", () => {
  const r = run(build({ [A]: enFile({ source_hash: bodyHash("nội dung cũ") }) }));
  assert.equal(r.status, 1);
  assert.match(r.stderr, /stale/);
});
test("fixture: thiếu bản EN -> exit 1", () => {
  const r = run(build({ [A]: enFile({}) }, { "blog-sharing/x/markdown/c.md": viFile("Bài khác") }));
  assert.equal(r.status, 1);
  assert.match(r.stderr, /thiếu bản EN/);
});
