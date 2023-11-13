import { TtTeamContent } from "@/components/features/home/teams/truyen-thong";
import {Opportunity} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function TtTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <TtTeamContent />
      <Opportunity />
    </>
  );
}
