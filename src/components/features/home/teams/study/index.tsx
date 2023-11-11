import studyTeamMissionData from "../../../../../utils/data/json/teams/mission/study.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const StudyTeamContent = () => {
  return (
    <>
      <CoverImageSlide />
      <MissionComponent missionCartData={studyTeamMissionData} />
      <ListNewsHome team="study" />
    </>
  );
};
