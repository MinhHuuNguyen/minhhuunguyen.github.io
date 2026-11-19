import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readProjects, featuredProjects } from "../src/lib/projects.mjs";

const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join("\n")}\n---\n`;
const mk = (files) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "projects-"));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  }
  return root;
};
const AR = "Auto Review system for Photo, Footage and Illustration data.";

test("đọc vi/en, bỏ bản nháp và _template, báo lỗi resume_project sai, slug sai, cover thiếu", () => {
  const root = mk({
    "ok/index.vi.md": fm({ title: "Dự án OK", summary: "Tóm tắt", company: "PIXTA", period: "2024", role: "MLOps", stack: ["PyTorch"], featured: true, order: 1, is_published: true, resume_project: AR }) + "## Bối cảnh\nNội dung.",
    "ok/index.en.md": fm({ title: "OK project", summary: "Summary" }) + "## Context\nBody.",
    "draft/index.vi.md": fm({ title: "Nháp", summary: "s", is_published: false }),
    "bad/index.vi.md": fm({ title: "Sai", summary: "s", is_published: true, resume_project: "Không tồn tại" }),
    "Bad Name/index.vi.md": fm({ title: "X", summary: "s", is_published: true }),
    "nocover/index.vi.md": fm({ title: "Y", summary: "s", is_published: true, cover: "/projects/nocover/cover.webp" }),
    "_template/index.vi.md": fm({ title: "Mẫu", summary: "s", is_published: true }),
  });
  const { projects, errors } = readProjects(root, { resumeProjectNames: [AR], publicDir: root });
  assert.deepEqual(projects.map((p) => p.slug), ["ok"]);
  assert.equal(projects[0].en.title, "OK project");
  assert.equal(projects[0].en.company, "PIXTA");
  assert.match(projects[0].vi.html, /<h2 id="h-boi-canh">Bối cảnh<\/h2>/);
  assert.deepEqual(errors.sort(), [
    'Bad Name: tên thư mục phải khớp ^[a-z0-9-]+$',
    'bad/index.vi.md: resume_project "Không tồn tại" không có trong resume.json',
    'nocover/index.vi.md: cover "/projects/nocover/cover.webp" không tồn tại trong public/',
  ]);
});

test("featuredProjects: case study featured trước, không có thì lấy fallback từ CV, không có link", () => {
  const resume = [
    { projectName: "A", projectYear: "2026", company: "FPT Software", techStack: ["LLM"] },
    { projectName: "B", projectYear: "2025", company: "PIXTA", techStack: ["Flux"] },
  ];
  const f = featuredProjects([], resume, ["B", "A"], 4);
  assert.deepEqual(f.map((x) => [x.title.vi, x.href]), [["B", null], ["A", null]]);
});
