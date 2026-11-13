// src/lib/contrast.mjs — tỉ lệ tương phản WCAG 2.x.
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const luminance = (hex) => { const [r, g, b] = hexToRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export function contrastRatio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}
/** Màu đặc nhìn thấy khi phủ rgba(...) lên nền hex; trả hex chữ thường. Lỗi khi chuỗi rgba sai dạng. */
export function composite(rgba, bgHex) {
  const m = rgba.replace(/\s+/g, "").match(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/);
  if (!m) throw new Error(`rgba sai dạng: ${rgba}`);
  const [r, g, b, a] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])];
  const bg = hexToRgb(bgHex);
  return "#" + [r, g, b].map((c, i) => Math.round(c * a + bg[i] * (1 - a)).toString(16).padStart(2, "0")).join("");
}
