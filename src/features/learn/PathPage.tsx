import { NextSeo } from "next-seo";
import { AppLink } from "@/components/ui/AppLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { localizePath } from "@/lib/locale-routes.mjs";
import { SITE } from "@/lib/seo.mjs";
import type { LearningPath } from "@/lib/learn.mjs";
import { useLearnProgress } from "./useLearnProgress";

export function PathPage({ path }: { path: LearningPath }) {
  const { t, locale } = useI18n();
  const { progress, available, percent } = useLearnProgress();
  const info = percent(path);
  const done = progress.paths[path.slug] ?? {};
  const next = path.lessons.find((l) => l.available && !done[l.slug]);
  const title = `${t("learn.pathPrefix")}: ${path.title}`;
  const canonical = `${SITE}${localizePath(`/learn/${path.slug}`, locale)}`;
  return (
    <Container className="py-12 sm:py-16">
      <NextSeo title={title} description={path.description} canonical={canonical} openGraph={{ url: canonical, title, description: path.description }} />
      <AppLink href="/learn" className="text-sm font-semibold text-blue-700">
        ← {t("learn.allPaths")}
      </AppLink>
      <div className="mt-4">
        <SectionLabel>{t("learn.pathPrefix")}</SectionLabel>
      </div>
      <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-prose text-lead text-ink-500">{path.description}</p>
      <p className="mt-3 text-sm font-medium text-ink-700">
        {t("learn.meta").replace("{lessons}", String(path.stats.total)).replace("{minutes}", String(path.stats.minutes))}
        {path.stats.videos > 0 ? ` · ${t("learn.videoCount").replace("{n}", String(path.stats.videos))}` : ""}
      </p>
      {locale === "en" && <p className="mt-2 text-sm text-ink-500">{t("learn.viOnly")}</p>}
      {!available && (
        <p role="note" className="mt-4 rounded-lg bg-surface-100 px-4 py-3 text-sm text-ink-700">
          {t("learn.storageBlocked")}
        </p>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {info.done > 0 && (
          <span data-progress-text className="text-sm font-semibold text-blue-700">
            {t("learn.progress").replace("{done}", String(info.done)).replace("{total}", String(info.total))}
          </span>
        )}
        {next && (
          <AppLink href={`/blog/${next.slug}`} localize={false} className="inline-flex rounded-pill bg-pill-dark px-6 py-2.5 text-[15px] font-semibold text-white">
            {info.done > 0 ? t("learn.continue") : t("learn.start")}
          </AppLink>
        )}
        {info.complete && <span className="text-sm font-semibold text-ink-900">{t("learn.completed")}</span>}
      </div>
      <h2 className="mt-10 text-2xl font-semibold text-ink-900">{t("learn.lessonsHeading")}</h2>
      <ol className="mt-4 divide-y divide-line rounded-2xl bg-white shadow-card">
        {path.lessons.map((l) => (
          <li key={l.slug} data-lesson data-available={l.available ? "true" : "false"} className="flex items-center justify-between gap-4 px-5 py-4">
            <span className="flex items-center gap-3">
              <span className="w-6 text-sm text-ink-500">{l.order}</span>
              {l.available ? (
                <AppLink href={`/blog/${l.slug}`} localize={false} className="font-medium text-ink-900 hover:text-blue-700">
                  {l.title ?? l.label}
                </AppLink>
              ) : (
                <span className="text-ink-500">{l.label}</span>
              )}
            </span>
            <span className="flex shrink-0 items-center gap-3 text-sm text-ink-500">
              {done[l.slug] && <span aria-label={t("learn.completed")}>✓</span>}
              {l.available && l.hasVideo && <span>{t("learn.hasVideo")}</span>}
              {l.available && l.minutes != null && <span>{l.minutes}′</span>}
              {!l.available && <span>{t("learn.comingSoon")}</span>}
            </span>
          </li>
        ))}
      </ol>
    </Container>
  );
}

export default PathPage;
