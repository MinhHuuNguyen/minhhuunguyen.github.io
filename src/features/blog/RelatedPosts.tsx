import { AppLink } from "@/components/ui/AppLink";
import { useI18n } from "@/libs/i18n/I18nContext";
import { formatDate } from "@/lib/format.mjs";
import type { PostSummary } from "@/lib/site-data.mjs";

/** 3 bài liên quan (đã chọn lúc build bằng relatedPosts). */
export function RelatedPosts({ posts }: { posts: PostSummary[] }) {
  const { t, locale } = useI18n();
  if (!posts.length) return null;
  return (
    <section data-related aria-labelledby="related-title" className="mt-12">
      <h2 id="related-title" className="mb-4 text-2xl font-bold text-ink-900">
        {t("post.related")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <AppLink
              href={`/blog/${p.slug}`}
              localize={false}
              className="block h-full overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-0.5"
            >
              {p.banner_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.banner_url} alt="" width={640} height={360} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
              ) : null}
              <div className="p-4">
                <p className="line-clamp-3 text-[15px] font-semibold text-ink-900">{p.title}</p>
                <p className="mt-2 text-[13px] text-ink-500">
                  {formatDate(p.time, locale)}
                </p>
              </div>
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
