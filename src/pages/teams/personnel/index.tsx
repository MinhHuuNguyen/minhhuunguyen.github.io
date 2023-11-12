import { PersonnelTeamContent } from "@/components/features/home/teams/personnel";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function PersonnelTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <PersonnelTeamContent />
    </>
  );
}
