import ArtTeamMissionData from "../../../../../utils/data/json/teams/mission/art.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const ArtTeamContent = () => {
  return (
    <>
      <CoverImageSlide />
      <MissionComponent missionCartData={ArtTeamMissionData} />
      <ListNewsHome team="art" />
    </>
  );
};
