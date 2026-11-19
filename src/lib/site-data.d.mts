import type { PostList } from "@/@types/post";

export type PostSummary = Omit<PostList, "content" | "video"> & { hasVideo: boolean };
export interface SiteData {
  postsSummary: PostSummary[];
  postBySlug(slug: string): PostList | null;
  paths: any[];
  videos: any[];
  projects: any[];
  resume: any;
  resumeProjects: any[];
  counts: {
    posts: number;
    paths: number;
    videos: number;
    engineeringProjects: number;
    courses: number;
    awards: number;
    careerYears: number;
  };
  featured: { posts: PostSummary[]; paths: any[]; projects: any[] };
}
export interface SiteDataOptions {
  postsRoot?: string;
  projectsRoot?: string;
  today?: string;
}
export function getSiteData(opts?: SiteDataOptions): SiteData;
export function withNav<T extends object>(props: T): T & { navCounts: { videos: number } };
