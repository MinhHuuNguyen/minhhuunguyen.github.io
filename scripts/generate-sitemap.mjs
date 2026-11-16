import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SITE, sitemapXml, toIsoDate } from "../src/lib/seo.mjs";
import { readAllPosts } from "../src/lib/posts-reader.mjs";
import { buildPaths } from "../src/lib/learn.mjs";
import { readEnPosts } from "../src/lib/posts-en-reader.mjs";
import { readProjects } from "../src/lib/projects.mjs";
import { localizePath } from "../src/lib/locale-routes.mjs";

const STATIC = ["/", "/blog", "/resume", "/learn", "/videos", "/projects", "/ask", "/privacy", "/terms"];
/** public/sitemap.xml liệt kê các trang build sẽ xuất (file git-ignored, sinh lại mỗi lần). */
export function writeSitemap({ posts = [], paths = [], projects = [], enPosts = [] }, publicDir = "public") {
  const vi = [
    ...STATIC.map((p) => ({ path: p })),
    ...paths.map((p) => ({ path: `/learn/${p.slug}`, lastmod: toIsoDate(p.updated) })),
    ...projects.map((p) => ({ path: `/projects/${p.slug}` })),
  ];
  const entries = [
    ...vi.map(({ path: p, lastmod }) => ({ loc: `${SITE}${p}`, lastmod })),
    // Bản /en của từng trang.
    ...vi.map(({ path: p, lastmod }) => ({ loc: `${SITE}${localizePath(p, "en")}`, lastmod })),
    ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: toIsoDate(p.time) })),
    ...enPosts.map((p) => ({ loc: `${SITE}/en/blog/${p.slug}`, lastmod: toIsoDate(p.time) })),
  ];
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml(entries));
  console.log(`sitemap.xml: ${entries.length} URL (${posts.length} bài, ${enPosts.length} bài EN, ${paths.length} lộ trình, ${projects.length} case study)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const posts = readAllPosts("posts");
  const enRoots = ["posts-en", ...(process.env.POSTS_EN_EXTRA_ROOT ? [process.env.POSTS_EN_EXTRA_ROOT] : [])];
  writeSitemap({ posts, paths: buildPaths(posts), projects: readProjects("src/content/projects").projects, enPosts: readEnPosts(enRoots, posts).enPosts });
}
