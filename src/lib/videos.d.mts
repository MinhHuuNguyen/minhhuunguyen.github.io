import type { PostVideo } from "./seo.mjs";

export type VideoPlatform = "youtube" | "youtube_short" | "tiktok";
export interface Bilingual {
  vi: string;
  en: string;
}
export interface ManualVideo {
  platform: VideoPlatform;
  ref: string;
  title: { vi: string; en?: string };
  description?: { vi: string; en?: string };
  published_at: string;
  duration?: string;
  thumbnail?: string;
  tags?: string[];
  post_slug?: string;
}
export interface VideoInputPost {
  slug: string;
  title: string;
  tags?: string[] | null;
  video?: PostVideo | null;
}
export interface VideoItem {
  key: string;
  platform: VideoPlatform;
  id: string;
  url: string;
  embedUrl: string;
  title: Bilingual;
  description: Bilingual | null;
  publishedAt: string;
  duration: string | null;
  thumbnail: string | null;
  tags: string[];
  post: { slug: string; title: string } | null;
  chapters: { name: string; start: number }[];
  source: "post" | "manual";
}
export declare const PLATFORMS: VideoPlatform[];
export declare function tiktokIdFromUrl(url: string | null | undefined): string | null;
export declare function videoUrls(platform: VideoPlatform, id: string, ref?: string): { url: string; embedUrl: string };
export declare function validateManualVideos(json: unknown): { items: ManualVideo[]; errors: string[] };
export declare function collectVideos(
  posts: VideoInputPost[],
  manual: ManualVideo[],
  meta?: Record<string, { thumbnail?: string }>,
): VideoItem[];
