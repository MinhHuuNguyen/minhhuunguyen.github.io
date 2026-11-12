import fs from "node:fs";
import path from "node:path";
import { SITE, sitemapXml, toIsoDate } from "../src/lib/seo.mjs";
import { readPosts } from "./site-posts.mjs";

// Runs as `prebuild`: public/sitemap.xml lists the pages the build will export (it is git-ignored, rebuilt every time).
const posts = readPosts();
const entries = [
  { loc: `${SITE}/` },
  { loc: `${SITE}/blog` },
  { loc: `${SITE}/resume` },
  ...posts.map((p) => ({ loc: `${SITE}/blog/${p.slug}`, lastmod: toIsoDate(p.time) })),
];
fs.writeFileSync(path.join("public", "sitemap.xml"), sitemapXml(entries));
console.log(`sitemap.xml: ${entries.length} URL (${posts.length} bài)`);
