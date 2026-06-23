import homeBanner from "../../../utils/data/home_banner.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
import { HomeStats } from "./components/HomeStats";
import { ResumeComponent } from "./components/ResumeComponent";
import { HomeSkills } from "./components/HomeSkills";
import ListNewsHome from "./components/ListNews";
import { HomeContact } from "./components/HomeContact";
import { PostList } from "@/@types/post"; // Import kiểu PostList để truyền prop

interface HomeContentProps {
  highlightPosts: PostList[];
}

export const HomeContent = ({ highlightPosts }: HomeContentProps) => {
  return (
    <>
      <CoverImageSlide coverImageData={homeBanner} />
      <HomeStats />
      <ResumeComponent />
      <HomeSkills />
      <ListNewsHome highlightPosts={highlightPosts} />
      <HomeContact />
    </>
  );
};
