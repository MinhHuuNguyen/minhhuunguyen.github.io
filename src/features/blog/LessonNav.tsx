import { AppLink } from "@/components/ui/AppLink";
import { useLearnProgress } from "@/features/learn/useLearnProgress";
import { useI18n } from "@/libs/i18n/I18nContext";
import { pathProgress } from "@/lib/progress.mjs";
import type { LessonNav as LessonNavData } from "@/lib/learn.mjs";

export type LessonNavProps = LessonNavData & { lessons: { slug: string; available: boolean }[] };

/** Bài trước / Bài tiếp trong lộ trình và nút đánh dấu đã học (lưu ở localStorage). */
export function LessonNav({ nav, slug }: { nav: LessonNavProps; slug: string }) {
  const { t } = useI18n();
  const { progress, available, mark } = useLearnProgress();
  const path = { slug: nav.path.slug, lessons: nav.lessons };
  const done = !!progress.paths[path.slug]?.[slug];
  const { done: doneCount, total } = pathProgress(progress, path);
  return (
    <aside data-lesson-nav aria-label={nav.path.title} className="mt-12 rounded-card bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AppLink href={`/learn/${nav.path.slug}`} className="text-[15px] font-semibold text-blue-700 hover:underline">
          {nav.path.title}
        </AppLink>
        <span className="text-[13px] text-ink-500">{t("post.progress").replace("{done}", String(doneCount)).replace("{total}", String(total))}</span>
      </div>
      <button
        type="button"
        aria-pressed={done}
        onClick={() => mark(path, slug, !done)}
        className="mt-4 inline-flex rounded-pill bg-pill-blue px-5 py-2 text-[14px] font-semibold text-white aria-pressed:bg-none aria-pressed:bg-surface-100 aria-pressed:text-ink-900"
      >
        {done ? t("post.done") : t("post.markDone")}
      </button>
      {!available && <p className="mt-2 text-[13px] text-ink-500">{t("post.storageOff")}</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {nav.prev ? (
          <AppLink href={`/blog/${nav.prev.slug}`} localize={false} className="rounded-lg border border-line p-3 transition hover:bg-surface-100">
            <span className="block text-[12px] uppercase tracking-[.06em] text-ink-500">{t("post.prev")}</span>
            <span className="text-[15px] font-semibold text-ink-900">{nav.prev.title ?? nav.prev.label}</span>
          </AppLink>
        ) : (
          <span />
        )}
        {nav.next ? (
          <AppLink href={`/blog/${nav.next.slug}`} localize={false} className="rounded-lg border border-line p-3 text-right transition hover:bg-surface-100 sm:col-start-2">
            <span className="block text-[12px] uppercase tracking-[.06em] text-ink-500">{t("post.next")}</span>
            <span className="text-[15px] font-semibold text-ink-900">{nav.next.title ?? nav.next.label}</span>
          </AppLink>
        ) : null}
      </div>
    </aside>
  );
}
