import type { ReactNode } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { Container } from "@/components/ui/Container";
import { TagChip } from "@/components/ui/Chip";
import { AdRail } from "@/features/ads/AdRail";
import { AdSlot } from "@/features/ads/AdSlot";
import { useI18n } from "@/libs/i18n/I18nContext";
import { formatDate } from "@/lib/format.mjs";
import type { PostVideo } from "@/lib/seo.mjs";
import type { PostSection, TocItem } from "@/lib/render.mjs";
import type { PostSummary } from "@/lib/site-data.mjs";
import { AskAboutPost } from "./AskAboutPost";
import { LessonNav, type LessonNavProps } from "./LessonNav";
import { PostSections } from "./PostSections";
import { ReadingProgress } from "./ReadingProgress";
import { RelatedPosts } from "./RelatedPosts";
import { Toc, useActiveHeading } from "./Toc";
import { VideoBlock } from "./VideoBlock";
import { VideoChapters } from "./VideoChapters";

export type PostHead = {
  slug: string;
  title: string;
  description: string;
  banner_url: string;
  time: string;
  tags: string[];
  readingMinutes: number;
};

export type PostPageProps = {
  post: PostHead;
  sections: PostSection[];
  toc: TocItem[];
  adPlan: number[];
  video: PostVideo | null;
  related: PostSummary[];
  lessonNav: LessonNavProps | null;
  /** false: không quảng cáo (mặc định true). */
  ads?: boolean;
  /** true: dựng khối video từ `video` (bài EN; bài VI có khối video trong nội dung). */
  videoBlock?: boolean;
};

/** Bố cục trang bài: mục lục 240px / bài ≤ 720px / quảng cáo 300px (≥ 1280px); hẹp hơn thì một cột. */
export function PostLayout({ post, sections, toc, adPlan, video, related, lessonNav, ads = true, videoBlock = false }: PostPageProps): ReactNode {
  const { t, locale } = useI18n();
  const [active, pick] = useActiveHeading(toc);
  const clips = video?.clips ?? [];
  return (
    <>
      <ReadingProgress />
      <Container size="wide" className="py-8 lg:py-12">
        <div className={ads ? "xl:grid xl:grid-cols-[240px_minmax(0,720px)_300px] xl:justify-center xl:gap-10" : "xl:grid xl:grid-cols-[240px_minmax(0,720px)] xl:justify-center xl:gap-10"}>
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
              <Toc toc={toc} active={active} onPick={pick} variant="rail" />
              <VideoChapters clips={clips} className="hidden xl:block" />
              <AskAboutPost slug={post.slug} title={post.title} />
            </div>
          </aside>
          <article className="mx-auto w-full min-w-0 max-w-prose xl:mx-0">
            <nav aria-label="breadcrumb" className="mb-4 text-[14px] text-ink-500">
              <AppLink href="/blog" className="hover:underline">
                {t("nav.blog")}
              </AppLink>
              {lessonNav && (
                <>
                  {" / "}
                  <AppLink href={`/learn/${lessonNav.path.slug}`} className="hover:underline">
                    {lessonNav.path.title}
                  </AppLink>
                </>
              )}
            </nav>
            <h1 className="text-[clamp(28px,4vw,44px)] font-extrabold leading-tight tracking-[-0.02em] text-ink-900">{post.title}</h1>
            {post.description && <p className="mt-3 text-lead italic text-ink-700">{post.description}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[14px] text-ink-500">
              <span>{formatDate(post.time, locale)}</span>
              <span aria-hidden="true">·</span>
              <span>{t("post.readingTime").replace("{n}", String(post.readingMinutes))}</span>
              {post.tags
                .filter((tag) => tag !== "series")
                .map((tag) => (
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
            </div>
            {post.banner_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.banner_url}
                alt=""
                width={1280}
                height={720}
                fetchPriority="high"
                className="my-6 aspect-video w-full rounded-card object-cover"
              />
            )}
            <Toc toc={toc} active={active} onPick={pick} variant="inline" />
            <VideoChapters clips={clips} className="mb-6 rounded-card bg-white p-3 shadow-card xl:hidden" />
            <PostSections sections={sections} adPlan={ads ? adPlan : []} lead={videoBlock && video ? <VideoBlock video={video} /> : undefined} />
            {lessonNav && <LessonNav nav={lessonNav} slug={post.slug} />}
            <div className="mt-8 xl:hidden">
              <AskAboutPost slug={post.slug} title={post.title} />
            </div>
            <RelatedPosts posts={related} />
            {ads && <AdSlot slot="multiplex" />}
          </article>
          {ads && <AdRail />}
        </div>
      </Container>
    </>
  );
}
