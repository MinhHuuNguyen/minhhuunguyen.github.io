import { SITE, blogPostingLd } from "./seo.mjs";

const FALLBACK_THUMB = `${SITE}/img/og-default.jpg`;

/** ItemList các VideoObject cho trang kho video (tiêu đề/mô tả tiếng Việt vì inLanguage = vi). */
export function videoListLd(videos, pageUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: pageUrl,
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title.vi,
        description: v.description?.vi ?? v.title.vi,
        thumbnailUrl: [v.thumbnail ?? FALLBACK_THUMB],
        uploadDate: v.publishedAt,
        ...(v.duration ? { duration: v.duration } : {}),
        embedUrl: v.embedUrl,
        url: v.url,
        inLanguage: "vi",
      },
    })),
  };
}

/** JSON-LD Person cho trang chủ; sameAs chỉ gồm các kênh đã cấu hình (khác null). */
export function personLd(site) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.person.name.en,
    url: SITE,
    ...(site.person.roles?.en?.[0] ? { jobTitle: site.person.roles.en[0] } : {}),
    sameAs: Object.values(site.socials).filter(Boolean),
  };
}
/** BlogPosting của bài EN: inLanguage en, trỏ về bài VI gốc (nếu có). */
export function blogPostingLdEn(post, url, viUrl) {
  return {
    ...blogPostingLd(post, url),
    inLanguage: "en",
    ...(viUrl ? { translationOfWork: { "@type": "BlogPosting", url: viUrl, inLanguage: "vi" } } : {}),
  };
}
