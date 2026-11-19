import Home, { getStaticProps as viStaticProps } from "../index";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale("en", viStaticProps);
export default Home;
