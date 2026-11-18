const LINK = /\]\((?:https:\/\/minhhuunguyen\.github\.io)?\/blog\/([a-z0-9-]+)|href="(?:https:\/\/minhhuunguyen\.github\.io)?\/blog\/([a-z0-9-]+)/g;

/** Slug được link tới (`/blog/<slug>`) trong nội dung bài VI và EN nhưng chưa có bài VI; đã sắp xếp, không trùng. */
export function missingPostSlugs(viPosts, enPosts = []) {
  const have = new Set(viPosts.map((p) => p.slug));
  const missing = new Set();
  for (const p of [...viPosts, ...enPosts]) {
    for (const m of (p.content ?? "").matchAll(LINK)) {
      const slug = m[1] ?? m[2];
      if (slug && !have.has(slug)) missing.add(slug);
    }
  }
  return [...missing].sort();
}
