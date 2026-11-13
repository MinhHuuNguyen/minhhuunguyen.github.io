import { NextSeo } from "next-seo";
import { Container } from "@/components/ui/Container";
import { SectionLabel, TagChip } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { localizePath } from "@/lib/locale-routes.mjs";
import { SITE } from "@/lib/seo.mjs";
import { ProjectCard, type ProjectCardData } from "./ProjectCard";

export type OtherProject = { name: string; year: string; company: string; overall: string; stack: string[] };

export function ProjectsPage({ cards, others }: { cards: ProjectCardData[]; others: OtherProject[] }) {
  const { t, locale } = useI18n();
  const canonical = `${SITE}${localizePath("/projects", locale)}`;
  return (
    <Container className="py-12 sm:py-16">
      <NextSeo title={t("projects.seoTitle")} description={t("projects.lead")} canonical={canonical} openGraph={{ url: canonical, title: t("projects.seoTitle"), description: t("projects.lead") }} />
      <SectionLabel>{t("projects.seoTitle")}</SectionLabel>
      <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">{t("projects.heading")}</h1>
      <p className="mt-3 max-w-prose text-lead text-ink-500">{t("projects.lead")}</p>
      {cards.length > 0 && (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <ProjectCard key={c.slug} project={c} />
          ))}
        </ul>
      )}
      <h2 className="mt-16 text-2xl font-semibold text-ink-900">{t("projects.otherTitle")}</h2>
      <p className="mt-2 text-ink-500">{t("projects.otherLead")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {others.map((o) => (
          <li key={o.name} data-other-project className="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm text-ink-500">{[o.company, o.year].filter(Boolean).join(" · ")}</p>
            <h3 className="text-lg font-semibold text-ink-900">{o.name}</h3>
            {o.overall && <p className="line-clamp-3 text-sm text-ink-700">{o.overall}</p>}
            {o.stack.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {o.stack.map((s) => (
                  <li key={s}>
                    <TagChip>{s}</TagChip>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
}

export default ProjectsPage;
