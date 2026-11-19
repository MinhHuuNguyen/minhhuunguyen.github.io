import type { PostVideo } from "@/lib/seo.mjs";

export interface PostList {
  time: string;
  title: string;
  description: string;
  banner_url: string;
  tags: string[];
  slug: string;
  filePath: string;
  relPath: string; // đường dẫn file so với posts/ (khóa thread bình luận mặc định)
  commentsKey?: string | null; // frontmatter comments_key, giữ thread khi dời file
  isHighlight?: boolean;
  content?: string;
  readingMinutes: number;
  video: PostVideo | null; // the `video` frontmatter; null when it is missing or malformed
}