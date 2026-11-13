import type { GetStaticPaths } from "next";
import { ProjectPage } from "@/features/projects/ProjectPage";
import { withLocale } from "@/lib/with-locale";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import type { Project } from "@/lib/projects.mjs";

// Chưa có case study nào thì `paths` rỗng và không sinh trang nào.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (getSiteData().projects as Project[]).map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps = withLocale<{ project: Project; navCounts: { videos: number } }>("vi", async ({ params }) => {
  const project = (getSiteData().projects as Project[]).find((p) => p.slug === params?.slug);
  if (!project) return { notFound: true };
  return { props: withNav({ project }) };
});

export default function ProjectRoute({ project }: { project: Project }) {
  return <ProjectPage project={project} />;
}
