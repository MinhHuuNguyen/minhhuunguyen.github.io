import { TtTeamContent } from "@/components/features/home/teams/truyen-thong";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function TtTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <TtTeamContent />
    </>
  );
}
