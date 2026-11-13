import { Fragment, useEffect, useRef, type MouseEvent } from "react";
import { AdSlot } from "@/features/ads/AdSlot";
import { track } from "@/lib/analytics";
import { listen, seekTo } from "@/lib/youtube-control";
import type { PostSection } from "@/lib/render.mjs";

const idOf = (iframe: HTMLIFrameElement) => iframe.getAttribute("src")?.match(/\/embed\/([A-Za-z0-9_-]{11})/)?.[1] ?? "";

/** Thân bài: mỗi section là một khối HTML đã sanitize lúc build; quảng cáo xen sau các section trong adPlan. */
export function PostSections({ sections, adPlan }: { sections: PostSection[]; adPlan: number[] }) {
  const root = useRef<HTMLDivElement>(null);

  // video_play: bắt thông điệp onStateChange của từng iframe YouTube (state 1 = đang phát), mỗi iframe báo một lần.
  useEffect(() => {
    const offs = Array.from(root.current?.querySelectorAll<HTMLIFrameElement>("iframe") ?? []).map((f) => {
      let sent = false;
      return listen(f, (state) => {
        if (state !== 1 || sent) return;
        sent = true;
        track("video_play", { platform: "youtube", video_id: idOf(f), location: "post" });
      });
    });
    return () => offs.forEach((off) => off());
  }, [sections]);

  // Link watch?v=<id>&t=<n>s trong khối video: tua tại chỗ thay vì mở YouTube.
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest?.("a");
    if (!a) return;
    let url: URL;
    try {
      url = new URL(a.href);
    } catch {
      return;
    }
    if (!/(^|\.)youtube\.com$/.test(url.hostname) || url.pathname !== "/watch") return;
    const iframe = Array.from(root.current?.querySelectorAll<HTMLIFrameElement>("iframe") ?? []).find((f) => idOf(f) === url.searchParams.get("v"));
    const start = parseInt(url.searchParams.get("t") ?? "", 10);
    if (!iframe || Number.isNaN(start)) return;
    e.preventDefault();
    seekTo(iframe, start);
    iframe.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div id="content" ref={root} onClick={onClick} className="post-body prose prose-lg max-w-none text-ink-900">
      {sections.map((s, i) => (
        <Fragment key={i}>
          <section data-post-section dangerouslySetInnerHTML={{ __html: s.html }} />
          {adPlan.includes(i) && <AdSlot slot="inArticle" index={adPlan.indexOf(i)} />}
        </Fragment>
      ))}
    </div>
  );
}
