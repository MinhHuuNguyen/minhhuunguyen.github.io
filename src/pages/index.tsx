import { GetStaticProps, NextPage } from "next";
import { HomeContent } from "@/components/features/home"; // Import HomeContent
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { getPostsList } from "@/utils/posts"; // Import hàm đọc markdown
import { PostList } from "@/@types/post"; // Import kiểu PostList

interface HomePageProps {
  highlightPosts: PostList[];
}

// Home chỉ render highlightPosts → chỉ trả về prop này để tránh nhúng
// seriesPosts/nonHighlightPosts (không dùng) vào page data của trang chủ.
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const { highlightPostsNotSeries6 } = getPostsList();

  return {
    props: {
      highlightPosts: highlightPostsNotSeries6,
    },
  };
};

const Home: NextPage<HomePageProps> = ({ highlightPosts }) => {
  return (
    <>
      <DefaultSeo {...SEO} title={"HOME"} />
      <HomeContent highlightPosts={highlightPosts} />
    </>
  );
};

export default Home;
