import { BlogListPage, type BlogListProps } from "@/features/blog/BlogListPage";
import { blogListProps } from "@/features/blog/blog-list-props";
import { withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";
export default BlogListPage;
export const getStaticProps = withLocale<BlogListProps & { navCounts: { videos: number } }>("vi", async () => ({ props: withNav(blogListProps("vi")) }));
