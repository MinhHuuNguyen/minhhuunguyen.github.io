import personnelTeamMissionData from "../../../../../utils/data/json/teams/mission/personnel.json";
import personnelTeamCoverImageData from "../../../../../utils/data/json/teams/banner/personnel.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const PersonnelTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={personnelTeamCoverImageData} />
      <MissionComponent missionCartData={personnelTeamMissionData} />
      <ListNewsHome team="personnel" />
    </>
  );
};
