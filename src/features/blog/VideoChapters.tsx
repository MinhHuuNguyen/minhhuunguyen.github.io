import { useI18n } from "@/libs/i18n/I18nContext";
import { seekTo } from "@/lib/youtube-control";
import type { PostVideoClip } from "@/lib/seo.mjs";

export const formatClock = (s: number): string => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/** Tua video đầu tiên trong thân bài tới giây `start` rồi cuộn tới video. */
export function seekPostVideo(start: number): boolean {
  const iframe = document.querySelector<HTMLIFrameElement>("#content iframe");
  if (!iframe) return false;
  seekTo(iframe, start);
  iframe.scrollIntoView({ behavior: "smooth", block: "center" });
  return true;
}

/** Chương video lấy từ frontmatter `video.clips`. */
export function VideoChapters({ clips, className }: { clips: PostVideoClip[]; className?: string }) {
  const { t } = useI18n();
  if (!clips?.length) return null;
  return (
    <section aria-label={t("post.chapters")} className={className}>
      <h2 className="mb-2 px-3 text-[13px] font-semibold uppercase tracking-[.06em] text-ink-500">{t("post.chapters")}</h2>
      <ul className="space-y-1">
        {clips.map((c) => (
          <li key={`${c.start}-${c.name}`}>
            <button
              type="button"
              onClick={() => seekPostVideo(c.start)}
              className="flex w-full gap-3 rounded-lg px-3 py-1.5 text-left text-[14px] text-ink-700 transition hover:bg-surface-100"
            >
              <span className="font-mono text-blue-700">{formatClock(c.start)}</span>
              <span>{c.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
