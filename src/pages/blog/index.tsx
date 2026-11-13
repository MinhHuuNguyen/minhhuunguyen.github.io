import { BlogListPage, type BlogListProps } from "@/features/blog/BlogListPage";
import type { LearningPath } from "@/lib/learn.mjs";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";

export default BlogListPage;

export const getStaticProps = withLocale<BlogListProps & { navCounts: { videos: number } }>("vi", async () => {
  const data = getSiteData();
  // Chỉ gửi các trường danh sách cần; không đưa content/filePath/video xuống client.
  const posts = [...data.postsSummary]
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
    }));
  const counts = new Map<string, number>();
  for (const p of posts) for (const tag of p.tags) if (tag !== "series") counts.set(tag, (counts.get(tag) ?? 0) + 1);
  const topTags = [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([tag, count]) => ({ tag, count }));
  const paths = (data.paths as LearningPath[]).map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    stats: { total: p.stats.total, minutes: p.stats.minutes },
  }));
  return { props: withNav({ posts, paths, topTags }) };
});
