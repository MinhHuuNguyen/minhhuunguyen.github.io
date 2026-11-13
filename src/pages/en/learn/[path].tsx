import LearnPathRoute, { getStaticPaths, getStaticProps as viStaticProps } from "../../learn/[path]";
import { withLocale } from "@/lib/with-locale";

export { getStaticPaths };
export const getStaticProps = withLocale("en", viStaticProps);
export default LearnPathRoute;
