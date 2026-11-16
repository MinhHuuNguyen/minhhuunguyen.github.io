const LESSON_LINE = /^#{2,4}\s*\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)\/?\)\s*$/;
export function parseSeriesLessons(markdown) {
  const seen = new Set(), out = [];
  for (const line of String(markdown ?? "").split(/\r?\n/)) {
    const m = LESSON_LINE.exec(line.trim());
    if (!m || seen.has(m[2])) continue;
    seen.add(m[2]);
    out.push({ order: out.length + 1, label: m[1].trim(), slug: m[2] });
  }
  return out;
}
export const pathSlugOf = (seriesSlug) => seriesSlug.replace(/^series-/, "");
const cleanTitle = (t) => String(t ?? "").replace(/^\[SERIES\]\s*/i, "");
export function buildPaths(posts) {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const paths = [];
  for (const s of posts.filter((p) => (p.tags ?? []).includes("series"))) {
    const lessons = parseSeriesLessons(s.content).map((l) => {
      const p = bySlug.get(l.slug);
      return { ...l, available: !!p, title: p?.title ?? null, minutes: p?.readingMinutes ?? null, hasVideo: !!p?.video };
    });
    if (!lessons.length) { console.warn(`[learn] bỏ lộ trình không có bài học: ${s.filePath}`); continue; }
    paths.push({
      slug: pathSlugOf(s.slug), seriesSlug: s.slug, title: cleanTitle(s.title), description: s.description ?? "",
      banner: s.banner_url ?? "", updated: s.time ?? "", filePath: s.filePath, lessons,
      stats: {
        total: lessons.length, available: lessons.filter((l) => l.available).length,
        minutes: lessons.reduce((n, l) => n + (l.minutes ?? 0), 0), videos: lessons.filter((l) => l.hasVideo).length,
      },
    });
  }
  return paths
    .sort((a, b) => a.filePath.localeCompare(b.filePath, "en", { numeric: true }))
    .map(({ filePath, ...p }) => p);
}
export function lessonNav(paths, postSlug) {
  for (const p of paths) {
    const avail = p.lessons.filter((l) => l.available);
    const i = avail.findIndex((l) => l.slug === postSlug);
    if (i === -1) continue;
    return { path: { slug: p.slug, title: p.title }, position: i + 1, total: avail.length, prev: avail[i - 1] ?? null, next: avail[i + 1] ?? null };
  }
  return null;
}
/** Lộ trình bản EN: nhãn/tiêu đề lấy từ bản dịch; mỗi bài học có href và lang (en nếu đã dịch, vi nếu chưa). */
export function buildEnPaths(viPaths, enPosts, pairs) {
  const enBySlug = new Map(enPosts.map((p) => [p.slug, p]));
  return viPaths.map((vp) => {
    const enSeries = enBySlug.get(pairs.viToEn[vp.seriesSlug]);
    const enLabels = new Map(enSeries ? parseSeriesLessons(enSeries.content).map((l) => [l.slug, l.label]) : []);
    const lessons = vp.lessons.map((l) => {
      const enSlug = pairs.viToEn[l.slug];
      return enSlug
        ? { ...l, label: enLabels.get(l.slug) ?? l.label, title: enBySlug.get(enSlug)?.title ?? l.title, href: `/en/blog/${enSlug}`, lang: "en" }
        : { ...l, href: l.available ? `/blog/${l.slug}` : null, lang: "vi" };
    });
    return { ...vp, title: enSeries ? cleanTitle(enSeries.title) : vp.title, description: enSeries?.description ?? vp.description, lessons };
  });
}
