import homeBanner from "../../../utils/data/home_banner.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
import ListNewsHome from "./components/ListNews";
import { ResumeComponent } from "./components/ResumeComponent";
import { PostList } from "@/@types/post"; // Import kiểu PostList để truyền prop

interface HomeContentProps {
  highlightPosts: PostList[];
}

export const HomeContent = ({ highlightPosts}: HomeContentProps) => {
  return (
    <>
      <CoverImageSlide coverImageData={homeBanner} />
      <ResumeComponent />
      <ListNewsHome highlightPosts={highlightPosts}/>
    </>
  );
};
