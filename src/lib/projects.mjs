import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./render.mjs";

const SLUG = /^[a-z0-9-]+$/;
const SHARED = ["company", "period", "role", "stack", "cover", "metrics", "links", "featured", "order", "is_published", "resume_project"];

export function readProjects(root, { resumeProjectNames = [], publicDir = "public" } = {}) {
  const projects = [], errors = [];
  if (!fs.existsSync(root)) return { projects, errors };
  for (const dir of fs.readdirSync(root).sort()) {
    if (dir.startsWith("_") || dir.startsWith(".")) continue;
    const full = path.join(root, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    if (!SLUG.test(dir)) { errors.push(`${dir}: tên thư mục phải khớp ^[a-z0-9-]+$`); continue; }
    const viFile = path.join(full, "index.vi.md");
    if (!fs.existsSync(viFile)) { errors.push(`${dir}: thiếu index.vi.md`); continue; }
    const vi = matter(fs.readFileSync(viFile, "utf8"));
    const fm = vi.data;
    if (fm.is_published !== true) continue;
    const errs = [];
    for (const k of ["title", "summary"]) if (typeof fm[k] !== "string" || !fm[k].trim()) errs.push(`${dir}/index.vi.md: thiếu ${k}`);
    if (fm.resume_project !== undefined && !resumeProjectNames.includes(fm.resume_project))
      errs.push(`${dir}/index.vi.md: resume_project "${fm.resume_project}" không có trong resume.json`);
    if (fm.cover !== undefined && !fs.existsSync(path.join(publicDir, fm.cover)))
      errs.push(`${dir}/index.vi.md: cover "${fm.cover}" không tồn tại trong public/`);
    if (errs.length) { errors.push(...errs); continue; }
    const enFile = path.join(full, "index.en.md");
    const en = fs.existsSync(enFile) ? matter(fs.readFileSync(enFile, "utf8")) : null;
    const shared = Object.fromEntries(SHARED.filter((k) => fm[k] !== undefined).map((k) => [k, fm[k]]));
    projects.push({
      slug: dir, featured: fm.featured === true, order: Number.isFinite(fm.order) ? fm.order : 999,
      vi: { ...fm, html: renderMarkdown(vi.content) },
      en: en ? { ...shared, ...en.data, html: renderMarkdown(en.content) } : null,
    });
  }
  return { projects: projects.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug)), errors };
}

export const resumeEngineeringProjects = (resume) =>
  resume.experience.filter((e) => !/lecturer/i.test(e.title)).flatMap((e) => e.projects.map((p) => ({ ...p, company: e.company })));

export function featuredProjects(projects, resumeProjects, fallbackNames, limit = 4) {
  const cs = projects.filter((p) => p.featured).slice(0, limit).map((p) => ({
    slug: p.slug, title: { vi: p.vi.title, en: p.en?.title ?? p.vi.title }, summary: { vi: p.vi.summary, en: p.en?.summary ?? p.vi.summary },
    stack: p.vi.stack ?? [], year: String(p.vi.period ?? ""), company: p.vi.company ?? "", cover: p.vi.cover ?? null, href: `/projects/${p.slug}`,
  }));
  if (cs.length) return cs;
  return fallbackNames.map((n) => resumeProjects.find((r) => r.projectName === n)).filter(Boolean).slice(0, limit).map((r) => ({
    slug: null, title: { vi: r.projectName, en: r.projectName }, summary: { vi: r.overall ?? "", en: r.overall ?? "" },
    stack: r.techStack ?? [], year: r.projectYear ?? "", company: r.company ?? "", cover: null, href: null,
  }));
}
