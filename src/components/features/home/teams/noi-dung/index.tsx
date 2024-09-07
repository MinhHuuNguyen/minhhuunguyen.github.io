import ndTeamMissionData from "../../../../../utils/data/json/teams/mission/noi-dung.json";
import ndTeamCoverImageData from "../../../../../utils/data/json/teams/banner/noi-dung.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const NdTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={ndTeamCoverImageData} />
      <MissionComponent missionCartData={ndTeamMissionData} />
      <ListNewsHome team="noi-dung" />
    </>
  );
};
