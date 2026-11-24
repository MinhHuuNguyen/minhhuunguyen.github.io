import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "./seo.mjs";
import { readingMinutes } from "./reading.mjs";
import { bodyHash } from "./translation-check.mjs";
function walk(dir, root, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) { if (!name.startsWith(".")) walk(full, root, out); continue; }
    const rel = path.relative(root, full).split(path.sep).join("/");
    if (name.endsWith(".md") && name !== "README.md") out.push({ full, rel });
  }
}
/** Đọc bản dịch EN từ các gốc, ghép cặp với bài VI qua source_path. Bỏ qua gốc không tồn tại. */
export function readEnPosts(enRoots, viPosts) {
  const viByRel = new Map(viPosts.map((p) => [p.relPath, p]));
  const enPosts = [], errors = [], viToEn = {}, enToVi = {}, seen = new Map();
  for (const root of enRoots.filter((r) => r && fs.existsSync(r))) {
    const files = [];
    walk(root, root, files);
    for (const { full, rel } of files) {
      const { data: fm, content } = matter(fs.readFileSync(full, "utf8"));
      const vi = viByRel.get(fm.source_path);
      if (!vi) { errors.push(`${rel}: source_path "${fm.source_path}" không trỏ tới bài VI đang publish`); continue; }
      const slug = slugify(fm.title);
      if (!slug) { errors.push(`${rel}: thiếu title`); continue; }
      if (seen.has(slug)) { errors.push(`${rel}: trùng slug EN "${slug}" với ${seen.get(slug)}`); continue; }
      seen.set(slug, rel);
      viToEn[vi.slug] = slug;
      enToVi[slug] = vi.slug;
      enPosts.push({
        ...vi, title: fm.title, description: fm.description, slug, viSlug: vi.slug, content, filePath: full, relPath: rel,
        readingMinutes: readingMinutes(content), stale: fm.source_hash !== bodyHash(vi.content),
      });
    }
  }
  return { enPosts, pairs: { viToEn, enToVi }, errors };
}
