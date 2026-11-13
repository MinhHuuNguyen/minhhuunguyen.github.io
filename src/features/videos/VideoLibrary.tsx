import { useMemo, useState } from "react";
import { NextSeo } from "next-seo";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Chip";
import JsonLd from "@/components/seo/JsonLd";
import { useI18n } from "@/libs/i18n/I18nContext";
import { localizePath } from "@/lib/locale-routes.mjs";
import { SITE } from "@/lib/seo.mjs";
import { videoListLd } from "@/lib/seo-extra.mjs";
import type { VideoItem } from "@/lib/videos.mjs";
import { VideoCard } from "./VideoCard";
import { VideoFilters, type VideoFilter } from "./VideoFilters";

export function VideoLibrary({ videos }: { videos: VideoItem[] }) {
  const { t, locale } = useI18n();
  const [filter, setFilter] = useState<VideoFilter>("all");
  const available = useMemo(() => new Set(videos.map((v) => v.platform)), [videos]);
  const shown = filter === "all" ? videos : videos.filter((v) => v.platform === filter);
  const canonical = `${SITE}${localizePath("/videos", locale)}`;
  return (
    <Container className="py-12 sm:py-16">
      <NextSeo title={t("videos.seoTitle")} description={t("videos.lead")} canonical={canonical} openGraph={{ url: canonical, title: t("videos.seoTitle"), description: t("videos.lead") }} />
      {videos.length > 0 && <JsonLd data={[videoListLd(videos, canonical)]} />}
      <SectionLabel>{t("videos.seoTitle")}</SectionLabel>
      <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">{t("videos.heading")}</h1>
      <p className="mt-3 max-w-prose text-lead text-ink-500">{t("videos.lead")}</p>
      {videos.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-8 text-center text-ink-700 shadow-card">{t("videos.empty")}</p>
      ) : (
        <>
          <div className="mt-8">
            <VideoFilters value={filter} onChange={setFilter} available={available} />
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((v) => (
              <VideoCard key={v.key} video={v} />
            ))}
          </ul>
        </>
      )}
    </Container>
  );
}

export default VideoLibrary;
