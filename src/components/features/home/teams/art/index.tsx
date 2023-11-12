import ArtTeamMissionData from "../../../../../utils/data/json/teams/mission/art.json";
import ArtTeamCoverImageData from "../../../../../utils/data/json/teams/banner/art.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const ArtTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={ArtTeamCoverImageData} />
      <MissionComponent missionCartData={ArtTeamMissionData} />
      <ListNewsHome team="art" />
    </>
  );
};
