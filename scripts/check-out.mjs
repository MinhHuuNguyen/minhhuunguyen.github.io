import fs from "node:fs";
import path from "node:path";
import { SITE } from "../src/lib/seo.mjs";

// Runs as `postbuild`: the exported site in out/ must agree with the sitemap and carry the structured data.
const OUT = "out";
const problems = [];
const read = (p) => fs.readFileSync(path.join(OUT, p), "utf8");

const locs = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const fileOf = (loc) => {
  const rel = loc.slice(SITE.length).replace(/^\//, "");
  return rel === "" ? "index.html" : `${rel}.html`;
};
for (const loc of locs) {
  if (!fs.existsSync(path.join(OUT, fileOf(loc)))) problems.push(`sitemap có ${loc} nhưng thiếu out/${fileOf(loc)}`);
}

const pages = fs.readdirSync(path.join(OUT, "blog")).filter((f) => f.endsWith(".html"));
for (const f of pages) {
  const url = `${SITE}/blog/${f.slice(0, -5)}`;
  if (!locs.includes(url)) problems.push(`trang ${url} không có trong sitemap`);
  if (!read(`blog/${f}`).includes('"@type":"BlogPosting"')) problems.push(`out/blog/${f} thiếu BlogPosting`);
}

if (!read("robots.txt").includes(`Sitemap: ${SITE}/sitemap.xml`)) problems.push("robots.txt thiếu dòng Sitemap");
for (const f of ["privacy.html", "terms.html"]) {
  if (!fs.existsSync(path.join(OUT, f))) problems.push(`thiếu out/${f}`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`out/: ${locs.length} URL, ${pages.length} trang bài: ok`);
