import mediaTeamMissionData from "../../../../../utils/data/json/teams/mission/media.json";
import mediaTeamCoverImageData from "../../../../../utils/data/json/teams/banner/media.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const MediaTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={mediaTeamCoverImageData} />
      <MissionComponent missionCartData={mediaTeamMissionData} />
      <ListNewsHome team="media" />
    </>
  );
};
