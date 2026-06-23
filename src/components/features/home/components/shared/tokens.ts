/**
 * Shared design tokens for the Home feature.
 *
 * Colours reference the global CSS variables defined in `globals.css :root`
 * (`--color-secondary*`, `--color-primary`) so the Home stays in sync with the
 * site-wide brand tokens instead of re-hardcoding brand hex values.
 */

/** Brand blue gradient — accents, dots, CTAs, section-title chips. */
export const BLUE =
  "linear-gradient(135deg, var(--color-secondary-light), var(--color-secondary))";

/** Brand pink — accent dots / icons. */
export const PINK = "var(--color-primary)";

/** Gradient fill clipped to heading text. */
export const gradientText = {
  background: "linear-gradient(135deg, var(--color-secondary), #1f74d0)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

/** White card with a soft shadow that lifts on hover. */
export const cardSx = {
  bgcolor: "#fff",
  borderRadius: 3,
  boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "rgba(59, 169, 248, 0.22) 0px 12px 28px",
  },
} as const;

/** Small translucent-blue pill used for date ranges. */
export const datePill = {
  mt: 1,
  fontWeight: 600,
  color: "#1f8ae0",
  bgcolor: "rgba(59, 169, 248, 0.12)",
  border: "1px solid rgba(59, 169, 248, 0.25)",
} as const;

/** Same look as {@link datePill} without the top margin — used for role chips. */
export const roleChip = {
  fontWeight: 600,
  color: "#1f8ae0",
  bgcolor: "rgba(59, 169, 248, 0.12)",
  border: "1px solid rgba(59, 169, 248, 0.25)",
} as const;
