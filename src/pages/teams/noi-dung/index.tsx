import { NdTeamContent } from "@/components/features/home/teams/noi-dung";
import {Opportunity} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function NdTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <NdTeamContent />
      <Opportunity />
    </>
  );
}
