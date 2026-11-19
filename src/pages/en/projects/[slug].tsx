import ProjectRoute, { getStaticPaths, getStaticProps as viStaticProps } from "../../projects/[slug]";
import { withLocale } from "@/lib/with-locale";

export { getStaticPaths };
export const getStaticProps = withLocale("en", viStaticProps);
export default ProjectRoute;
