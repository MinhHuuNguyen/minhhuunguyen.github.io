// Quyết định bài nào có bản PDF và PDF nằm ở đâu. Dùng chung cho scripts/build-pdfs.mjs và giao diện (nút "Tải PDF").

/** Slug không có PDF dù không phải series: README hồ sơ GitHub (toàn badge/ảnh động), PDF vô nghĩa. */
export const PDF_EXCLUDED_SLUGS = ["my-github-stats"];

/** Bài mục lục series (tag "series") chỉ là danh sách link nên không có PDF. */
export function hasPdf(post) {
  if (!post || !post.slug) return false;
  if ((post.tags ?? []).includes("series")) return false;
  return !PDF_EXCLUDED_SLUGS.includes(post.slug);
}

/** Đường dẫn công khai của PDF (bắt đầu bằng "/", không gồm basePath). */
export const pdfHref = (slug, locale) => (locale === "en" ? `/pdf/en/${slug}.pdf` : `/pdf/${slug}.pdf`);

/** Đường dẫn file trong thư mục xuất, ví dụ out/pdf/<slug>.pdf. */
export const pdfFile = (slug, locale) => (locale === "en" ? `pdf/en/${slug}.pdf` : `pdf/${slug}.pdf`);

/** Trả về href PDF của bài hoặc null nếu bài không có PDF. */
export const pdfHrefFor = (post, locale) => (hasPdf(post) ? pdfHref(post.slug, locale) : null);

/** Mọi bài đủ điều kiện, VI trước rồi EN: [{ locale, slug, post }]. `data` là kết quả getSiteData(). */
export function eligiblePosts(data) {
  const vi = data.postsSummary.filter(hasPdf).map((p) => ({ locale: "vi", slug: p.slug, post: data.postBySlug(p.slug) }));
  const en = data.en.posts.filter(hasPdf).map((p) => ({ locale: "en", slug: p.slug, post: p }));
  return [...vi, ...en];
}
