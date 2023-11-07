import { ArtTeamContent } from "@/components/features/home/teams/art";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function ArtTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ArtTeamContent />
    </>
  );
}
