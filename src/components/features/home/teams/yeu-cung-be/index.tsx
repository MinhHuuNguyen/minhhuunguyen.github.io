import ycbTeamMissionData from "../../../../../utils/data/json/teams/mission/yeu-cung-be.json";
import ycbTeamCoverImageData from "../../../../../utils/data/json/teams/banner/yeu-cung-be.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const YcbTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={ycbTeamCoverImageData} />
      <MissionComponent missionCartData={ycbTeamMissionData} />
      <ListNewsHome team="yeu-cung-be" />
    </>
  );
};
