import type { ReactNode } from "react";
import clsx from "clsx";

export function SectionLabel({ tone = "light", children }: { tone?: "light" | "dark"; children: ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-pill px-4 py-1.5 text-[13px] font-semibold tracking-[.04em]",
        tone === "dark" ? "border border-white/10 bg-white/5 text-white" : "bg-white text-blue-700 shadow-card",
      )}
    >
      {children}
    </span>
  );
}

export function TagChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-pill bg-surface-100 px-3 py-1 text-[13px] font-medium text-ink-700">{children}</span>
  );
}
