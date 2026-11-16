import { AppLink } from "@/components/ui/AppLink";
import { TagChip } from "@/components/ui/Chip";
import { useI18n } from "@/libs/i18n/I18nContext";
import { formatDate } from "@/lib/format.mjs";

export type PostCardData = {
  slug: string;
  title: string;
  description: string;
  banner_url: string;
  time: string;
  tags: string[];
  readingMinutes: number;
  hasVideo: boolean;
  /** Mặc định /blog/<slug>; bài EN truyền /en/blog/<slug>. */
  href?: string;
};

/** Thẻ bài viết ở danh sách blog. Link trỏ thẳng href (mặc định /blog/<slug>), không tự gắn /en. */
export function PostCard({ post, featured = false }: { post: PostCardData; featured?: boolean }) {
  const { t, locale } = useI18n();
  return (
    <li
      data-post-card
      className={`relative flex flex-col overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-0.5 ${featured ? "sm:col-span-2" : ""}`}
    >
      {post.banner_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.banner_url} alt="" width={640} height={360} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
      ) : null}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[13px] text-ink-500">
          {formatDate(post.time, locale)} · {t("post.readingTime").replace("{n}", String(post.readingMinutes))}
        </p>
        <h3 className="text-lg font-semibold leading-snug text-ink-900">
          <AppLink href={post.href ?? `/blog/${post.slug}`} localize={false} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </AppLink>
        </h3>
        <p className="line-clamp-2 text-[14px] text-ink-700">{post.description}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {post.tags
            .filter((tag) => tag !== "series")
            .slice(0, 2)
            .map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
        </div>
      </div>
    </li>
  );
}
