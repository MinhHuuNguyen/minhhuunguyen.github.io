/** Đổi link tới bài VI đã có bản EN sang /en/blog/<slug-en> (giữ #hash); bài chưa dịch giữ nguyên. */
export const rewritePostLinks = (html, viToEn) =>
  html.replace(/href="\/blog\/([a-z0-9-]+)(#[^"]*)?"/g, (m, vi, hash = "") => (viToEn[vi] ? `href="/en/blog/${viToEn[vi]}${hash}"` : m));
