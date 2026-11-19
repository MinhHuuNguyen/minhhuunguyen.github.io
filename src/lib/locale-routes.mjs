export const SITE_URL = "https://minhhuunguyen.github.io";
export const localeOf = (path) => (/^\/en(?=$|[/?#])/.test(path) ? "en" : "vi");
const parts = (p) => { const m = /^([^?#]*)(.*)$/.exec(p); return [m[1] || "/", m[2]]; };
const stripEn = (p) => p.replace(/^\/en(?=$|\/)/, "") || "/";
export function localizePath(path, locale) {
  const [p, rest] = parts(path);
  const base = stripEn(p);
  return (locale === "en" ? (base === "/" ? "/en" : `/en${base}`) : base) + rest;
}
const NO_EN = [/^\/styleguide$/];
/** Trang tương ứng ở ngôn ngữ kia (bỏ ?query và #hash). Bài viết đi theo cặp slug; thiếu cặp thì về danh sách blog. */
export function counterpartUrl(path, target, { postPairs = { viToEn: {}, enToVi: {} } } = {}) {
  const base = stripEn(parts(path)[0]);
  const post = /^\/blog\/([^/]+)$/.exec(base);
  if (post) {
    if (target === "en") { const en = postPairs.viToEn?.[post[1]]; return en ? `/en/blog/${en}` : "/en/blog"; }
    const vi = postPairs.enToVi?.[post[1]];
    return vi ? `/blog/${vi}` : "/blog";
  }
  if (NO_EN.some((r) => r.test(base))) return target === "en" ? "/en" : base;
  return localizePath(base, target);
}
export function hreflangLinks(viPath, { enPath = null, site = SITE_URL } = {}) {
  const abs = (p) => `${site}${p}`;
  return [{ hrefLang: "vi", href: abs(viPath) }, ...(enPath ? [{ hrefLang: "en", href: abs(enPath) }] : []), { hrefLang: "x-default", href: abs(viPath) }];
}
