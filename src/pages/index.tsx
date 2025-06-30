/* eslint-disable @next/next/no-img-element */
import { GetStaticProps, NextPage } from "next";
import { HomeContent } from "@/components/features/home"; // Import HomeContent
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { getPostsList } from "@/utils/posts"; // Import hàm đọc markdown
import { PostList } from "@/@types/post"; // Import kiểu PostList
import AdBanner from "@/components/AdBanner";

interface HomePageProps {
  highlightPosts: PostList[];
}

export const getStaticProps: GetStaticProps = async () => {
  const { highlightPosts} = getPostsList();

  return {
    props: {
      highlightPosts,
    },
  };
};

const Home: NextPage<HomePageProps> = ({ highlightPosts}) => {
  return (
    <>
      <DefaultSeo {...SEO} title={"HOME"} />
      <HomeContent highlightPosts={highlightPosts}/>
      <AdBanner />
    </>
  );
};

export default Home;
