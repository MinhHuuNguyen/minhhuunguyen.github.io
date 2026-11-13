import path from 'path';
import { PostList } from '@/@types/post';
import { readAllPosts } from '@/lib/posts-reader.mjs';


export function getPostsList(): {
  seriesPosts: PostList[],
  highlightPostsNotSeries6: PostList[],
  nonHighlightPostsNotSeries: PostList[],
  allPosts: PostList[]
} {
  const postList = readAllPosts(path.join(process.cwd(), 'posts')) as unknown as PostList[];

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
