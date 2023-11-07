import { KtstnTeamContent } from "@/components/features/home/teams/ktstn";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function KtstnTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <KtstnTeamContent />
    </>
  );
}
