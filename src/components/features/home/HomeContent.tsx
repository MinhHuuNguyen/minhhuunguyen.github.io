import home from "../../../utils/data/json/teams/mission/home.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
import ListNewsHome from "./components/ListNews";
import { MissionComponent } from "./components/MissionComponent";

const coverImageDatas = [
  "https://www.saigonchildren.com/wp-content/uploads/2023/10/banner-4.png",
  "https://www.saigonchildren.com/wp-content/uploads/2023/10/banner-4.png",
  "https://www.saigonchildren.com/wp-content/uploads/2023/10/banner-4.png",
];

export const HomeContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={coverImageDatas} />
      <MissionComponent missionCartData={home} />
      <ListNewsHome />
    </>
  );
};
