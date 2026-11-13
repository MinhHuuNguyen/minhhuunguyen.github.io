import { getSiteData } from "@/lib/site-data.mjs";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";
import type { HomeProps, MarqueeItem, PathSummary } from "./types";

const site = siteData as SiteConfig;

/** Dữ liệu trang chủ, tính lúc build (chỉ gọi trong getStaticProps). */
export function getHomeProps(): HomeProps {
  const data = getSiteData();
  const latestVideos = [...data.videos].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 8);
  const marquee: MarqueeItem[] =
    latestVideos.length >= 4
      ? latestVideos.map((video) => ({ kind: "video", video }))
      : site.marqueePhotos.map((p) => ({ kind: "photo", base: p.base, alt: p.alt }));
  const toPath = (p: any): PathSummary => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    banner: p.banner,
    updated: p.updated,
    stats: p.stats,
  });
  return {
    counts: data.counts,
    featured: { posts: data.featured.posts, paths: data.featured.paths.map(toPath), projects: data.featured.projects },
    marquee,
    latestVideos,
  };
}
