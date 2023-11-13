import { NdTeamContent } from "@/components/features/home/teams/noi-dung";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function NdTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <NdTeamContent />
    </>
  );
}
