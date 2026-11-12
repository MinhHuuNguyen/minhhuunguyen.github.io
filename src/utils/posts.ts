import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PostList } from '@/@types/post';
import { slugify, toPostVideo } from '@/lib/seo.mjs';


export function getPostsList(): {
  seriesPosts: PostList[],
  highlightPostsNotSeries6: PostList[],
  nonHighlightPostsNotSeries: PostList[],
  allPosts: PostList[]
} {
  const postList: PostList[] = [];

  // Cross-platform check for the owner's profile README (path.sep aware).
  const minhReadme = path.join('posts', 'minhhuunguyen', 'README.md');

  const readFilesRecursively = (currentPath: string) => {
    let filePaths: string[];
    try {
      filePaths = fs.readdirSync(currentPath);
    } catch (err) {
      console.warn(`[posts] Không đọc được thư mục: ${currentPath}`, err);
      return;
    }

    for (const filePath of filePaths) {
      const fullPath = path.join(currentPath, filePath);

      let stat: fs.Stats;
      try {
        stat = fs.statSync(fullPath);
      } catch (err) {
        console.warn(`[posts] Bỏ qua đường dẫn không truy cập được: ${fullPath}`, err);
        continue;
      }

      if (stat.isDirectory() && !filePath.startsWith('.')) {
        readFilesRecursively(fullPath);
      } else if (
        (filePath.endsWith('.md') && filePath !== 'README.md') ||
        fullPath.endsWith(minhReadme)
      ) {
        let parsedContent: matter.GrayMatterFile<string>;
        try {
          parsedContent = matter(fs.readFileSync(fullPath, 'utf8'));
        } catch (err) {
          console.warn(`[posts] Bỏ qua file không đọc/parse được: ${fullPath}`, err);
          continue;
        }
        const { data } = parsedContent;

        const banner_url = data.banner_url
        const content = parsedContent.content

        // lowercase + bỏ dấu + "đ"->"d", keep letters/digits/spaces, spaces to hyphens; '' when there is no title
        const slug = slugify(data.title);

        // The `video` frontmatter written by the publish pipeline; a malformed one is dropped, never fatal.
        const video = toPostVideo(data.video);
        if (data.video !== undefined && video === null) {
          console.warn(`[posts] Bỏ qua frontmatter video không hợp lệ: ${fullPath}`);
        }

        if (data.is_published === true) {
          postList.push({
            time: data.time || new Date(0).toISOString(),
            title: data.title || "Untitled",
            description: data.description || "No description",
            banner_url: banner_url || "",
            tags: data.tags || null,
            slug,
            filePath: fullPath,
            isHighlight: data.is_highlight || false,
            content: content || "",
            video,
          });
        }
      }
    }
  };

  const postsRoot = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(postsRoot) || fs.readdirSync(postsRoot).length === 0) {
    throw new Error(
      "Thư mục 'posts/' rỗng hoặc chưa tồn tại. Hãy init submodule: " +
        "git submodule update --init --recursive"
    );
  }
  readFilesRecursively(postsRoot);

  const byTimeDesc = (a: PostList, b: PostList) =>
    new Date(b.time).getTime() - new Date(a.time).getTime();

  // Phân loại bài viết và sắp xếp bài viết theo thời gian
  const seriesPosts = postList.filter(post => post.tags && post.tags.includes('series'));
  seriesPosts.sort(byTimeDesc);

  const highlightPosts = postList.filter(post => post.isHighlight);
  const highlightPostsNotSeries = highlightPosts.filter(post => !post.tags || !post.tags.includes('series'));
  const highlightPostsNotSeries6 = highlightPostsNotSeries.slice(0, 6);
  highlightPostsNotSeries6.sort(byTimeDesc);

  const nonHighlightPosts = postList.filter(post => !post.isHighlight);
  const nonHighlightPostsNotSeries = nonHighlightPosts.filter(post => !post.tags || !post.tags.includes('series'));
  nonHighlightPostsNotSeries.sort(byTimeDesc);

  // Full deduplicated list (each post once) for the client-side search index.
  // NOTE: `content` is kept here because the post detail page (blog/[id].tsx)
  // reads it; the blog list page strips it in its own getStaticProps.
  const allPosts = [...postList].sort(byTimeDesc);

  return { seriesPosts, highlightPostsNotSeries6, nonHighlightPostsNotSeries, allPosts };
}
