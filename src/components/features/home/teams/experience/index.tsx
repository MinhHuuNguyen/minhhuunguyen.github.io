import experienceTeamMissionData from "../../../../../utils/data/json/teams/mission/experience.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

const coverImageDatas = [
  "https://www.saigonchildren.com/wp-content/uploads/2023/10/banner-4.png",
  "https://www.saigonchildren.com/wp-content/uploads/2023/10/banner-4.png",
  "https://www.saigonchildren.com/wp-content/uploads/2023/10/banner-4.png",
];

export const ExperienceTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={coverImageDatas} />
      <MissionComponent missionCartData={experienceTeamMissionData} />
      <ListNewsHome />
    </>
  );
};
