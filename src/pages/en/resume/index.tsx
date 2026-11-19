import Resume, { getStaticProps as viStaticProps } from "../../resume/index";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale("en", viStaticProps);
export default Resume;
