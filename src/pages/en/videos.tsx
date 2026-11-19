import VideosRoute, { getStaticProps as viStaticProps } from "../videos";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale("en", viStaticProps);
export default VideosRoute;
