import { useCallback, useEffect, useRef, useState } from "react";
import { List } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { useI18n } from "@/libs/i18n/I18nContext";
import type { TocItem } from "@/lib/render.mjs";

/** Mục đang đọc: IntersectionObserver trên các heading; bấm vào mục thì giữ tạm để không bị nhảy trong lúc cuộn. */
export function useActiveHeading(toc: TocItem[]): [string | null, (id: string) => void] {
  const [active, setActive] = useState<string | null>(toc[0]?.id ?? null);
  const lockUntil = useRef(0);
  useEffect(() => {
    if (toc.length < 2 || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        if (Date.now() < lockUntil.current) return;
        const first = toc.find((t) => visible.has(t.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-96px 0px -70% 0px" },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [toc]);
  const pick = useCallback((id: string) => {
    lockUntil.current = Date.now() + 1500;
    setActive(id);
  }, []);
  return [active, pick];
}

function TocList({ toc, active, onPick }: { toc: TocItem[]; active: string | null; onPick: (id: string) => void }) {
  return (
    <ol className="space-y-1 text-[14px] leading-snug">
      {toc.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
          <a
            href={`#${item.id}`}
            aria-current={active === item.id ? "true" : undefined}
            onClick={() => onPick(item.id)}
            className="block rounded-lg px-3 py-1.5 text-ink-700 transition hover:bg-surface-100 aria-[current=true]:bg-blue-50 aria-[current=true]:font-semibold aria-[current=true]:text-blue-700"
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** Mục lục: "rail" là cột trái dính (≥ 1280px); "inline" là gập ở đầu bài (768–1279px) và ngăn kéo đáy (< 768px). Dưới 2 heading thì ẩn. */
export function Toc({
  toc,
  active,
  onPick,
  variant,
}: {
  toc: TocItem[];
  active: string | null;
  onPick: (id: string) => void;
  variant: "rail" | "inline";
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  if (toc.length < 2) return null;
  if (variant === "rail") {
    return (
      <nav aria-label={t("post.toc")} className="hidden max-h-[calc(100vh-14rem)] overflow-auto xl:block">
        <p className="mb-2 px-3 text-[13px] font-semibold uppercase tracking-[.06em] text-ink-500">{t("post.toc")}</p>
        <TocList toc={toc} active={active} onPick={onPick} />
      </nav>
    );
  }
  return (
    <>
      <nav aria-label={t("post.toc")} className="mb-8 hidden rounded-card bg-white p-4 shadow-card md:block xl:hidden">
        <details>
          <summary className="cursor-pointer text-[15px] font-semibold text-ink-900">{t("post.toc")}</summary>
          <div className="mt-3">
            <TocList toc={toc} active={active} onPick={onPick} />
          </div>
        </details>
      </nav>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 inline-flex items-center gap-2 rounded-pill bg-pill-dark px-4 py-3 text-[14px] font-semibold text-white shadow-card md:hidden"
      >
        <List size={18} aria-hidden="true" />
        {t("post.toc")}
      </button>
      <Sheet side="bottom" open={open} onOpenChange={setOpen} title={t("post.toc")}>
        <nav aria-label={t("post.toc")}>
          <TocList
            toc={toc}
            active={active}
            onPick={(id) => {
              onPick(id);
              setOpen(false);
            }}
          />
        </nav>
      </Sheet>
    </>
  );
}
