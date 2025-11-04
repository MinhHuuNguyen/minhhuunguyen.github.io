/* eslint-disable @next/next/no-img-element */
import { GetStaticProps, NextPage } from "next";
import { HomeContent } from "@/components/features/home"; // Import HomeContent
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { getPostsList } from "@/utils/posts"; // Import hàm đọc markdown
import { PostList } from "@/@types/post"; // Import kiểu PostList

interface HomePageProps {
  seriesPosts: PostList[];
  highlightPosts: PostList[];
  nonHighlightPosts: PostList[];
}

export const getStaticProps: GetStaticProps = async () => {
  const { seriesPosts, highlightPostsNotSeries6, nonHighlightPostsNotSeries } = getPostsList();

  return {
    props: {
      seriesPosts: seriesPosts,
      highlightPosts: highlightPostsNotSeries6,
      nonHighlightPosts: nonHighlightPostsNotSeries,
    },
  };
};

const Home: NextPage<HomePageProps> = ({ seriesPosts, highlightPosts, nonHighlightPosts }) => {
  return (
    <>
      <DefaultSeo {...SEO} title={"HOME"} />
      <HomeContent highlightPosts={highlightPosts}/>
    </>
  );
};

export default Home;
