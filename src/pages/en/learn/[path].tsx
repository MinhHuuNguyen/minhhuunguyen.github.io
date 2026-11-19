import LearnPathRoute, { getStaticPaths } from "../../learn/[path]";
import type { LearningPath } from "@/lib/learn.mjs";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";
export { getStaticPaths };
export const getStaticProps = withLocale<{ path: LearningPath; navCounts: { videos: number } }>("en", async ({ params }) => {
  const path = (getSiteData().en.paths as LearningPath[]).find((p) => p.slug === params?.path);
  if (!path) return { notFound: true };
  return { props: withNav({ path }) };
});
export default LearnPathRoute;
