/**
 * Bình luận giscus (GitHub Discussions): hàm thuần, chạy được ở trình duyệt lẫn lúc build.
 * Đọc file cấu hình nằm ở comments-config.mjs (chỉ dùng lúc build).
 */

export const GISCUS_ORIGIN = "https://giscus.app";
/** id của <giscus-widget>; giscus gắn "#giscus-thread" vào URL quay về sau khi đăng nhập GitHub. */
export const WIDGET_ID = "giscus-thread";
/** Khóa localStorage giscus dùng để giữ phiên đăng nhập (giá trị là chuỗi JSON). */
export const SESSION_KEY = "giscus-session";
export const REPORT_TITLE_MAX = 120;
const REPO_RE = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const TEMPLATE_RE = /^[a-z0-9._-]+\.ya?ml$/;

/**
 * Script inline đặt đầu <head> (_document.tsx). Khi trang mở với ?giscus=<phiên> (vừa đăng nhập GitHub xong),
 * script lưu phiên vào localStorage đúng định dạng giscus đọc, rồi xóa tham số khỏi URL (giữ query khác và hash).
 * Script chạy trước GA và AdSense (afterInteractive), nên mã phiên không lọt vào số liệu hay request quảng cáo.
 */
export const SESSION_HANDOFF_SCRIPT =
  '(function(){try{var u=new URL(location.href),s=u.searchParams.get("giscus");if(s===null)return;' +
  'u.searchParams.delete("giscus");try{localStorage.setItem("giscus-session",JSON.stringify(s))}catch(e){}' +
  'history.replaceState(history.state,"",u.pathname+u.search+u.hash)}catch(e){}})();';

/** Khóa thread của bài VI: `comments_key` (frontmatter) nếu có, không thì đường dẫn file so với posts/. Không phụ thuộc tiêu đề. */
export function commentsKey(post) {
  const override = typeof post.commentsKey === "string" ? post.commentsKey.trim() : "";
  return override || post.relPath;
}

/** Hai bài VI cùng khóa sẽ dùng chung một thread: dừng build. */
export function assertUniqueCommentKeys(posts) {
  const seen = new Map();
  for (const p of posts) {
    const key = commentsKey(p);
    if (seen.has(key)) throw new Error(`khóa bình luận trùng "${key}": ${seen.get(key)} và ${p.relPath}`);
    seen.set(key, p.relPath);
  }
}

/** Kiểm cấu hình src/utils/data/comments.json. Trả { config, errors }; config là null khi có lỗi. */
export function validateCommentsConfig(raw) {
  const c = raw && typeof raw === "object" ? raw : {};
  const r = c.report && typeof c.report === "object" ? c.report : {};
  const errors = [];
  if (typeof c.enabled !== "boolean") errors.push("enabled phải là true hoặc false");
  if (typeof c.repo !== "string" || !REPO_RE.test(c.repo)) errors.push('repo phải có dạng "owner/name"');
  for (const k of ["repoId", "categoryId"]) if (typeof c[k] !== "string") errors.push(`${k} phải là chuỗi ("" khi chưa có)`);
  if (typeof c.category !== "string" || c.category.trim() === "") errors.push("category không được rỗng");
  if (c.exclude !== undefined && !(Array.isArray(c.exclude) && c.exclude.every((x) => typeof x === "string"))) errors.push("exclude phải là mảng chuỗi");
  if (typeof r.template !== "string" || !TEMPLATE_RE.test(r.template)) errors.push("report.template phải là tên file .yml trong .github/ISSUE_TEMPLATE");
  for (const l of ["vi", "en"]) if (typeof r.titlePrefix?.[l] !== "string") errors.push(`report.titlePrefix.${l} phải là chuỗi`);
  if (errors.length) return { config: null, errors };
  return {
    config: {
      enabled: c.enabled,
      repo: c.repo,
      repoId: c.repoId.trim(),
      category: c.category.trim(),
      categoryId: c.categoryId.trim(),
      exclude: c.exclude ?? [],
      report: { template: r.template, titlePrefix: { vi: r.titlePrefix.vi, en: r.titlePrefix.en } },
    },
    errors,
  };
}

/** Đã có id repo và id category để nạp giscus. */
export const isReady = (config) => config.repoId !== "" && config.categoryId !== "";

/**
 * Link mở issue form báo lỗi, điền sẵn tiêu đề, link bài và file nguồn.
 * Không dùng tham số labels: người không có quyền gắn nhãn sẽ gặp trang 404. Nhãn do template tự gắn.
 */
export function reportUrl(config, { locale, title, pageUrl, sourceFile }) {
  const chars = Array.from(title); // đếm theo code point: không cắt đôi emoji hay ký tự ngoài BMP
  const short = chars.length > REPORT_TITLE_MAX ? `${chars.slice(0, REPORT_TITLE_MAX - 1).join("")}…` : title;
  const query = new URLSearchParams({
    template: config.report.template,
    title: `${config.report.titlePrefix[locale]}${short}`,
    page_url: pageUrl,
    source_file: sourceFile,
  });
  return `https://github.com/${config.repo}/issues/new?${query}`;
}

/** Props cho khối thảo luận của một trang bài. `post` luôn là bài VI (trang EN truyền bài VI gốc). Null khi tắt hoặc bài bị loại. */
export function commentsProps({ config, post, locale, title, pageUrl, sourceFile, backLink }) {
  const term = commentsKey(post);
  if (!config.enabled || config.exclude.includes(term)) return null;
  return {
    term,
    repo: config.repo,
    repoId: config.repoId,
    category: config.category,
    categoryId: config.categoryId,
    ready: isReady(config),
    backLink,
    reportUrl: reportUrl(config, { locale, title, pageUrl, sourceFile }),
    discussionsUrl: `https://github.com/${config.repo}/discussions`,
  };
}

/** Tin giscus gửi lên trang (emitMetadata). Chỉ nhận từ giscus.app; trả số bình luận (gồm trả lời) và URL thread trên GitHub. */
export function parseGiscusMessage(event) {
  if (!event || event.origin !== GISCUS_ORIGIN) return null;
  const d = event.data?.giscus?.discussion;
  if (!d || typeof d.url !== "string" || !d.url.startsWith("https://github.com/")) return null;
  const count = (Number(d.totalCommentCount) || 0) + (Number(d.totalReplyCount) || 0);
  return { count, url: d.url };
}

/** Vừa quay về từ GitHub sau khi đăng nhập (#giscus-thread, hoặc ?giscus= còn sót) hoặc link trỏ thẳng tới phần thảo luận: nạp ngay. */
export function wantsImmediateMount(search, hash) {
  return new URLSearchParams(search).has("giscus") || hash === `#${WIDGET_ID}` || hash === "#comments";
}
