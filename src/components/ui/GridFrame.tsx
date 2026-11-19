import type { ReactNode } from "react";
import clsx from "clsx";

export function GridFrame({
  cols,
  rows,
  crosshair = "none",
  tone,
  className,
  children,
}: {
  cols: number;
  rows: number;
  crosshair?: "accent" | "blue" | "none";
  tone: "onBlue" | "onLight";
  className?: string;
  children?: ReactNode;
}) {
  const line = tone === "onBlue" ? "bg-white/25" : "bg-ink-900/10";
  const mark = crosshair === "accent" ? "text-accent" : "text-blue-500";
  const vs = Array.from({ length: cols - 1 }, (_, i) => i + 1);
  const hs = Array.from({ length: rows - 1 }, (_, i) => i + 1);
  return (
    <div className={clsx("relative", className)}>
      {vs.map((i) => (
        <span key={`v${i}`} aria-hidden="true" className={clsx("pointer-events-none absolute inset-y-0 w-px animate-shimmer", line)} style={{ left: `${(i / cols) * 100}%` }} />
      ))}
      {hs.map((i) => (
        <span key={`h${i}`} aria-hidden="true" className={clsx("pointer-events-none absolute inset-x-0 h-px animate-shimmer", line)} style={{ top: `${(i / rows) * 100}%` }} />
      ))}
      {crosshair !== "none" &&
        vs.flatMap((x) =>
          hs.map((y) => (
            <svg
              key={`c${x}-${y}`}
              aria-hidden="true"
              viewBox="0 0 12 12"
              width="12"
              height="12"
              className={clsx("pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 sm:block", mark)}
              style={{ left: `${(x / cols) * 100}%`, top: `${(y / rows) * 100}%` }}
            >
              <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )),
        )}
      <div className="relative">{children}</div>
    </div>
  );
}
