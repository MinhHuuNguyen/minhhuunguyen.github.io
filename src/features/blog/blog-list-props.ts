// Chỉ chạy lúc build (getStaticProps): đọc dữ liệu bằng fs, không được import từ code client.
import type { BlogListProps } from "@/features/blog/BlogListPage";
import type { LearningPath } from "@/lib/learn.mjs";
import { getSiteData } from "@/lib/site-data.mjs";
import type { Locale } from "@/libs/i18n/types";
/** Props danh sách blog. Bản EN: bài đã dịch (link /en/blog) đứng cùng bài chưa dịch (link /blog, nội dung VI). */
export function blogListProps(locale: Locale): BlogListProps {
  const data = getSiteData();
  const en = locale === "en";
  const source = en
    ? [
        ...data.en.posts.map((p) => ({ ...p, href: `/en/blog/${p.slug}`, hasVideo: !!p.video })),
        ...data.postsSummary.filter((p) => !data.postPairs.viToEn[p.slug]),
      ]
    : data.postsSummary;
  // Chỉ gửi các trường danh sách cần; không đưa content/filePath/video xuống client.
  const posts = [...source]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description.length > 160 ? `${p.description.slice(0, 157)}...` : p.description,
      banner_url: p.banner_url,
      time: p.time,
      tags: p.tags ?? [],
      readingMinutes: p.readingMinutes,
      hasVideo: p.hasVideo,
      isHighlight: !!p.isHighlight && !(p.tags ?? []).includes("series"),
      ...("href" in p ? { href: (p as { href: string }).href } : {}),
    }));
  const counts = new Map<string, number>();
  for (const p of posts) for (const tag of p.tags) if (tag !== "series") counts.set(tag, (counts.get(tag) ?? 0) + 1);
  const topTags = [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([tag, count]) => ({ tag, count }));
  const paths = ((en ? data.en.paths : data.paths) as LearningPath[]).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    stats: { total: p.stats.total, minutes: p.stats.minutes },
  }));
  return { posts, paths, topTags, untranslated: en ? data.postsSummary.filter((p) => !data.postPairs.viToEn[p.slug]).length : 0 };
}
