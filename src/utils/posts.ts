import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostList } from '@/@types/post';


export function getPostsList(): {
  seriesPosts: PostList[],
  highlightPostsNotSeries6: PostList[],
  nonHighlightPostsNotSeries: PostList[]
} {
  const postList: PostList[] = [];

  const readFilesRecursively = (currentPath: string) => {
    const filePaths = fs.readdirSync(currentPath);

    for (const filePath of filePaths) {
      const fullPath = path.join(currentPath, filePath);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !filePath.startsWith('.')) {
        readFilesRecursively(fullPath);
      } else if ((filePath.endsWith('.md') && filePath !== 'README.md') || fullPath.endsWith('posts/minhhuunguyen/README.md')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const parsedContent = matter(fileContents);
        const { data } = parsedContent;
        const slug = data.title 
        ? data.title
            .toLowerCase()                          // Convert to lowercase
            .normalize('NFD')                        // Normalize accents
            .replace(/đ/g, 'd')                      // Convert "đ" to "d"
            .replace(/[\u0300-\u036f]/g, '')         // Remove diacritical marks
            .replace(/[^a-z0-9 ]/g, '')              // Remove special characters, keep letters, digits, and spaces
            .replace(/\s+/g, '-')                    // Replace spaces with hyphens
        : '';                                        // Return empty string if no title

        if (data.is_published === true) {
          postList.push({
            time: data.time || "11/15/1997",
            title: data.title || "Untitled",
            description: data.description || "No description",
            banner_url: data.banner_url || "",
            tags: data.tags || null,
            slug,
            filePath: fullPath,
            isHighlight: data.is_highlight || false, 
          });
        }
      }
    }
  };

  readFilesRecursively(path.join(process.cwd(), 'posts'));

  // Phân loại bài viết và sắp xếp bài viết theo thời gian
  const seriesPosts = postList.filter(post => post.tags && post.tags.includes('series'));
  seriesPosts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const highlightPosts = postList.filter(post => post.isHighlight);
  const highlightPostsNotSeries = highlightPosts.filter(post => !post.tags || !post.tags.includes('series'));
  const highlightPostsNotSeries6 = highlightPostsNotSeries.slice(0, 6);
  highlightPostsNotSeries6.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const nonHighlightPosts = postList.filter(post => !post.isHighlight);
  const nonHighlightPostsNotSeries = nonHighlightPosts.filter(post => !post.tags || !post.tags.includes('series'));
  nonHighlightPostsNotSeries.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return { seriesPosts, highlightPostsNotSeries6, nonHighlightPostsNotSeries };
}
