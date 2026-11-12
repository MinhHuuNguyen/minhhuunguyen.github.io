import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "../src/lib/seo.mjs";

// Mirror of src/utils/posts.ts: every *.md except README.md, plus posts/minhhuunguyen/README.md, in every folder that
// does not start with ".", only when `is_published === true`. Throws when two posts share a slug: both would claim one URL.
export function readPosts(root = path.join(process.cwd(), "posts")) {
  const ownReadme = path.join("posts", "minhhuunguyen", "README.md");
  const posts = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      let stat;
      try {
        stat = fs.statSync(full);
      } catch {
        continue;
      }
      if (stat.isDirectory() && !name.startsWith(".")) {
        walk(full);
        continue;
      }
      if (!((name.endsWith(".md") && name !== "README.md") || full.endsWith(ownReadme))) continue;
      let data;
      try {
        ({ data } = matter(fs.readFileSync(full, "utf8")));
      } catch {
        continue;
      }
      if (data.is_published !== true) continue;
      posts.push({ file: full, title: data.title || "Untitled", slug: slugify(data.title), time: data.time ?? null });
    }
  };
  walk(root);
  const seen = new Map();
  for (const post of posts.filter((p) => p.slug)) {
    if (seen.has(post.slug)) throw new Error(`slug trùng "${post.slug}": ${seen.get(post.slug)} và ${post.file}`);
    seen.set(post.slug, post.file);
  }
  return posts.filter((p) => p.slug);
}
