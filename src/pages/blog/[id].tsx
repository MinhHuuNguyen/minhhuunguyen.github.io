import type { GetStaticPaths } from "next";
import { DefaultSeo, NextSeo } from "next-seo";
import "katex/dist/katex.min.css";
import { SEO } from "@/configs/seo.config";
import JsonLd from "@/components/seo/JsonLd";
import { AdsScript } from "@/features/ads/AdsScript";
import { PostLayout, type PostPageProps } from "@/features/blog/PostLayout";
import { AD_PACKAGES, planInArticleAds } from "@/lib/ads.mjs";
import { lessonNav as buildLessonNav, type LearningPath } from "@/lib/learn.mjs";
import { renderPost } from "@/lib/render.mjs";
import { relatedPosts } from "@/lib/related.mjs";
import { SITE, blogPostingLd, videoObjectLd } from "@/lib/seo.mjs";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";
import adsConfig from "@/utils/data/ads.json";

type Props = PostPageProps & { navCounts: { videos: number }; alternates?: { vi: string; en: string } };

export default function Blog({ post, sections, toc, adPlan, video, related, lessonNav }: Props) {
  const url = `${SITE}/blog/${post.slug}`;
  const structuredData = [blogPostingLd(post, url), ...(video ? [videoObjectLd(video, url)] : [])];
  return (
    <>
      <DefaultSeo {...SEO} title={post.title} />
      <NextSeo
        canonical={url}
        description={post.description}
        openGraph={{
          url,
          type: "article",
          title: post.title,
          description: post.description,
          images: post.banner_url ? [{ url: post.banner_url }] : [],
        }}
      />
      <JsonLd data={structuredData} />
      <AdsScript />
      <PostLayout post={post} sections={sections} toc={toc} adPlan={adPlan} video={video} related={related} lessonNav={lessonNav} />
    </>
  );
}

// Mọi bài đã publish đều có trang riêng.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getSiteData()
    .postsSummary.filter((p) => p.slug !== "")
    .map((p) => ({ params: { id: p.slug } })),
  fallback: false,
});

export const getStaticProps = withLocale<Props>("vi", async ({ params }) => {
  const data = getSiteData();
  const post = data.postBySlug(String(params?.id));
  if (!post) return { notFound: true };
  const { sections, toc } = renderPost(post.content ?? "");
  const paths = data.paths as LearningPath[];
  const pathOfSlug = (slug: string) => paths.find((p) => p.lessons.some((l) => l.slug === slug))?.slug ?? null;
  const nav = buildLessonNav(paths, post.slug);
  const lessons = nav ? paths.find((p) => p.slug === nav.path.slug)?.lessons ?? [] : [];
  const relatedSlugs = relatedPosts(post, data.postsSummary, pathOfSlug, 3);
  return {
    props: withNav({
      post: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        banner_url: post.banner_url,
        time: post.time,
        tags: post.tags ?? [],
        readingMinutes: post.readingMinutes,
      },
      sections,
      toc,
      adPlan: planInArticleAds(sections, AD_PACKAGES[adsConfig.package as keyof typeof AD_PACKAGES]),
      video: post.video ?? null,
      related: relatedSlugs.map((s) => data.postsSummary.find((p) => p.slug === s)!),
      lessonNav: nav ? { ...nav, lessons: lessons.map((l) => ({ slug: l.slug, available: l.available })) } : null,
      // Chỉ bài đã có bản dịch mới khai báo hreflang/nút ngôn ngữ theo cặp.
      ...(data.postPairs.viToEn[post.slug] ? { alternates: { vi: `/blog/${post.slug}`, en: `/en/blog/${data.postPairs.viToEn[post.slug]}` } } : {}),
    }),
  };
});
