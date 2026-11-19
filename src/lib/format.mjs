import { toIsoDate } from "./seo.mjs";
export function parseStat(text) {
  const m = /^(\D*?)(\d+(?:\.\d+)?)(\D*)$/.exec(String(text ?? "").trim());
  return m ? { prefix: m[1], value: Number(m[2]), suffix: m[3] } : null;
}
export function formatDuration(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!m || (!m[1] && !m[2] && !m[3])) return null;
  const [h, mi, s] = [m[1], m[2], m[3]].map((x) => Number(x ?? 0));
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${String(mi).padStart(2, "0")}:${ss}` : `${mi}:${ss}`;
}
const EN = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export function formatDate(value, locale) {
  const iso = toIsoDate(value);
  if (!iso) return null;
  const [y, mo, d] = iso.split("-");
  return locale === "en" ? EN.format(new Date(`${iso}T00:00:00Z`)) : `${d}/${mo}/${y}`;
}
