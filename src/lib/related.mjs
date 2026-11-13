// Bài liên quan: Jaccard tag (bỏ "series") + 0,5 nếu cùng lộ trình; hoà điểm thì bài mới trước; bỏ chính nó.
const tagSet = (tags) => new Set((tags ?? []).filter((t) => t !== "series"));
function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}
const ts = (time) => {
  const n = new Date(time).getTime();
  return Number.isNaN(n) ? 0 : n;
};
/** Trả về slug của tối đa k bài liên quan (chỉ bài có điểm > 0). */
export function relatedPosts(post, all, pathOf, k = 3) {
  const mine = tagSet(post.tags);
  const myPath = pathOf(post.slug);
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const other = pathOf(p.slug);
      const score = jaccard(mine, tagSet(p.tags)) + (myPath && other && myPath === other ? 0.5 : 0);
      return { slug: p.slug, score, t: ts(p.time) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.t - a.t)
    .slice(0, k)
    .map((x) => x.slug);
}
