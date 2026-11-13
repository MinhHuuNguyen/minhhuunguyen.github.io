import { SITE } from "./seo.mjs";

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
