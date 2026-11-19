import { NextSeo } from "next-seo";
import { AppLink } from "@/components/ui/AppLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel, TagChip } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { localizePath } from "@/lib/locale-routes.mjs";
import { SITE } from "@/lib/seo.mjs";
import type { Project } from "@/lib/projects.mjs";

export function ProjectPage({ project }: { project: Project }) {
  const { t, locale } = useI18n();
  const missingEn = locale === "en" && !project.en;
  const data = locale === "en" && project.en ? project.en : project.vi;
  const canonical = `${SITE}${localizePath(`/projects/${project.slug}`, locale)}`;
  const facts: [string, string | undefined][] = [
    [t("projects.company"), data.company],
    [t("projects.role"), data.role],
    [t("projects.period"), data.period],
  ];
  return (
    <Container size="prose" className="py-12 sm:py-16">
      <NextSeo title={data.title} description={data.summary} canonical={canonical} openGraph={{ url: canonical, title: data.title, description: data.summary }} />
      <AppLink href="/projects" className="text-sm font-semibold text-blue-700">
        ← {t("projects.allProjects")}
      </AppLink>
      <div className="mt-4">
        <SectionLabel>{t("projects.seoTitle")}</SectionLabel>
      </div>
      <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">{data.title}</h1>
      <p className="mt-3 text-lead text-ink-500">{data.summary}</p>
      {missingEn && (
        <p role="note" className="mt-4 rounded-lg bg-surface-100 px-4 py-3 text-sm text-ink-700">
          {t("projects.enMissing")}
        </p>
      )}
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {facts.map(([label, value]) =>
          value ? (
            <div key={label}>
              <dt className="text-sm text-ink-500">{label}</dt>
              <dd className="font-medium text-ink-900">{value}</dd>
            </div>
          ) : null,
        )}
      </dl>
      {data.metrics && data.metrics.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {data.metrics.map((m) => (
            <li key={m.label} className="rounded-2xl bg-white p-5 shadow-card">
              <p className="text-3xl font-semibold text-ink-900">{m.value}</p>
              <p className="text-sm text-ink-500">{m.label}</p>
            </li>
          ))}
        </ul>
      )}
      {data.stack && data.stack.length > 0 && (
        <ul aria-label={t("projects.stack")} className="mt-6 flex flex-wrap gap-2">
          {data.stack.map((s) => (
            <li key={s}>
              <TagChip>{s}</TagChip>
            </li>
          ))}
        </ul>
      )}
      <div className={`post-body prose prose-lg max-w-none text-ink-900 mt-8`} dangerouslySetInnerHTML={{ __html: data.html }} />
      {data.links && data.links.length > 0 && (
        <ul aria-label={t("projects.links")} className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
          {data.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noopener" className="text-blue-700">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export default ProjectPage;
