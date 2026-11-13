export const PLATFORMS = ["youtube", "youtube_short", "tiktok"];
const ORDER = { youtube: 0, youtube_short: 1, tiktok: 2 };
const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const TT_URL = /^https:\/\/www\.tiktok\.com\/@[A-Za-z0-9._]+\/video\/(\d{8,25})(?:[/?#].*)?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DURATION = /^PT(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+S)?$/;
export const tiktokIdFromUrl = (url) => TT_URL.exec(url ?? "")?.[1] ?? null;
export function videoUrls(platform, id, ref) {
  if (platform === "youtube") return { url: `https://www.youtube.com/watch?v=${id}`, embedUrl: `https://www.youtube.com/embed/${id}` };
  if (platform === "youtube_short") return { url: `https://www.youtube.com/shorts/${id}`, embedUrl: `https://www.youtube.com/embed/${id}` };
  return { url: ref, embedUrl: `https://www.tiktok.com/player/v1/${id}` };
}
const idOf = (platform, ref) => (platform === "tiktok" ? tiktokIdFromUrl(ref) : YT_ID.test(ref ?? "") ? ref : null);

export function validateManualVideos(json) {
  const errors = [], items = [], seen = new Map();
  if (!Array.isArray(json?.items)) return { items, errors: ["items: phải là mảng"] };
  json.items.forEach((v, i) => {
    const at = `items[${i}]`, errs = [];
    if (!PLATFORMS.includes(v?.platform)) errs.push(`${at}.platform: phải là youtube | youtube_short | tiktok`);
    else if (!idOf(v.platform, v.ref))
      errs.push(`${at}.ref: ${v.platform === "tiktok" ? "tiktok cần URL https://www.tiktok.com/@<handle>/video/<id>" : `${v.platform} cần id 11 ký tự`}`);
    if (typeof v?.title?.vi !== "string" || !v.title.vi.trim()) errs.push(`${at}.title.vi: bắt buộc`);
    if (v?.title?.en !== undefined && typeof v.title.en !== "string") errs.push(`${at}.title.en: phải là chuỗi`);
    if (!DATE.test(v?.published_at ?? "") || Number.isNaN(Date.parse(v.published_at))) errs.push(`${at}.published_at: phải là YYYY-MM-DD`);
    if (v?.duration !== undefined && !ISO_DURATION.test(v.duration)) errs.push(`${at}.duration: phải là ISO 8601 (PT12M30S)`);
    if (v?.thumbnail !== undefined && !/^(\/|https:\/\/)/.test(v.thumbnail)) errs.push(`${at}.thumbnail: phải bắt đầu bằng / hoặc https://`);
    if (v?.tags !== undefined && !(Array.isArray(v.tags) && v.tags.every((t) => typeof t === "string"))) errs.push(`${at}.tags: phải là mảng chuỗi`);
    if (v?.post_slug !== undefined && !/^[a-z0-9-]+$/.test(v.post_slug)) errs.push(`${at}.post_slug: sai định dạng slug`);
    if (!errs.length) {
      const key = `${v.platform}:${idOf(v.platform, v.ref)}`;
      if (seen.has(key)) errs.push(`${at}: trùng khoá ${key} với items[${seen.get(key)}]`);
      else { seen.set(key, i); items.push(v); }
    }
    errors.push(...errs);
  });
  return { items, errors };
}

const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const bi = (vi, en) => ({ vi, en: en ?? vi });
export function collectVideos(posts, manual, meta = {}) {
  const map = new Map();
  const put = (item) => map.set(item.key, item);
  for (const p of posts) {
    const v = p.video;
    if (!v) continue;
    const post = { slug: p.slug, title: p.title };
    const tags = (p.tags ?? []).filter((t) => t !== "series");
    put({ key: `youtube:${v.youtube_id}`, platform: "youtube", id: v.youtube_id, ...videoUrls("youtube", v.youtube_id),
      title: bi(v.name), description: bi(v.description), publishedAt: v.upload_date, duration: v.duration,
      thumbnail: v.thumbnail_url || ytThumb(v.youtube_id), tags, post, chapters: v.clips.map(({ name, start }) => ({ name, start })), source: "post" });
    v.shorts.forEach((s, i) => {
      if (s.youtube_id) put({ key: `youtube_short:${s.youtube_id}`, platform: "youtube_short", id: s.youtube_id, ...videoUrls("youtube_short", s.youtube_id),
        title: bi(`${p.title} · Short ${i + 1}`), description: null, publishedAt: v.upload_date, duration: null,
        thumbnail: ytThumb(s.youtube_id), tags, post, chapters: [], source: "post" });
      const tt = tiktokIdFromUrl(s.tiktok_url);
      if (tt) put({ key: `tiktok:${tt}`, platform: "tiktok", id: tt, ...videoUrls("tiktok", tt, s.tiktok_url),
        title: bi(`${p.title} · TikTok`), description: null, publishedAt: v.upload_date, duration: null,
        thumbnail: meta[`tiktok:${tt}`]?.thumbnail ?? null, tags, post, chapters: [], source: "post" });
    });
  }
  for (const m of manual) {
    const id = m.platform === "tiktok" ? tiktokIdFromUrl(m.ref) : m.ref;
    const key = `${m.platform}:${id}`;
    const base = map.get(key);
    if (base) {
      put({ ...base, title: m.title ? bi(m.title.vi, m.title.en) : base.title,
        description: m.description ? bi(m.description.vi, m.description.en) : base.description,
        thumbnail: m.thumbnail ?? base.thumbnail, tags: [...new Set([...base.tags, ...(m.tags ?? [])])] });
    } else {
      const linked = m.post_slug ? posts.find((x) => x.slug === m.post_slug) : null;
      put({ key, platform: m.platform, id, ...videoUrls(m.platform, id, m.ref), title: bi(m.title.vi, m.title.en),
        description: m.description ? bi(m.description.vi, m.description.en) : null, publishedAt: m.published_at,
        duration: m.duration ?? null, thumbnail: m.thumbnail ?? (m.platform === "tiktok" ? meta[key]?.thumbnail ?? null : ytThumb(id)),
        tags: m.tags ?? [], post: linked ? { slug: linked.slug, title: linked.title } : null, chapters: [], source: "manual" });
    }
  }
  return [...map.values()].sort((a, b) =>
    Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || ORDER[a.platform] - ORDER[b.platform] || a.key.localeCompare(b.key));
}
