import { getHighlightNews, getMediumNews } from "@/utils/common";
import fundTeamMissionData from "../../../../../utils/data/json/teams/mission/fund.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const FundTeamContent = () => {
  return (
    <>
      <CoverImageSlide />
      <MissionComponent missionCartData={fundTeamMissionData} />
      <ListNewsHome team="fund" />
    </>
  );
};
