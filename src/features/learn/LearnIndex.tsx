import { NextSeo } from "next-seo";
import { AppLink } from "@/components/ui/AppLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { localizePath } from "@/lib/locale-routes.mjs";
import { SITE } from "@/lib/seo.mjs";
import type { LearningPath } from "@/lib/learn.mjs";
import { useLearnProgress } from "./useLearnProgress";

export function LearnIndex({ paths }: { paths: LearningPath[] }) {
  const { t, locale } = useI18n();
  const { percent } = useLearnProgress();
  const canonical = `${SITE}${localizePath("/learn", locale)}`;
  return (
    <Container className="py-12 sm:py-16">
      <NextSeo title={t("learn.seoTitle")} description={t("learn.lead")} canonical={canonical} openGraph={{ url: canonical, title: t("learn.seoTitle"), description: t("learn.lead") }} />
      <SectionLabel>{t("learn.heading")}</SectionLabel>
      <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">{t("learn.heading")}</h1>
      <p className="mt-3 max-w-prose text-lead text-ink-500">{t("learn.lead")}</p>
      {locale === "en" && <p className="mt-2 text-sm text-ink-500">{t("learn.viOnly")}</p>}
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => {
          const info = percent(p);
          return (
            <li key={p.slug} data-path-card className="relative flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5">
              <h2 className="text-xl font-semibold text-ink-900">
                <AppLink href={`/learn/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {p.title}
                </AppLink>
              </h2>
              <p className="text-sm text-ink-500">{p.description}</p>
              <p className="mt-auto text-sm font-medium text-ink-700">
                {t("learn.meta").replace("{lessons}", String(p.stats.total)).replace("{minutes}", String(p.stats.minutes))}
                {p.stats.videos > 0 ? ` · ${t("learn.videoCount").replace("{n}", String(p.stats.videos))}` : ""}
              </p>
              {info.done > 0 && (
                <p className="text-sm font-medium text-blue-700">
                  {info.complete ? t("learn.completed") : t("learn.progress").replace("{done}", String(info.done)).replace("{total}", String(info.total))}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

export default LearnIndex;
