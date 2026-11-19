import ProjectsRoute, { getStaticProps as viStaticProps } from "../../projects/index";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale("en", viStaticProps);
export default ProjectsRoute;
