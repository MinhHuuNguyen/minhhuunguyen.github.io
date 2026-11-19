export declare const SITE: string;
export declare const SITE_AUTHOR: { name: string; url: string };
export interface PostVideoClip {
  name: string;
  start: number;
  end?: number;
}
export interface PostVideoShort {
  youtube_id?: string;
  tiktok_url?: string;
}
export interface PostVideo {
  youtube_id: string;
  name: string;
  description: string;
  upload_date: string;
  duration: string;
  thumbnail_url: string;
  clips: PostVideoClip[];
  shorts: PostVideoShort[];
}
export interface LdPost {
  title: string;
  description: string;
  time?: string;
  banner_url?: string;
  tags?: string[] | null;
}
export declare function normalizeText(input: string): string;
export declare function slugify(title: string | undefined | null): string;
export declare function toIsoDate(value: unknown): string | null;
export declare function toPostVideo(v: unknown): PostVideo | null;
export declare function blogPostingLd(post: LdPost, pageUrl: string): Record<string, unknown>;
export declare function videoObjectLd(video: PostVideo, pageUrl: string): Record<string, unknown>;
export declare function sitemapXml(entries: { loc: string; lastmod?: string | null }[]): string;
