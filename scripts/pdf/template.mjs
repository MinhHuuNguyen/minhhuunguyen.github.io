// Dựng HTML in (A4) độc lập cho một bài: bìa + mục lục + nội dung. Không dùng Next/SiteLayout.
// Tài nguyên (font, KaTeX) được nạp từ /assets/... do máy chủ cục bộ của build-pdfs.mjs phục vụ.
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";
import { renderPost } from "../../src/lib/render.mjs";
import { rewritePostLinks } from "../../src/lib/links.mjs";
import { formatDate } from "../../src/lib/format.mjs";
import { SITE } from "../../src/lib/seo.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const read = (p) => fs.readFileSync(p, "utf8");

/** Gói font nhúng: [package, các file css (weight/style)]. */
export const FONT_PACKAGES = [
  ["be-vietnam-pro", ["400", "400-italic", "600", "700", "800"]],
  ["jetbrains-mono", ["400", "700"]],
];
export const KATEX_DIST = path.join(ROOT, "node_modules/katex/dist");
export const FONTSOURCE_DIR = path.join(ROOT, "node_modules/@fontsource");

// Tên trên bìa: thương hiệu site (siteName trong seo.config) + tên tác giả theo ngôn ngữ (site.json).
const PERSON = JSON.parse(read(path.join(ROOT, "src/utils/data/site.json"))).person.name;
const siteLabel = (locale) => `MinhHuuNguyen · ${PERSON[locale] ?? PERSON.vi}`;

const PRINT_CSS = read(path.join(HERE, "print.css"));
const FONT_CSS = FONT_PACKAGES.map(([pkg, files]) =>
  files.map((f) => read(path.join(FONTSOURCE_DIR, pkg, `${f}.css`)).replaceAll("url(./files/", `url(/assets/fonts/${pkg}/files/`)).join("\n"),
).join("\n");

/** Dấu vân tay của mọi thứ ảnh hưởng tới hình thức PDF (template, CSS, font, KaTeX, QR), dùng làm một phần của cache key. */
export const TEMPLATE_FINGERPRINT = crypto
  .createHash("sha256")
  .update(read(fileURLToPath(import.meta.url)))
  .update(JSON.stringify(PERSON))
  .update(PRINT_CSS)
  .update(FONT_CSS)
  .update(read(path.join(KATEX_DIST, "katex.min.css")))
  .update(JSON.parse(read(path.join(ROOT, "node_modules/qrcode/package.json"))).version)
  .digest("hex");

const LABELS = {
  vi: { toc: "Mục lục", minutes: (n) => `${n} phút đọc`, scan: "Đọc bản trực tuyến", video: "Video bài giảng" },
  en: { toc: "Contents", minutes: (n) => `${n} min read`, scan: "Read the online version", video: "Video lecture" },
};

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
/** Escape giá trị đưa vào nội dung HTML hoặc thuộc tính. */
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

/** Chuỗi CSS an toàn (dùng trong `content: "..."` của @page): escape bằng mã hex mọi ký tự có thể thoát khỏi chuỗi hoặc thẻ <style>. */
export const cssString = (v) =>
  String(v ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\\"<>&'`{}]/g, (c) => `\\${c.codePointAt(0).toString(16)} `);

const truncate = (s, n) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
const isHttp = (u) => /^https?:\/\//i.test(String(u ?? ""));

const YT_EMBED = /^https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]{6,20})/;
const watchUrl = (src) => {
  const m = YT_EMBED.exec(src);
  return m ? `https://www.youtube.com/watch?v=${m[1]}` : null;
};
const videoLine = (label, url) => `<p class="video-link">▶ ${esc(label)}: <a href="${esc(url)}">${esc(url)}</a></p>`;

/** iframe YouTube -> dòng link văn bản; iframe/video khác bị bỏ. */
export function replaceMedia(html, label) {
  return html
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, (tag) => {
      const src = /\ssrc="([^"]*)"/i.exec(tag)?.[1] ?? "";
      const url = watchUrl(src.replaceAll("&amp;", "&"));
      return url ? videoLine(label, url) : "";
    })
    .replace(/<video\b[^>]*>[\s\S]*?<\/video>/gi, (tag) => {
      const src = /\ssrc="([^"]*)"/i.exec(tag)?.[1] ?? "";
      return isHttp(src) ? videoLine(label, src) : "";
    });
}

/** Ép mọi ảnh tải ngay (không lazy) để Chromium tải đủ trước khi in. */
export const eagerImages = (html) =>
  html.replace(/<img\b[^>]*>/gi, (tag) => tag.replace(/\s(?:loading|decoding|fetchpriority)="[^"]*"/gi, "").replace(/^<img/i, '<img loading="eager" decoding="sync"'));

/** Link nội bộ của site (/blog/...) thành URL tuyệt đối, vì PDF không có "site gốc". */
export const absolutizeLinks = (html) => html.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_m, attr, rest) => `${attr}="${SITE}/${rest}"`);

export const urlOf = (slug, locale) => `${SITE}${locale === "en" ? "/en" : ""}/blog/${slug}`;

/**
 * @param {{ post: object, locale: "vi"|"en", viToEn?: Record<string,string> }} args
 * `post.content` là markdown; EN thì link tới bài VI đã dịch được đổi sang bản EN như trang web.
 * @returns {Promise<string>} HTML đầy đủ của tài liệu
 */
export async function buildPrintHtml({ post, locale, viToEn = {} }) {
  const L = LABELS[locale] ?? LABELS.vi;
  const url = urlOf(post.slug, locale);
  const { sections, toc } = renderPost(post.content ?? "");
  let body = sections.map((s) => s.html).join("\n");
  if (locale === "en") body = rewritePostLinks(body, viToEn);
  body = eagerImages(absolutizeLinks(replaceMedia(body, L.video)));
  // Bài EN lấy video từ bài VI gốc (web dựng khối riêng); bài VI đã có khối video trong nội dung.
  const lead = locale === "en" && post.video?.youtube_id ? videoLine(L.video, `https://www.youtube.com/watch?v=${post.video.youtube_id}`) : "";

  const qr = (await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M" })).replace(/<\?xml[^>]*\?>/, "");
  let date = null;
  try { date = formatDate(post.time, locale); } catch { /* ngày hỏng: bỏ ngày trên bìa */ }
  const tags = (post.tags ?? []).filter((t) => t !== "series");
  const banner = isHttp(post.banner_url) ? `<img class="cover-banner" data-soft="1" loading="eager" decoding="sync" src="${esc(post.banner_url)}" alt="">` : '<div class="cover-band"></div>';
  const meta = [date, post.readingMinutes ? L.minutes(post.readingMinutes) : ""].filter(Boolean).join(" · ");
  const tocHtml = toc.length
    ? `<nav class="toc"><h2>${esc(L.toc)}</h2><ol>${toc.map((t) => `<li class="l${t.level}"><a href="#${esc(t.id)}">${esc(t.text)}</a></li>`).join("")}</ol></nav>`
    : "";

  const pageCss = `
@page { size: A4; margin: 20mm 17mm 20mm 17mm;
  @top-left { content: "${cssString(truncate(post.title ?? "", 80))}"; font: 600 8pt "Be Vietnam Pro", sans-serif; color: #6b7585; vertical-align: bottom; padding-bottom: 3mm; }
  @bottom-left { content: "${cssString(url)}"; font: 400 7.5pt "Be Vietnam Pro", sans-serif; color: #6b7585; }
  @bottom-right { content: counter(page); font: 600 8.5pt "Be Vietnam Pro", sans-serif; color: #374151; }
}
@page :first { margin: 0; @top-left { content: none; } @bottom-left { content: none; } @bottom-right { content: none; } }`;

  return `<!doctype html>
<html lang="${locale === "en" ? "en" : "vi"}">
<head>
<meta charset="utf-8">
<title>${esc(post.title)}</title>
<link rel="stylesheet" href="/assets/katex/katex.min.css">
<style>${FONT_CSS}</style>
<style>${PRINT_CSS}${pageCss}</style>
</head>
<body>
<section class="cover">
${banner}
<div class="cover-body">
<p class="cover-site">${esc(siteLabel(locale))}</p>
<h1>${esc(post.title)}</h1>
${post.description ? `<p class="cover-desc">${esc(post.description)}</p>` : ""}
${meta ? `<p class="cover-meta">${esc(meta)}</p>` : ""}
${tags.length ? `<ul class="cover-tags">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
</div>
<div class="cover-foot">
<div class="cover-qr" role="img" aria-label="QR">${qr}</div>
<div class="cover-qr-text"><strong>${esc(L.scan)}</strong><a href="${esc(url)}">${esc(url)}</a></div>
</div>
</section>
${tocHtml}
<main class="post">
${lead}
${body}
</main>
</body>
</html>
`;
}
