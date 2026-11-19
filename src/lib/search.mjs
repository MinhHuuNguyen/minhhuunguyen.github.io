// Dùng chung lúc build (Node) và ở trình duyệt (loadJS cần đúng các option này).
import { normalizeText, toIsoDate } from "./seo.mjs";
import { plainText } from "./reading.mjs";
export const SEARCH_FIELDS = ["title", "headings", "tags", "text"];
export const STORE_FIELDS = ["type", "title", "titleEn", "url", "snippet", "date"];
export const PLAIN_TEXT_WORDS = 400;
export const SEARCH_INDEX_MAX_BYTES = 1_500_000;
export function processTerm(term) { const t = normalizeText(term).replace(/[^a-z0-9]/g, ""); return t.length >= 2 ? t : null; }
export function miniSearchOptions() {
  return {
    idField: "id", fields: SEARCH_FIELDS, storeFields: STORE_FIELDS, processTerm,
    extractField: (doc, field) => (Array.isArray(doc[field]) ? doc[field].join(" ") : doc[field]),
    searchOptions: { boost: { title: 4, headings: 2, tags: 2 }, prefix: true, fuzzy: 0.15, combineWith: "AND" },
  };
}
const snippet = (s) => { const t = String(s ?? "").replace(/\s+/g, " ").trim(); return t.length > 160 ? t.slice(0, 157) + "…" : t; };
const headingsOf = (md) => [...String(md ?? "").matchAll(/^#{2,3}\s+(.+?)\s*#*\s*$/gm)].map((m) => plainText(m[1]));
// Bài EN (có viSlug) nằm dưới /en/blog; bài VI chưa dịch giữ /blog.
const postUrl = (p) => (p.viSlug ? `/en/blog/${p.slug}` : `/blog/${p.slug}`);
export function buildSearchDocs({ posts = [], paths = [], videos = [], projects = [], pages = [] }) {
  return [
    ...posts.map((p) => ({ id: `post:${p.slug}`, type: "post", title: p.title, titleEn: p.title, url: postUrl(p),
      tags: (p.tags ?? []).filter((t) => t !== "series"), headings: headingsOf(p.content),
      text: `${p.description ?? ""} ${plainText(p.content, PLAIN_TEXT_WORDS)}`.trim(), snippet: snippet(p.description), date: toIsoDate(p.time) })),
    ...paths.map((p) => ({ id: `path:${p.slug}`, type: "path", title: p.title, titleEn: p.title, url: `/learn/${p.slug}`,
      tags: [], headings: p.lessons.map((l) => l.label), text: p.description, snippet: snippet(p.description), date: toIsoDate(p.updated) })),
    ...videos.map((v) => ({ id: `video:${v.key}`, type: "video", title: v.title.vi, titleEn: v.title.en, url: `/videos#${encodeURIComponent(v.key)}`,
      tags: v.tags, headings: [], text: [v.description?.vi, v.description?.en, v.title.en].filter(Boolean).join(" "),
      snippet: snippet(v.description?.vi ?? v.title.vi), date: toIsoDate(v.publishedAt) })),
    ...projects.map((p) => ({ id: `project:${p.slug}`, type: "project", title: p.vi.title, titleEn: p.en?.title ?? p.vi.title, url: `/projects/${p.slug}`,
      tags: p.vi.stack ?? [], headings: [], text: `${p.vi.summary} ${p.en?.summary ?? ""}`, snippet: snippet(p.vi.summary), date: null })),
    ...pages.map((p) => ({ id: `page:${p.url}`, type: "page", title: p.title.vi, titleEn: p.title.en, url: p.url,
      tags: [], headings: [], text: p.text, snippet: snippet(p.text), date: null })),
  ];
}
export function buildSuggestions({ paths = [], posts = [] }) {
  const t = (p) => Date.parse(toIsoDate(p.time) ?? "1970-01-01");
  const latest = [...posts].sort((a, b) => t(b) - t(a)).slice(0, 5);
  return [...paths.slice(0, 3).map((p) => ({ type: "path", title: p.title, url: `/learn/${p.slug}` })),
          ...latest.map((p) => ({ type: "post", title: p.title, url: postUrl(p) }))];
}
