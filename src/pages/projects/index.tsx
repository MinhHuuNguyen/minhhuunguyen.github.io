import { ProjectsPage, type OtherProject } from "@/features/projects/ProjectsPage";
import type { ProjectCardData } from "@/features/projects/ProjectCard";
import { withLocale } from "@/lib/with-locale";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import type { Project, ResumeProject } from "@/lib/projects.mjs";

type Props = { cards: ProjectCardData[]; others: OtherProject[]; navCounts: { videos: number } };

export const getStaticProps = withLocale<Props>("vi", async () => {
  const { projects, resumeProjects } = getSiteData() as { projects: Project[]; resumeProjects: (ResumeProject & { company: string })[] };
  const cards: ProjectCardData[] = projects.map((p) => ({
    slug: p.slug,
    title: { vi: p.vi.title, en: p.en?.title ?? p.vi.title },
    summary: { vi: p.vi.summary, en: p.en?.summary ?? p.vi.summary },
    stack: p.vi.stack ?? [],
    period: String(p.vi.period ?? ""),
    company: p.vi.company ?? "",
    cover: p.vi.cover ?? null,
  }));
  const linked = new Set(projects.map((p) => p.vi.resume_project).filter(Boolean));
  const others: OtherProject[] = resumeProjects
    .filter((r) => !linked.has(r.projectName))
    .map((r) => ({ name: r.projectName, year: r.projectYear ?? "", company: r.company ?? "", overall: r.overall ?? "", stack: r.techStack ?? [] }));
  return { props: withNav({ cards, others }) };
});

export default function ProjectsRoute({ cards, others }: Props) {
  return <ProjectsPage cards={cards} others={others} />;
}
