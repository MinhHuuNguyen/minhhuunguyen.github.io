// Quảng cáo: gói chèn trong bài (Appendix A15) và chế độ chạy.
export const AD_PACKAGES = {
  max: { maxPerPost: 4, minWordsBeforeFirst: 300, minGapWords: 400, minWordsPerAd: 500 },
  balanced: { maxPerPost: 2, minWordsBeforeFirst: 400, minGapWords: 600, minWordsPerAd: 800 },
  light: { maxPerPost: 1, minWordsBeforeFirst: 600, minGapWords: 600, minWordsPerAd: 1200 },
};
const BLOCKED = new Set(["code", "table", "math", "media"]);
/** Trả về các chỉ số j: chèn quảng cáo SAU sections[j]. */
export function planInArticleAds(sections, pkg) {
  const total = sections.reduce((n, s) => n + s.words, 0);
  const cap = Math.min(pkg.maxPerPost, Math.floor(total / pkg.minWordsPerAd));
  const out = [];
  let before = 0, since = 0;
  for (let j = 0; j < sections.length - 1 && out.length < cap; j++) {
    before += sections[j].words;
    since += sections[j].words;
    if (before < pkg.minWordsBeforeFirst || since < pkg.minGapWords) continue;
    const a = sections[j], b = sections[j + 1];
    if (BLOCKED.has(a.last) || BLOCKED.has(b.first) || a.hasMedia || b.hasMedia) continue;
    out.push(j);
    since = 0;
  }
  return out;
}
export function adsMode(env) {
  const m = env.NEXT_PUBLIC_ADS_MODE;
  if (m === "placeholder" || m === "off") return m;
  if (m === "live") return env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID ? "live" : "off";
  if (!m) return env.NODE_ENV === "development" ? "placeholder" : "off";
  return "off";
}
