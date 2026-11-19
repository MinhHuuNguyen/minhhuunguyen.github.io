import LearnRoute, { getStaticProps as viStaticProps } from "../../learn/index";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale("en", viStaticProps);
export default LearnRoute;
