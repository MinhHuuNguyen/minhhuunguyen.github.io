import { QuyktcbTeamContent } from "@/components/features/home/teams/quy-ktcb";
import {Opportunity} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function QuyktcbTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <QuyktcbTeamContent />
      <Opportunity />
    </>
  );
}
