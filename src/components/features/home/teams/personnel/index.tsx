import personnelTeamMissionData from "../../../../../utils/data/json/teams/mission/personnel.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const PersonnelTeamContent = () => {
  return (
    <>
      <CoverImageSlide />
      <MissionComponent missionCartData={personnelTeamMissionData} />
      <ListNewsHome team="personnel" />
    </>
  );
};
