import { FundTeamContent } from "@/components/features/home/teams/fund";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function FundTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <FundTeamContent />
    </>
  );
}
