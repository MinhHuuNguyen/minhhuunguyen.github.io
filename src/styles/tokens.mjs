// src/styles/tokens.mjs — nguồn duy nhất cho màu (lấy mẫu từ shot Dribbble bằng ffmpeg, 2026-11-13).
export const colors = {
  blue: { 950: "#0D2D62", 900: "#1D5FB8", 700: "#1A5FD0", 500: "#3E91FF", 300: "#82A7D2", 100: "#ACD0FD" },
  cyan: { 300: "#71D1F2", 200: "#8FD1ED" },
  accent: "#FFFF24",
  ink: { 900: "#111111", 800: "#1A1A19", 700: "#343533", 500: "#5B6472", 300: "#A1A1AA" },
  surface: { 0: "#FFFFFF", 50: "#F7F7F7", 100: "#ECECEC" },
  line: { light: "#E5E5E5", dark: "#2A2A28" },
  danger: { 50: "#FEF2F2", 700: "#B42318" },
};
export const glass = { hero: "rgba(13,45,98,0.55)" };
export const radii = { hero: "20px", card: "16px", pill: "9999px" };
export const shadows = { card: "0 1px 2px rgba(17,17,17,.04), 0 8px 24px rgba(17,17,17,.06)" };
export const gradients = {
  hero: `linear-gradient(180deg, ${colors.blue[900]} 0%, ${colors.blue[300]} 55%, ${colors.cyan[300]} 100%)`,
  heroSoft: `linear-gradient(180deg, #FFFFFF 0%, ${colors.blue[100]} 100%)`,
  pillBlue: `linear-gradient(180deg, #6FAEFF 0%, ${colors.blue[900]} 100%)`,
  pillNavy: `linear-gradient(180deg, ${colors.ink[800]} 0%, ${colors.blue[900]} 100%)`,
  pillDark: `linear-gradient(90deg, ${colors.ink[700]} 0%, #000000 100%)`,
  textHero: "linear-gradient(180deg, #FFFFFF 0%, #CFE3FF 100%)",
};
/** [fg, bg, ngưỡng, công dụng] — mỗi cặp chữ/nền dùng trên site phải có ở đây. */
export const CONTRAST_RULES = [
  ["ink.900", "surface.50", 4.5, "chữ thân trên nền trang"],
  ["ink.500", "surface.50", 4.5, "chữ phụ trên nền trang"],
  ["ink.500", "surface.0", 4.5, "chữ phụ trên thẻ trắng"],
  ["blue.700", "surface.0", 4.5, "link chữ nhỏ trên thẻ"],
  ["blue.700", "surface.50", 4.5, "link chữ nhỏ trên nền trang"],
  ["blue.500", "surface.0", 3.0, "số liệu ≥ 24px"],
  ["accent", "blue.900", 4.5, "chữ vàng trên xanh đậm"],
  ["accent", "ink.800", 4.5, "mũi tên vàng trên khu tối"],
  ["surface.0", "blue.900", 4.5, "chữ trắng trên đỉnh hero và pill xanh"],
  ["surface.0", "ink.700", 4.5, "chữ trắng trên nút tối"],
  ["surface.0", "ink.800", 4.5, "chữ trắng trên khu tối"],
  ["ink.300", "ink.800", 4.5, "chữ phụ trên khu tối"],
  ["danger.700", "danger.50", 4.5, "thông báo lỗi chat"],
];
export const GLASS_RULES = { glass: glass.hero, stops: ["blue.300", "cyan.300", "cyan.200"] };
export function resolveColor(ref) {
  if (ref.startsWith("#")) return ref;
  const v = ref.split(".").reduce((o, k) => (o == null ? undefined : o[k]), colors);
  if (typeof v !== "string") throw new Error(`màu không có trong tokens: ${ref}`);
  return v;
}
