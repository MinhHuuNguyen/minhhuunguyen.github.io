import type { VideoItem } from "./videos.mjs";

export declare function videoListLd(videos: VideoItem[], pageUrl: string): Record<string, unknown>;
export declare function personLd(site: {
  person: { name: { en: string }; roles?: { en?: string[] } };
  socials: Record<string, string | null>;
}): Record<string, unknown>;
export declare function blogPostingLdEn(post: import("./seo.mjs").LdPost, url: string, viUrl?: string | null): Record<string, unknown>;
