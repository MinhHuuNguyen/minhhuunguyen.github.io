import type { GetStaticPaths } from "next";
import { PathPage } from "@/features/learn/PathPage";
import { withLocale } from "@/lib/with-locale";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import type { LearningPath } from "@/lib/learn.mjs";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (getSiteData().paths as LearningPath[]).map((p) => ({ params: { path: p.slug } })),
  fallback: false,
});

export const getStaticProps = withLocale<{ path: LearningPath; navCounts: { videos: number } }>("vi", async ({ params }) => {
  const path = (getSiteData().paths as LearningPath[]).find((p) => p.slug === params?.path);
  if (!path) return { notFound: true };
  return { props: withNav({ path }) };
});

export default function LearnPathRoute({ path }: { path: LearningPath }) {
  return <PathPage path={path} />;
}
