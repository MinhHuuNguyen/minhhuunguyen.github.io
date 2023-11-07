import { StudyTeamContent } from "@/components/features/home/teams/study";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function StudyTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <StudyTeamContent />
    </>
  );
}
