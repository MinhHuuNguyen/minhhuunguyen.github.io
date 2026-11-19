import { LearnIndex } from "@/features/learn/LearnIndex";
import { withLocale } from "@/lib/with-locale";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import type { LearningPath } from "@/lib/learn.mjs";

export const getStaticProps = withLocale<{ paths: LearningPath[]; navCounts: { videos: number } }>("vi", async () => ({
  props: withNav({ paths: getSiteData().paths as LearningPath[] }),
}));

export default LearnIndex;
