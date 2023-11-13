import { YcbTeamContent } from "@/components/features/home/teams/yeu-cung-be";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";

export default function YeucungbeTeam() {
  return (
    <>
      <DefaultSeo {...SEO} />
      <YcbTeamContent />
    </>
  );
}
