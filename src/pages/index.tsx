/* eslint-disable @next/next/no-img-element */

import { HomeContent } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";


const Home = () => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <HomeContent />
    </>
  );
};

export default Home;
