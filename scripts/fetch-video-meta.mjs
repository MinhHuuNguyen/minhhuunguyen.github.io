import fs from "node:fs";
import path from "node:path";

/** tiktoks: {key, id, url}[]. Lỗi từng mục chỉ cảnh báo, không dừng build. */
export async function fetchVideoMeta(tiktoks, { publicDir, generatedDir, offline = true, fetchImpl = fetch, timeoutMs = 8000 }) {
  const cacheFile = path.join(generatedDir, "video-meta.json");
  let meta = {};
  try { meta = JSON.parse(fs.readFileSync(cacheFile, "utf8")); } catch { /* chưa có cache */ }
  let fetched = 0, errors = 0;
  if (!offline) {
    for (const t of tiktoks) {
      const thumbFile = path.join(publicDir, "video-thumbs", "tiktok", `${t.id}.jpg`);
      if (meta[t.key]?.thumbnail && fs.existsSync(thumbFile)) continue;
      try {
        const res = await fetchImpl(`https://www.tiktok.com/oembed?url=${encodeURIComponent(t.url)}`, { signal: AbortSignal.timeout(timeoutMs) });
        if (!res.ok) throw new Error(`oembed HTTP ${res.status}`);
        const o = await res.json();
        const img = await fetchImpl(o.thumbnail_url, { signal: AbortSignal.timeout(timeoutMs) });
        if (!img.ok) throw new Error(`thumbnail HTTP ${img.status}`);
        fs.mkdirSync(path.dirname(thumbFile), { recursive: true });
        fs.writeFileSync(thumbFile, Buffer.from(await img.arrayBuffer()));
        meta[t.key] = { thumbnail: `/video-thumbs/tiktok/${t.id}.jpg`, title: o.title ?? "", author: o.author_name ?? "" };
        fetched++;
      } catch (e) {
        errors++;
        console.warn(`[video-meta] ${t.key}: ${e.message}`);
      }
    }
  }
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(meta, null, 2));
  console.log(`[video-meta] ${tiktoks.length} TikTok${offline ? " (offline: giữ cache)" : `, ${fetched} tải mới, ${errors} lỗi`}`);
  return meta;
}
