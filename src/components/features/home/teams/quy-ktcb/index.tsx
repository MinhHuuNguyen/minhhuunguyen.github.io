import quyktcbTeamMissionData from "../../../../../utils/data/json/teams/mission/quy-ktcb.json";
import quyktcbTeamCoverImageData from "../../../../../utils/data/json/teams/banner/quy-ktcb.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const QuyktcbTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={quyktcbTeamCoverImageData} />
      <MissionComponent missionCartData={quyktcbTeamMissionData} />
      <ListNewsHome team="quy-ktcb" />
    </>
  );
};
