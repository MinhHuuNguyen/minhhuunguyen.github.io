import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostList } from '@/@types/post';

const BLOG_FOLDER = path.join(process.cwd(), 'posts');

export function getPostsList(): { highlightPosts: PostList[], nonHighlightPosts: PostList[] } {
  const postList: PostList[] = [];

  const readFilesRecursively = (currentPath: string) => {
    const filePaths = fs.readdirSync(currentPath);

    for (const filePath of filePaths) {
      const fullPath = path.join(currentPath, filePath);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readFilesRecursively(fullPath);
      } else if (filePath.endsWith('.md') && filePath !== 'README.md') {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const parsedContent = matter(fileContents);
        const { data } = parsedContent;
        const slug = data.slug; // Lấy slug từ markdown

        postList.push({
          time: data.time || null,
          title: data.title || null,
          description: data.description || null,
          author: data.author || null,
          banner_url: data.banner_url,
          tags: data.tags || null,
          slug,
          filePath: fullPath,
          isHighlight: data.is_highlight || false, 
        });
      }
    }
  };

  readFilesRecursively(BLOG_FOLDER);

  // Phân loại bài viết nổi bật và bài viết khác
  const highlightPosts = postList.filter(post => post.isHighlight).slice(0, 6);
  const nonHighlightPosts = postList.filter(post => !post.isHighlight);

  return { highlightPosts, nonHighlightPosts };
}
