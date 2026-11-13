import { AppLink } from "@/components/ui/AppLink";
import { TagChip } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";

export type ProjectCardData = {
  slug: string;
  title: { vi: string; en: string };
  summary: { vi: string; en: string };
  stack: string[];
  period: string;
  company: string;
  cover: string | null;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const { t, locale } = useI18n();
  return (
    <li data-project-card className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-card">
      {project.cover && <img src={project.cover} alt="" loading="lazy" decoding="async" className="aspect-video w-full rounded-xl object-cover" />}
      <p className="text-sm text-ink-500">{[project.company, project.period].filter(Boolean).join(" · ")}</p>
      <h2 className="text-xl font-semibold text-ink-900">{pick(project.title, locale)}</h2>
      <p className="text-sm text-ink-700">{pick(project.summary, locale)}</p>
      {project.stack.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s}>
              <TagChip>{s}</TagChip>
            </li>
          ))}
        </ul>
      )}
      <AppLink href={`/projects/${project.slug}`} className="mt-auto text-sm font-semibold text-blue-700">
        {t("projects.viewDetail")} →
      </AppLink>
    </li>
  );
}

export default ProjectCard;
