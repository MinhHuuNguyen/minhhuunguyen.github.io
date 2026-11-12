// One source for the post slug, the `video` frontmatter, the JSON-LD and the sitemap.
// Used by src/utils/posts.ts, src/pages/blog/[id].tsx and the node scripts in scripts/.
export const SITE = "https://minhhuunguyen.github.io";
export const SITE_AUTHOR = { name: "Nguyen Huu Minh", url: SITE }; // the name README.md gives for this site

/** Lowercase, strip diacritics, "đ" -> "d": the same rule as normalizeText in src/utils/common.ts. */
export function normalizeText(input) {
  return (input || "").toLowerCase().normalize("NFD").replace(/đ/g, "d").replace(/[̀-ͯ]/g, "");
}

/** The post slug used by getStaticPaths: normalized title, keep [a-z0-9 ], whitespace runs to "-". */
export function slugify(title) {
  return title ? normalizeText(title).replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-") : "";
}

/** "05/13/2022" (MM/DD/YYYY, the posts' format) or an ISO string -> "2022-05-13"; anything else -> null. */
export function toIsoDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value !== "string") return null;
  const us = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (us) return `${us[3]}-${us[1]}-${us[2]}`;
  return /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : null;
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const ISO_DURATION = /^PT(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+S)?$/;
const text = (x) => typeof x === "string" && x.trim().length > 0;

/** The `video` frontmatter as a plain, serialisable object, or null when it is missing or malformed. */
export function toPostVideo(v) {
  if (!v || typeof v !== "object") return null;
  const upload = v.upload_date instanceof Date ? v.upload_date.toISOString() : v.upload_date;
  if (!YT_ID.test(v.youtube_id || "") || !text(v.name) || !text(v.description) || !text(v.thumbnail_url)) return null;
  if (!text(upload) || Number.isNaN(Date.parse(upload)) || !ISO_DURATION.test(v.duration || "")) return null;
  const clips = v.clips ?? [];
  const okClip = (c) =>
    c && text(c.name) && Number.isInteger(c.start) && c.start >= 0 &&
    (c.end === undefined || (Number.isInteger(c.end) && c.end > c.start));
  if (!Array.isArray(clips) || !clips.every(okClip)) return null;
  const shorts = v.shorts ?? [];
  const okShort = (s) =>
    s && (s.youtube_id === undefined || YT_ID.test(s.youtube_id)) &&
    (s.tiktok_url === undefined || /^https:\/\/www\.tiktok\.com\//.test(s.tiktok_url));
  if (!Array.isArray(shorts) || !shorts.every(okShort)) return null;
  return {
    youtube_id: v.youtube_id,
    name: v.name,
    description: v.description,
    upload_date: upload,
    duration: v.duration,
    thumbnail_url: v.thumbnail_url,
    clips: clips.map(({ name, start, end }) => (end === undefined ? { name, start } : { name, start, end })),
    shorts: shorts.map(({ youtube_id, tiktok_url }) => ({
      ...(youtube_id ? { youtube_id } : {}),
      ...(tiktok_url ? { tiktok_url } : {}),
    })),
  };
}

export function blogPostingLd(post, pageUrl) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    inLanguage: "vi",
    author: { "@type": "Person", ...SITE_AUTHOR },
  };
  const published = toIsoDate(post.time);
  if (published) ld.datePublished = published;
  if (post.banner_url) ld.image = [post.banner_url];
  if (post.tags?.length) ld.keywords = post.tags.join(", ");
  return ld;
}

export function videoObjectLd(video, pageUrl) {
  const watch = `https://www.youtube.com/watch?v=${video.youtube_id}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: [video.thumbnail_url],
    uploadDate: video.upload_date,
    duration: video.duration,
    embedUrl: `https://www.youtube.com/embed/${video.youtube_id}`,
    inLanguage: "vi",
    isPartOf: { "@type": "WebPage", url: pageUrl },
  };
  if (video.clips.length) {
    ld.hasPart = video.clips.map((c) => ({
      "@type": "Clip",
      name: c.name,
      startOffset: c.start,
      ...(c.end === undefined ? {} : { endOffset: c.end }),
      url: `${watch}&t=${c.start}s`,
    }));
  }
  return ld;
}

const xmlEscape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** entries: [{loc, lastmod?}] -> sitemap XML (sitemaps.org 0.9). */
export function sitemapXml(entries) {
  const urls = entries.map(
    ({ loc, lastmod }) => `  <url><loc>${xmlEscape(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`
  );
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
