import fs from "node:fs";
import path from "node:path";
import { SITE } from "../src/lib/seo.mjs";
import { getSiteData } from "../src/lib/site-data.mjs";
import { readCommentsConfig } from "../src/lib/comments-config.mjs";
import { commentsKey, isReady } from "../src/lib/comments.mjs";

// Runs as `postbuild`: the exported site in out/ must agree with the sitemap and carry the structured data.
const OUT = "out";
const problems = [];
const read = (p) => fs.readFileSync(path.join(OUT, p), "utf8");

const hreflangOf = (html) => {
  const out = {};
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const lang = /hreflang="([^"]+)"/i.exec(tag)?.[1];
    const href = /href="([^"]+)"/i.exec(tag)?.[1];
    if (lang && href) out[lang] = href;
  }
  return out;
};
const locs = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const fileOf = (loc) => {
  const rel = loc.slice(SITE.length).replace(/^\//, "");
  return rel === "" ? "index.html" : `${rel}.html`;
};
for (const loc of locs) {
  if (!fs.existsSync(path.join(OUT, fileOf(loc)))) problems.push(`sitemap có ${loc} nhưng thiếu out/${fileOf(loc)}`);
}

const pages = fs.readdirSync(path.join(OUT, "blog")).filter((f) => f.endsWith(".html"));
const missing = new Set(getSiteData().missingSlugs);
for (const f of pages) {
  const url = `${SITE}/blog/${f.slice(0, -5)}`;
  if (missing.has(f.slice(0, -5))) {
    // Trang placeholder: noindex và không được vào sitemap.
    if (!/<meta name="robots" content="[^"]*noindex/.test(read(`blog/${f}`))) problems.push(`out/blog/${f} (placeholder) thiếu noindex`);
    if (locs.includes(url)) problems.push(`sitemap không được chứa placeholder ${url}`);
    continue;
  }
  if (!locs.includes(url)) problems.push(`trang ${url} không có trong sitemap`);
  if (!read(`blog/${f}`).includes('"@type":"BlogPosting"')) problems.push(`out/blog/${f} thiếu BlogPosting`);
}

const enPages = fs.existsSync(path.join(OUT, "en", "blog")) ? fs.readdirSync(path.join(OUT, "en", "blog")).filter((f) => f.endsWith(".html")) : [];
for (const f of enPages) {
  const url = `${SITE}/en/blog/${f.slice(0, -5)}`;
  if (!locs.includes(url)) problems.push(`trang ${url} không có trong sitemap`);
  const html = read(`en/blog/${f}`);
  if (!html.includes('"@type":"BlogPosting"')) problems.push(`out/en/blog/${f} thiếu BlogPosting`);
  if (!hreflangOf(html).vi) problems.push(`out/en/blog/${f} thiếu hreflang="vi"`);
}
if (!read("robots.txt").includes(`Sitemap: ${SITE}/sitemap.xml`)) problems.push("robots.txt thiếu dòng Sitemap");
for (const f of ["privacy.html", "terms.html"]) {
  if (!fs.existsSync(path.join(OUT, f))) problems.push(`thiếu out/${f}`);
}

// Mọi trang HTML đã xuất (trừ 404, bản in CV, styleguide, trang bài đã kiểm ở trên) phải có trong sitemap; trang tạm không được có.
const htmlFiles = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(path.join(OUT, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) { if (rel !== "_next") walk(rel); } else if (e.name.endsWith(".html")) htmlFiles.push(rel);
  }
};
walk(".");
const NOT_IN_SITEMAP = ["404.html", "styleguide.html"];
for (const f of htmlFiles.map((x) => x.replace(/^\.\//, ""))) {
  if (NOT_IN_SITEMAP.includes(f) || /^blog\/[^/]+\.html$/.test(f) || /^en\/blog\//.test(f)) continue;
  const loc = f === "index.html" ? `${SITE}/` : `${SITE}/${f.slice(0, -5)}`;
  if (!locs.includes(loc)) problems.push(`out/${f} không có trong sitemap (${loc})`);
}
for (const f of NOT_IN_SITEMAP) {
  const loc = `${SITE}/${f.slice(0, -5)}`;
  if (locs.includes(loc)) problems.push(`sitemap không được chứa ${loc}`);
}
// Bài fixture hợp đồng chỉ được xuất khi đặt POSTS_EXTRA_ROOT.
if (!process.env.POSTS_EXTRA_ROOT && fs.existsSync(path.join(OUT, "blog", "contract-fixture-video-post.html"))) {
  problems.push("out/blog/contract-fixture-video-post.html lọt vào bản build khi không có POSTS_EXTRA_ROOT");
}
// hreflang đối xứng: vi <-> en trỏ ngược lại nhau (đích lấy từ chính href, vì slug bài EN khác slug bài VI).
for (const raw of htmlFiles) {
  const f = raw.replace(/^\.\//, "");
  if (NOT_IN_SITEMAP.includes(f)) continue;
  const isEn = f === "en.html" || f.startsWith("en/");
  const mine = hreflangOf(read(f));
  const wantSelf = isEn ? "vi" : "en";
  if (!mine[wantSelf]) continue;
  const other = fileOf(mine[wantSelf]);
  if (!fs.existsSync(path.join(OUT, other))) { problems.push(`out/${f} có hreflang="${wantSelf}" nhưng thiếu out/${other}`); continue; }
  const back = hreflangOf(read(other))[isEn ? "en" : "vi"];
  if (!back || fileOf(back) !== f) problems.push(`out/${other} thiếu hreflang="${isEn ? "en" : "vi"}" trỏ ngược lại out/${f}`);
}
// Bình luận (giscus): trang bài mang đúng khóa thread; bản EN dùng khóa của bản VI; bài bị loại thì không có khối.
const commentsCfg = readCommentsConfig();
const termIn = (html) => /data-comments-term="([^"]*)"/.exec(html)?.[1] ?? null;
const wantTerm = (vi) => {
  const key = commentsKey(vi);
  return commentsCfg.enabled && !commentsCfg.exclude.includes(key) ? key : null;
};
const siteData = getSiteData();
for (const f of pages) {
  const vi = missing.has(f.slice(0, -5)) ? null : siteData.postBySlug(f.slice(0, -5));
  if (!vi) continue;
  const got = termIn(read(`blog/${f}`));
  if (got !== wantTerm(vi)) problems.push(`out/blog/${f}: khóa bình luận "${got}" khác "${wantTerm(vi)}"`);
}
for (const f of enPages) {
  const en = siteData.en.posts.find((p) => p.slug === f.slice(0, -5));
  const vi = en ? siteData.postBySlug(en.viSlug) : null;
  if (!vi) continue;
  const got = termIn(read(`en/blog/${f}`));
  if (got !== wantTerm(vi)) problems.push(`out/en/blog/${f}: khóa bình luận "${got}" khác "${wantTerm(vi)}" (khóa của bản VI)`);
}
if (commentsCfg.enabled && !isReady(commentsCfg)) {
  const msg = "src/utils/data/comments.json thiếu repoId/categoryId: làm bước B4 trước khi deploy";
  if (process.env.CI === "true") problems.push(msg);
  else console.warn(`cảnh báo: ${msg}`);
}
// Cổng chữ (C19): trên CI, site.json phải được duyệt.
const copyStatus = JSON.parse(fs.readFileSync("src/utils/data/site.json", "utf8")).meta?.copyStatus;
if (copyStatus !== "approved") {
  const msg = `site.json meta.copyStatus là "${copyStatus}": cần bạn duyệt chữ (cổng G2) trước khi deploy`;
  if (process.env.CI === "true") problems.push(msg);
  else console.warn(`cảnh báo: ${msg}`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`out/: ${locs.length} URL, ${pages.length} trang bài: ok`);
