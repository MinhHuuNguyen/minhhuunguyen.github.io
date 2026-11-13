import { ExternalLink } from "lucide-react";
import { AppLink } from "@/components/ui/AppLink";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pick } from "@/libs/i18n/pick";
import { track } from "@/lib/analytics";
import { formatDate, formatDuration } from "@/lib/format.mjs";
import type { VideoItem } from "@/lib/videos.mjs";
import { TikTokFacade } from "./TikTokFacade";
import { YouTubeFacade } from "./YouTubeFacade";

export function VideoCard({ video }: { video: VideoItem }) {
  const { t, locale } = useI18n();
  const title = pick(video.title, locale);
  const description = video.description ? pick(video.description, locale) : null;
  const channel = video.platform === "tiktok" ? "tiktok" : "youtube";
  const channelName = channel === "tiktok" ? "TikTok" : "YouTube";
  const titleId = `video-title-${video.key.replace(/[^A-Za-z0-9_-]/g, "-")}`;
  const onPlay = () => track("video_play", { platform: video.platform, video_id: video.id, location: "library" });
  const duration = video.duration ? formatDuration(video.duration) : "";
  return (
    <li data-video-card data-platform={video.platform} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card">
      {video.platform === "tiktok" ? (
        <TikTokFacade embedUrl={video.embedUrl} title={title} thumbnail={video.thumbnail} playLabel={t("videos.play")} describedBy={titleId} fallbackLabel={t("videos.noThumb")} onPlay={onPlay} />
      ) : (
        <YouTubeFacade embedUrl={video.embedUrl} title={title} thumbnail={video.thumbnail} playLabel={t("videos.play")} describedBy={titleId} vertical={video.platform === "youtube_short"} onPlay={onPlay} />
      )}
      <h2 id={titleId} className="text-lg font-semibold text-ink-900">{title}</h2>
      {description && <p className="line-clamp-2 text-sm text-ink-500">{description}</p>}
      <p className="text-sm text-ink-500">
        {formatDate(video.publishedAt, locale)}
        {duration ? ` · ${duration}` : ""}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold">
        <a
          href={video.url}
          target="_blank"
          rel="noopener"
          onClick={() => track("channel_click", { platform: channel, location: "videos" })}
          className="inline-flex items-center gap-1 text-blue-700"
        >
          {t("videos.watchOn").replace("{platform}", channelName)}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
        {video.post && (
          <AppLink href={`/blog/${video.post.slug}`} localize={false} className="text-ink-900">
            {t("videos.viewPost")}
          </AppLink>
        )}
      </div>
    </li>
  );
}

export default VideoCard;
