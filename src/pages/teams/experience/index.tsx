import { ExperienceTeamContent } from "@/components/features/home/teams/experience";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function ExperienceTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ExperienceTeamContent />
    </>
  );
}
