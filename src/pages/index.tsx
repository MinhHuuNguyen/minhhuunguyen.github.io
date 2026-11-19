import type { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { HomePage } from "@/features/home/HomePage";
import { getHomeProps } from "@/features/home/getHomeProps";
import type { HomeProps } from "@/features/home/types";
import JsonLd from "@/components/seo/JsonLd";
import { personLd } from "@/lib/seo-extra.mjs";
import type { SiteConfig } from "@/@types/site";
import siteData from "@/utils/data/site.json";
import { withLocale } from "@/lib/with-locale";

export const getStaticProps = withLocale<HomeProps>("vi", async () => ({ props: getHomeProps() }));

const Home: NextPage<HomeProps> = (props) => (
  <>
    <DefaultSeo {...SEO} title="Nguyễn Hữu Minh" openGraph={{ ...SEO.openGraph, images: [{ url: "https://minhhuunguyen.github.io/img/og-default.jpg", width: 1200, height: 630 }] }} />
    <JsonLd data={[personLd(siteData as SiteConfig)]} />
    <HomePage {...props} />
  </>
);
export default Home;
