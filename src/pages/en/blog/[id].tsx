import type { GetStaticPaths } from "next";
import { DefaultSeo, NextSeo } from "next-seo";
import "katex/dist/katex.min.css";
import { SEO } from "@/configs/seo.config";
import JsonLd from "@/components/seo/JsonLd";
import { AdsScript } from "@/features/ads/AdsScript";
import { PostLayout, type PostPageProps } from "@/features/blog/PostLayout";
import { AD_PACKAGES, planInArticleAds } from "@/lib/ads.mjs";
import { commentsProps } from "@/lib/comments.mjs";
import { readCommentsConfig } from "@/lib/comments-config.mjs";
import { lessonNav as buildLessonNav, type LearningPath } from "@/lib/learn.mjs";
import { rewritePostLinks } from "@/lib/links.mjs";
import { pdfHrefFor } from "@/lib/pdf.mjs";
import { renderPost } from "@/lib/render.mjs";
import { relatedPosts } from "@/lib/related.mjs";
import { SITE, videoObjectLd } from "@/lib/seo.mjs";
import { blogPostingLdEn } from "@/lib/seo-extra.mjs";
import { getSiteData, withNav } from "@/lib/site-data.mjs";
import { withLocale } from "@/lib/with-locale";
import adsConfig from "@/utils/data/ads.json";
type Props = PostPageProps & { navCounts: { videos: number }; alternates: { vi: string; en: string }; viSlug: string };
export default function EnBlog({ post, sections, toc, adPlan, video, related, lessonNav, ads, viSlug, comments, pdf }: Props) {
  const url = `${SITE}/en/blog/${post.slug}`;
  const structuredData = [blogPostingLdEn(post, url, `${SITE}/blog/${viSlug}`), ...(video ? [videoObjectLd(video, url)] : [])];
  return (
    <>
      <DefaultSeo {...SEO} title={post.title} />
      <NextSeo
        canonical={url}
        description={post.description}
        openGraph={{ url, type: "article", title: post.title, description: post.description, images: post.banner_url ? [{ url: post.banner_url }] : [] }}
      />
      <JsonLd data={structuredData} />
      {ads && <AdsScript />}
      <PostLayout post={post} sections={sections} toc={toc} adPlan={adPlan} video={video} related={related} lessonNav={lessonNav} ads={ads} videoBlock comments={comments} pdf={pdf} />
    </>
  );
}
// Chỉ bài đã có bản dịch mới có route /en/blog/<slug-en>.
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getSiteData().en.posts.map((p) => ({ params: { id: p.slug } })),
  fallback: false,
});
export const getStaticProps = withLocale<Props>("en", async ({ params }) => {
  const data = getSiteData();
  const post = data.en.posts.find((p) => p.slug === String(params?.id));
  if (!post) return { notFound: true };
  const { sections: rawSections, toc } = renderPost(post.content ?? "");
  const sections = rawSections.map((s) => ({ ...s, html: rewritePostLinks(s.html, data.postPairs.viToEn) }));
  const paths = data.en.paths as LearningPath[];
  const nav = buildLessonNav(paths, post.viSlug);
  const lessons = nav ? paths.find((p) => p.slug === nav.path.slug)?.lessons ?? [] : [];
  // Bài liên quan chỉ lấy trong các bài đã dịch (cùng ngôn ngữ).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const enSummary = data.en.posts.map(({ content, video, ...rest }) => ({ ...rest, filePath: "", tags: rest.tags ?? [], hasVideo: !!video }));
  const pathOfSlug = (slug: string) => {
    const vi = data.postPairs.enToVi[slug];
    return paths.find((p) => p.lessons.some((l) => l.slug === vi))?.slug ?? null;
  };
  const relatedSlugs = relatedPosts(post, enSummary, pathOfSlug, 3);
  const ads = !!(adsConfig as { enPosts?: boolean }).enPosts;
  // Bản EN dùng chung thread với bản VI: khóa tính từ bài VI gốc.
  const viPost = data.postBySlug(post.viSlug);
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
      adPlan: ads ? planInArticleAds(sections, AD_PACKAGES[adsConfig.package as keyof typeof AD_PACKAGES]) : [],
      video: post.video ?? null,
      pdf: pdfHrefFor(post, "en"),
      related: relatedSlugs.map((s) => ({ ...enSummary.find((p) => p.slug === s)!, href: `/en/blog/${s}` })),
      lessonNav: nav ? { ...nav, lessons: lessons.map((l) => ({ slug: l.slug, available: l.available })) } : null,
      ads,
      viSlug: post.viSlug,
      alternates: { vi: `/blog/${post.viSlug}`, en: `/en/blog/${post.slug}` },
      comments: viPost
        ? commentsProps({
            config: readCommentsConfig(),
            post: viPost,
            locale: "en",
            title: post.title,
            pageUrl: `${SITE}/en/blog/${post.slug}`,
            sourceFile: `posts-en/${post.relPath}`,
            backLink: `${SITE}/blog/${post.viSlug}`,
          })
        : null,
    }),
  };
});
