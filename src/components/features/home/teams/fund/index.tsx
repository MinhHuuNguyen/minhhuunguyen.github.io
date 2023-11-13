import { getHighlightNews, getMediumNews } from "@/utils/common";
import fundTeamMissionData from "../../../../../utils/data/json/teams/mission/fund.json";
import fundTeamCoverImageData from "../../../../../utils/data/json/teams/banner/fund.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const FundTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={fundTeamCoverImageData} />
      <MissionComponent missionCartData={fundTeamMissionData} />
      <ListNewsHome team="fund" />
    </>
  );
};
