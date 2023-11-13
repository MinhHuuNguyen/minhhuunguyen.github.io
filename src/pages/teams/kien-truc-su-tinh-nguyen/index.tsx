import { KtstnTeamContent } from "@/components/features/home/teams/kien-truc-su-tinh-nguyen";
import {Opportunity} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function KtstnTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <KtstnTeamContent />
      <Opportunity />
    </>
  );
}
