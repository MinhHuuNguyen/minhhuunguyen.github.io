import ktstnTeamMissionData from "../../../../../utils/data/json/teams/mission/ktstn.json";
import ktstnTeamCoverImageData from "../../../../../utils/data/json/teams/banner/ktstn.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const KtstnTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={ktstnTeamCoverImageData} />
      <MissionComponent missionCartData={ktstnTeamMissionData} />
      <ListNewsHome team="ktstn" />
    </>
  );
};
