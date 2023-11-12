import studyTeamMissionData from "../../../../../utils/data/json/teams/mission/study.json";
import studyTeamCoverImageData from "../../../../../utils/data/json/teams/banner/study.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const StudyTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={studyTeamCoverImageData} />
      <MissionComponent missionCartData={studyTeamMissionData} />
      <ListNewsHome team="study" />
    </>
  );
};
