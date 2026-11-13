import type { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { HomePage } from "@/features/home/HomePage";
import { getHomeProps } from "@/features/home/getHomeProps";
import type { HomeProps } from "@/features/home/types";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale<HomeProps>("vi", async () => ({ props: getHomeProps() }));

const Home: NextPage<HomeProps> = (props) => (
  <>
    <DefaultSeo {...SEO} title="Nguyễn Hữu Minh" openGraph={{ ...SEO.openGraph, images: [{ url: "https://minhhuunguyen.github.io/img/og-default.jpg", width: 1200, height: 630 }] }} />
    <HomePage {...props} />
  </>
);
export default Home;
