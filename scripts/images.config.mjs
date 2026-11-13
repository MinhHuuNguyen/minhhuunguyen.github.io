export const IMAGE_BUDGETS = { portraitAvif800: 120_000, eventWebp1600: 220_000 };
export const PORTRAIT_SRC = "assets-src/portrait/minh-cutout.png";
const EVENTS = {
  "pixta-yep-2024": "public/pixta_yep_2024.jpeg",
  "neu-2024": "public/neu_2024.jpeg",
  "pixta-5-years": "public/pixta_5_years.jpeg",
  "pixta-horizon-2024": "public/pixta_horizon_2024.jpeg",
  "protonx-2024": "public/protonx_2024.jpeg",
};
const LOGOS = {
  fpt: "public/fpt_logo.jpeg",
  pixta: "public/pixta_vietnam_logo.jpeg",
  protonx: "public/protonx_logo.jpeg",
  mci: "public/mci_academy_logo.jpeg",
  robiz: "public/robiztech_logo.jpeg",
  hust: "public/hust_logo.jpeg",
};
const out = (src, base, widths, formats) =>
  widths.flatMap((w) => formats.map((f) => ({ src, file: `${base}-${w}.${f}`, width: w, format: f })));
export const OUTPUTS = [
  ...out(PORTRAIT_SRC, "public/img/portrait/minh-cutout", [400, 800, 1600], ["avif", "webp", "png"]),
  ...Object.entries(EVENTS).flatMap(([n, s]) => out(s, `public/img/events/${n}`, [800, 1600], ["avif", "webp", "jpg"])),
  ...Object.entries(LOGOS).flatMap(([n, s]) => out(s, `public/img/logos/${n}`, [96, 192], ["webp", "png"])),
  ...out("public/minhhuunguyen-logo-square.jpeg", "public/img/logo/logo-square", [64, 128], ["webp", "png"]),
  { src: PORTRAIT_SRC, file: "public/img/og-default.jpg", width: 1200, format: "og" },
];
