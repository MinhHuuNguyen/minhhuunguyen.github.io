import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";
import { colors, radii, shadows, gradients, glass } from "./src/styles/tokens.mjs";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,mjs,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { blue: colors.blue, cyan: colors.cyan, accent: colors.accent, ink: colors.ink, surface: colors.surface, line: colors.line, danger: colors.danger },
      fontFamily: { sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"], mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"] },
      borderRadius: { hero: radii.hero, card: radii.card, pill: radii.pill },
      boxShadow: { card: shadows.card },
      fontSize: {
        display: ["clamp(44px, 9vw, 132px)", { lineHeight: "1.08", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-footer": ["clamp(64px, 14vw, 240px)", { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "800" }],
        service: ["clamp(32px, 5vw, 64px)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "500" }],
        stat: ["clamp(40px, 4vw, 56px)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "800" }],
        lead: ["clamp(18px, 1.6vw, 22px)", { lineHeight: "1.55" }],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { "0%,100%": { opacity: ".25" }, "50%": { opacity: ".45" } },
      },
      animation: { marquee: "marquee 40s linear infinite", "spin-slow": "spin 14s linear infinite", shimmer: "shimmer 6s ease-in-out infinite" },
      transitionTimingFunction: { out: "cubic-bezier(.22,1,.36,1)" },
      maxWidth: { container: "1280px", prose: "720px" },
    },
  },
  plugins: [
    typography,
    plugin(({ addUtilities }) => addUtilities({
      ".bg-hero": { backgroundImage: gradients.hero },
      ".bg-hero-soft": { backgroundImage: gradients.heroSoft },
      ".bg-pill-blue": { backgroundImage: gradients.pillBlue },
      ".bg-pill-navy": { backgroundImage: gradients.pillNavy },
      ".bg-pill-dark": { backgroundImage: gradients.pillDark },
      ".glass-hero": { backgroundColor: glass.hero, backdropFilter: "blur(6px)" },
      // padding-block chừa chỗ cho dấu tiếng Việt nằm ngoài hộp chữ (dấu nặng "ạ", móc "ả", chữ thòng xuống);
      // background-clip: text làm phần mực ngoài hộp trở nên vô hình.
      ".text-gradient-hero": { backgroundImage: gradients.textHero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        paddingBlock: ".12em", WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" },
    })),
  ],
};
