import type { PostVideo } from "@/lib/seo.mjs";

export interface PostList {
  time: string;
  title: string;
  description: string;
  banner_url: string;
  tags: string[];
  slug: string;
  filePath: string;
  isHighlight?: boolean;
  content?: string;
  video: PostVideo | null; // the `video` frontmatter; null when it is missing or malformed
}