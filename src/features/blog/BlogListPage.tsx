import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import { Search } from "lucide-react";
import clsx from "clsx";
import { AppLink } from "@/components/ui/AppLink";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/Chip";
import { useSearch } from "@/features/search/SearchProvider";
import { useI18n } from "@/libs/i18n/I18nContext";
import { localizePath } from "@/lib/locale-routes.mjs";
import { SITE } from "@/lib/seo.mjs";
import { PostCard, type PostCardData } from "./PostCard";

export type PostListItem = PostCardData & { isHighlight: boolean };
export type PathSummary = { slug: string; title: string; description: string; stats: { total: number; minutes: number } };
export type BlogListProps = {
  posts: PostListItem[];
  paths: PathSummary[];
  topTags: { tag: string; count: number }[];
};

const PAGE_SIZE = 24;

export function BlogListPage({ posts, paths, topTags }: BlogListProps) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { open } = useSearch();
  const tag = typeof router.query.tag === "string" ? router.query.tag : null;
  const [limit, setLimit] = useState(PAGE_SIZE);
  useEffect(() => setLimit(PAGE_SIZE), [tag]);

  // Bài nổi bật trước, rồi theo ngày (posts đã sắp theo ngày giảm dần lúc build).
  const shown = useMemo(() => {
    const list = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
    return [...list.filter((p) => p.isHighlight), ...list.filter((p) => !p.isHighlight)];
  }, [posts, tag]);

  const setTag = (next: string | null) => {
    const query = next ? { tag: next } : {};
    void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true, scroll: false });
  };
  const canonical = `${SITE}${localizePath("/blog", locale)}`;

  return (
    <Container className="py-12 sm:py-16">
      <NextSeo title={t("blog.seoTitle")} canonical={canonical} openGraph={{ url: canonical, title: t("blog.seoTitle") }} />
      <SectionLabel>{t("blog.title")}</SectionLabel>
      <h1 className="mt-4 text-4xl font-semibold text-ink-900 sm:text-5xl">{t("blog.title")}</h1>
      <p className="mt-3 text-lead text-ink-500">{t("blog.count").replace("{n}", String(posts.length))}</p>
      {locale === "en" && <p className="mt-2 text-sm text-ink-500">{t("blog.enComing")}</p>}

      <button
        type="button"
        onClick={() => open("blog_field")}
        className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-pill border border-line bg-white px-5 py-3 text-left text-[15px] text-ink-500 shadow-card transition hover:border-blue-500"
      >
        <Search size={18} aria-hidden="true" />
        {t("blog.search")}
      </button>

      <section aria-label={t("blog.topics")} className="mt-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <button
              type="button"
              aria-pressed={tag === null}
              onClick={() => setTag(null)}
              className="rounded-pill bg-white px-4 py-1.5 text-[14px] font-medium text-ink-700 shadow-card aria-pressed:bg-blue-500 aria-pressed:text-white"
            >
              {t("blog.all")}
            </button>
          </li>
          {topTags.map((x) => (
            <li key={x.tag}>
              <button
                type="button"
                aria-pressed={tag === x.tag}
                onClick={() => setTag(tag === x.tag ? null : x.tag)}
                className="group rounded-pill bg-white px-4 py-1.5 text-[14px] font-medium text-ink-700 shadow-card aria-pressed:bg-blue-500 aria-pressed:text-white"
              >
                {x.tag} <span className="text-ink-500 group-aria-pressed:text-white">{x.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="blog-paths" className="mt-12">
        <h2 id="blog-paths" className="mb-4 text-2xl font-bold text-ink-900">
          {t("blog.paths")}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p) => (
            <li key={p.slug} data-path-card className="relative flex flex-col gap-2 rounded-card bg-white p-5 shadow-card transition hover:-translate-y-0.5">
              <h3 className="text-[16px] font-semibold leading-snug text-ink-900">
                <AppLink href={`/learn/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {p.title}
                </AppLink>
              </h3>
              <p className="mt-auto text-[13px] text-ink-500">
                {t("learn.meta").replace("{lessons}", String(p.stats.total)).replace("{minutes}", String(p.stats.minutes))}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <ul className={clsx("mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
        {shown.slice(0, limit).map((p, i) => (
          <PostCard key={p.slug} post={p} featured={i === 0 && !tag && p.isHighlight} />
        ))}
      </ul>
      {limit < shown.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setLimit((n) => n + PAGE_SIZE)}
            className="rounded-pill bg-pill-dark px-6 py-3 text-[15px] font-semibold text-white"
          >
            {t("blog.more")}
          </button>
        </div>
      )}
    </Container>
  );
}

export default BlogListPage;
