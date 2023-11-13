import { CbtnTeamContent } from "@/components/features/home/teams/cung-be-trai-nghiem";
import {Opportunity} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function CbtnTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <CbtnTeamContent />
      <Opportunity />
    </>
  );
}
