import BlogListPage, { getStaticProps as viStaticProps } from "../../blog/index";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale("en", viStaticProps);
export default BlogListPage;
