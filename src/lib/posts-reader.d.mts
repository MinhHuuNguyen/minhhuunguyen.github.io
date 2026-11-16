import type { PostVideo } from "./seo.mjs";
export interface FullPost {
  time: string;
  title: string;
  description: string;
  banner_url: string;
  tags: string[] | null;
  slug: string;
  filePath: string;
  relPath: string;
  isHighlight: boolean;
  content: string;
  video: PostVideo | null;
  readingMinutes: number;
}
export declare function readAllPosts(root?: string, extraRoot?: string): FullPost[];
