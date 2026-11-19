import type { PostSummary } from "@/lib/site-data.mjs";
import type { FeaturedProject } from "@/lib/projects.mjs";
import type { VideoItem } from "@/lib/videos.mjs";
import type { Bi } from "@/@types/site";

export type SiteCounts = {
  posts: number;
  paths: number;
  videos: number;
  engineeringProjects: number;
  courses: number;
  awards: number;
  careerYears: number;
};
export type PathSummary = {
  slug: string;
  title: string;
  description: string;
  banner: string;
  updated: string;
  stats: { total: number; available: number; minutes: number; videos: number };
};
export type MarqueeItem = { kind: "video"; video: VideoItem } | { kind: "photo"; base: string; alt: Bi };
export type HomeProps = {
  counts: SiteCounts;
  featured: { posts: PostSummary[]; paths: PathSummary[]; projects: FeaturedProject[] };
  marquee: MarqueeItem[];
  latestVideos: VideoItem[];
};
