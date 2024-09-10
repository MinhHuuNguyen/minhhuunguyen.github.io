import homeBanner from "../../../utils/data/home_banner.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
// import ListNewsHome from "./components/ListNews";
import { ResumeComponent } from "./components/ResumeComponent";


export const HomeContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={homeBanner} />
      <ResumeComponent />
      {/* <ListNewsHome team="" /> */}
    </>
  );
};
