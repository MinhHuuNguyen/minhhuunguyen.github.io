const pathOf = (href) => href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
/** Quảng cáo đang bật thật (đọc lúc build). */
export const ADS_LIVE = process.env.NEXT_PUBLIC_ADS_MODE === "live";
/** Trang có quảng cáo: đúng dạng /blog/<slug>. */
export function isAdRoute(path) { return /^\/blog\/[^/]+$/.test(pathOf(path)); }
/** true khi phải tải lại cả trang: quảng cáo đang live, link nội bộ, khác trang, và một trong hai đầu là trang bài (C4). */
export function shouldHardNavigate(currentPath, href, adsLive) {
  if (!adsLive || typeof href !== "string") return false;
  if (href.startsWith("#") || !href.startsWith("/") || href.startsWith("//")) return false;
  if (pathOf(href) === pathOf(currentPath)) return false;
  return isAdRoute(currentPath) || isAdRoute(href);
}
