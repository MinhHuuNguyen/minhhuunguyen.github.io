import { MediaTeamContent } from "@/components/features/home/teams/media";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function MediaTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <MediaTeamContent />
    </>
  );
}
