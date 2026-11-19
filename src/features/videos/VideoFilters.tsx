import clsx from "clsx";
import { useI18n } from "@/libs/i18n/I18nContext";
import type { VideoPlatform } from "@/lib/videos.mjs";

export type VideoFilter = "all" | VideoPlatform;

const OPTIONS: { value: VideoFilter; key: string }[] = [
  { value: "all", key: "videos.filterAll" },
  { value: "youtube", key: "videos.filterYoutube" },
  { value: "youtube_short", key: "videos.filterShorts" },
  { value: "tiktok", key: "videos.filterTiktok" },
];

export function VideoFilters({ value, onChange, available }: { value: VideoFilter; onChange: (v: VideoFilter) => void; available: Set<VideoPlatform> }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={t("videos.filterLabel")} className="flex flex-wrap gap-2">
      {OPTIONS.filter((o) => o.value === "all" || available.has(o.value)).map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "rounded-pill px-4 py-2 text-sm font-semibold transition",
            value === o.value ? "bg-pill-dark text-white" : "bg-white text-ink-900 shadow-card hover:-translate-y-0.5",
          )}
        >
          {t(o.key)}
        </button>
      ))}
    </div>
  );
}

export default VideoFilters;
