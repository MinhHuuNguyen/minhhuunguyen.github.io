export const PROGRESS_KEY = "learn-progress:v1";
const EMPTY = () => ({ version: 1, paths: {} });
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
export function parseProgress(raw) {
  try { const v = JSON.parse(raw ?? ""); if (isObj(v) && v.version === 1 && isObj(v.paths)) return v; } catch { /* hỏng thì làm lại */ }
  return EMPTY();
}
export const serializeProgress = (p) => JSON.stringify(p);
export function setLesson(p, path, lesson, done, nowIso) {
  const cur = { ...(p.paths[path] ?? {}) };
  if (done) cur[lesson] = nowIso; else delete cur[lesson];
  return { ...p, paths: { ...p.paths, [path]: cur } };
}
export function pathProgress(p, path) {
  const avail = path.lessons.filter((l) => l.available);
  const done = avail.filter((l) => p.paths[path.slug]?.[l.slug]).length;
  const total = avail.length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0, complete: total > 0 && done === total };
}
/** Storage dùng được hay không (Safari private, chặn cookie, đầy quota): thử ghi/xoá một khoá. */
export function safeStorage(kind, win = globalThis.window) {
  try {
    const s = kind === "local" ? win?.localStorage : win?.sessionStorage;
    if (!s) return null;
    s.setItem("__probe__", "1");
    s.removeItem("__probe__");
    return s;
  } catch { return null; }
}
