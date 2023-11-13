import { YcbTeamContent } from "@/components/features/home/teams/yeu-cung-be";
import {Opportunity} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function YeucungbeTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <YcbTeamContent />
      <Opportunity />
    </>
  );
}
