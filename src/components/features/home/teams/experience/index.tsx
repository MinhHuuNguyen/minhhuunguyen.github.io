import experienceTeamMissionData from "../../../../../utils/data/json/teams/mission/experience.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const ExperienceTeamContent = () => {
  return (
    <>
      <CoverImageSlide />
      <MissionComponent missionCartData={experienceTeamMissionData} />
      <ListNewsHome team="experience" />
    </>
  );
};
