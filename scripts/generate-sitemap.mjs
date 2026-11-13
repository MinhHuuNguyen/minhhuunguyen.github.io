import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SITE, sitemapXml, toIsoDate } from "../src/lib/seo.mjs";
import { readAllPosts } from "../src/lib/posts-reader.mjs";
import { buildPaths } from "../src/lib/learn.mjs";
import { readProjects } from "../src/lib/projects.mjs";

const STATIC = ["/", "/blog", "/resume", "/learn", "/videos", "/projects", "/ask", "/privacy", "/terms"];
/** public/sitemap.xml liệt kê các trang build sẽ xuất (file git-ignored, sinh lại mỗi lần). */
export function writeSitemap({ posts = [], paths = [], projects = [] }, publicDir = "public") {
  const entries = [
    ...STATIC.map((p) => ({ loc: `${SITE}${p === "/" ? "/" : p}` })),
    ...paths.map((p) => ({ loc: `${SITE}/learn/${p.slug}`, lastmod: toIsoDate(p.updated) })),
    ...projects.map((p) => ({ loc: `${SITE}/projects/${p.slug}` })),
    ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: toIsoDate(p.time) })),
  ];
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml(entries));
  console.log(`sitemap.xml: ${entries.length} URL (${posts.length} bài, ${paths.length} lộ trình, ${projects.length} case study)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const posts = readAllPosts("posts");
  writeSitemap({ posts, paths: buildPaths(posts), projects: readProjects("src/content/projects").projects });
}
