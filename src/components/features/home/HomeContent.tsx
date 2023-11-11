import home from "../../../utils/data/json/teams/mission/home.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
import ListNewsHome from "./components/ListNews";
import { MissionComponent } from "./components/MissionComponent";

export const HomeContent = () => {
  return (
    <>
      <CoverImageSlide />
      <MissionComponent missionCartData={home} />
      <ListNewsHome team={""} />
    </>
  );
};
