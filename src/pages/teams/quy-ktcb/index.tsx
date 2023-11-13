import { QuyktcbTeamContent } from "@/components/features/home/teams/quy-ktcb";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function QuyktcbTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <QuyktcbTeamContent />
    </>
  );
}
