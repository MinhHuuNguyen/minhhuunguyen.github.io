import ttTeamMissionData from "../../../../../utils/data/json/teams/mission/truyen-thong.json";
import ttTeamCoverImageData from "../../../../../utils/data/json/teams/banner/truyen-thong.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const TtTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={ttTeamCoverImageData} />
      <MissionComponent missionCartData={ttTeamMissionData} />
      <ListNewsHome team="truyen-thong" />
    </>
  );
};
