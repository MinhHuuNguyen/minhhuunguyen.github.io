import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostList } from '@/@types/post';

const BLOG_FOLDER = path.join(process.cwd(), 'posts');

export function getPostsList(): PostList[] {
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
          banner_url: data.banner_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKfYwYSdOzb_g_JJKD17oGpFZhjGl8aFTHMw&s",
          tags: data.tags || null,
          slug,
          filePath: fullPath,
        });
      }
    }
  };

  readFilesRecursively(BLOG_FOLDER);
  return postList;
}