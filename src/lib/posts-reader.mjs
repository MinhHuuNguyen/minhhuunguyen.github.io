import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify, toPostVideo } from "./seo.mjs";
import { readingMinutes } from "./reading.mjs";
import { assertUniqueCommentKeys } from "./comments.mjs";

const OWN_README = path.join("posts", "minhhuunguyen", "README.md");
function walk(dir, out, root = dir) {
  let names;
  try { names = fs.readdirSync(dir); } catch (e) { console.warn(`[posts] Không đọc được thư mục: ${dir}`, e); return; }
  for (const name of names) {
    const full = path.join(dir, name);
    let st;
    try { st = fs.statSync(full); } catch { continue; }
    if (st.isDirectory()) { if (!name.startsWith(".")) walk(full, out, root); continue; }
    if ((name.endsWith(".md") && name !== "README.md") || full.endsWith(OWN_README)) out.push({ full, root });
  }
}
export function readAllPosts(root = "posts", extraRoot = process.env.POSTS_EXTRA_ROOT) {
  if (!fs.existsSync(root) || fs.readdirSync(root).length === 0)
    throw new Error("Thư mục 'posts/' rỗng hoặc chưa tồn tại. Hãy init submodule: git submodule update --init --recursive");
  const files = [];
  walk(root, files);
  if (extraRoot) walk(extraRoot, files);
  const posts = [];
  for (const { full: file, root: base } of files) {
    let parsed;
    try { parsed = matter(fs.readFileSync(file, "utf8")); } catch (e) { console.warn(`[posts] Bỏ qua file không đọc/parse được: ${file}`, e); continue; }
    const d = parsed.data;
    if (d.is_published !== true) continue;
    const video = toPostVideo(d.video);
    if (d.video !== undefined && video === null) console.warn(`[posts] Bỏ qua frontmatter video không hợp lệ: ${file}`);
    const slug = slugify(d.title);
    if (!slug) continue;
    posts.push({
      time: d.time || new Date(0).toISOString(), title: d.title || "Untitled", description: d.description || "No description",
      banner_url: d.banner_url || "", tags: d.tags || null, slug, filePath: file, relPath: path.relative(base, file).split(path.sep).join("/"), isHighlight: d.is_highlight || false,
      content: parsed.content || "", video, readingMinutes: readingMinutes(parsed.content),
      commentsKey: typeof d.comments_key === "string" ? d.comments_key : null,
    });
  }
  const seen = new Map();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`slug trùng "${p.slug}": ${seen.get(p.slug)} và ${p.filePath}`);
    seen.set(p.slug, p.filePath);
  }
  assertUniqueCommentKeys(posts);
  return posts;
}
