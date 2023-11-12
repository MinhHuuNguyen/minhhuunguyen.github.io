import experienceTeamMissionData from "../../../../../utils/data/json/teams/mission/experience.json";
import experienceTeamCoverImageData from "../../../../../utils/data/json/teams/banner/experience.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const ExperienceTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={experienceTeamCoverImageData} />
      <MissionComponent missionCartData={experienceTeamMissionData} />
      <ListNewsHome team="experience" />
    </>
  );
};
