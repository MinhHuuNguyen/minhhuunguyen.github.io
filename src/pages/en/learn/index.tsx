import LearnRoute from "../../learn/index";
import type { LearningPath } from "@/lib/learn.mjs";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";
export const getStaticProps = withLocale<{ paths: LearningPath[]; navCounts: { videos: number } }>("en", async () => ({
  props: withNav({ paths: getSiteData().en.paths as LearningPath[] }),
}));
export default LearnRoute;
