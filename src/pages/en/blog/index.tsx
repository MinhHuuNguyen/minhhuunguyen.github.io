import BlogListPage from "../../blog/index";
import type { BlogListProps } from "@/features/blog/BlogListPage";
import { blogListProps } from "@/features/blog/blog-list-props";
import { withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";
export const getStaticProps = withLocale<BlogListProps & { navCounts: { videos: number } }>("en", async () => ({ props: withNav(blogListProps("en")) }));
export default BlogListPage;
