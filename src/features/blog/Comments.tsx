import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Giscus from "@giscus/react";
import { useI18n } from "@/libs/i18n/I18nContext";
import { track } from "@/lib/analytics";
import { WIDGET_ID, parseGiscusMessage, wantsImmediateMount, type CommentsProps } from "@/lib/comments.mjs";

/**
 * Phần thảo luận dưới bài: giscus trên GitHub Discussions (repo site, category "General").
 * Chỉ nạp iframe khi người đọc cuộn gần tới, hoặc ngay khi vừa quay về từ trang đăng nhập GitHub.
 */
export function Comments({ term, repo, repoId, category, categoryId, ready, backLink, reportUrl, discussionsUrl }: CommentsProps) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [meta, setMeta] = useState<{ count: number; url: string } | null>(null);

  // Mỗi bài một thread: sang bài khác bằng điều hướng phía client thì quay về trạng thái chưa nạp.
  useEffect(() => {
    setMeta(null);
    setVisible(false);
    const el = ref.current;
    if (!el) return;
    if (wantsImmediateMount(window.location.search, window.location.hash)) {
      setVisible(true);
      el.scrollIntoView();
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [term]);

  useEffect(() => {
    if (visible && ready) track("comments_view", { lang: locale });
  }, [visible, ready, locale]);

  // giscus gửi số bình luận và URL thread lên trang (emitMetadata="1").
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const m = parseGiscusMessage(e);
      if (m) setMeta(m);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section ref={ref} id="comments" data-comments data-comments-term={term} aria-labelledby="comments-title" className="mt-12 scroll-mt-24">
      <Head>
        <meta key="giscus-backlink" name="giscus:backlink" content={backLink} />
      </Head>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="comments-title" className="text-2xl font-bold text-ink-900">
          {t("comments.title")}
          {meta ? <span className="font-semibold text-ink-500"> · {meta.count}</span> : null}
        </h2>
        <a
          href={reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-comments-report
          onClick={() => track("comments_report_click", { lang: locale })}
          className="text-[14px] font-semibold text-blue-700 hover:underline"
        >
          {t("comments.report")}
        </a>
      </div>
      <p className="mt-2 text-[14px] text-ink-500">{t("comments.hint")}</p>
      {ready ? (
        <div className="mt-4 min-h-[160px] rounded-card bg-white p-4 shadow-card">
          {visible ? (
            <Giscus
              key={`${term}:${locale}`}
              id={WIDGET_ID}
              repo={repo as `${string}/${string}`}
              repoId={repoId}
              category={category}
              categoryId={categoryId}
              mapping="specific"
              term={term}
              strict="1"
              reactionsEnabled="1"
              emitMetadata="1"
              inputPosition="bottom"
              theme="noborder_light"
              lang={locale}
              loading="lazy"
            />
          ) : null}
        </div>
      ) : null}
      <noscript>
        <p className="mt-4 text-[15px] text-ink-700">
          {t("comments.noscript")}{" "}
          <a href={discussionsUrl} className="font-semibold text-blue-700 underline">
            GitHub Discussions
          </a>
        </p>
      </noscript>
      <p className="mt-2 text-[13px] text-ink-500">
        <a href={meta?.url ?? discussionsUrl} target="_blank" rel="noopener noreferrer" data-comments-github className="hover:underline">
          {t("comments.openOnGithub")}
        </a>
      </p>
    </section>
  );
}
