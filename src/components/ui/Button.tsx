import type { ReactNode } from "react";
import clsx from "clsx";
import { ArrowUpRight, Download, MessageCircle } from "lucide-react";
import { AppLink } from "./AppLink";

type Track = { event: string; params?: Record<string, unknown> };
type Variant = "dark" | "light" | "blue" | "glass";

const VARIANT: Record<Variant, string> = {
  dark: "bg-pill-dark text-white shadow-[inset_0_1px_0_rgba(255,255,255,.15)]",
  blue: "bg-pill-blue text-white",
  light: "bg-white text-ink-900 shadow-card",
  glass: "border border-white/30 bg-white/10 text-white backdrop-blur",
};

export function PillButton({
  href,
  onClick,
  variant,
  icon = "arrow",
  size = "md",
  track,
  children,
}: {
  href?: string;
  onClick?: () => void;
  variant: Variant;
  icon?: "arrow" | "download" | "chat" | "none";
  size?: "md" | "lg";
  track?: Track;
  children: ReactNode;
}) {
  const cls = clsx(
    "inline-flex items-center gap-3 rounded-pill py-1.5 text-[15px] font-semibold transition hover:-translate-y-0.5",
    icon === "none" ? "px-6" : "pl-6 pr-1.5",
    size === "lg" && "py-2 text-base",
    VARIANT[variant],
  );
  const Icon = icon === "download" ? Download : icon === "chat" ? MessageCircle : ArrowUpRight;
  const inner = (
    <>
      <span>{children}</span>
      {icon !== "none" && (
        <span className="grid size-9 place-items-center rounded-full bg-white text-blue-700">
          <Icon size={18} aria-hidden="true" />
        </span>
      )}
    </>
  );
  const handle = () => {
    if (track) window.gtag?.("event", track.event, track.params);
    onClick?.();
  };
  if (href) {
    return (
      <AppLink href={href} className={cls} onClick={handle}>
        {inner}
      </AppLink>
    );
  }
  return (
    <button type="button" className={cls} onClick={handle}>
      {inner}
    </button>
  );
}

export function IconCircle({
  label,
  href,
  onClick,
  children,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const cls = "grid size-10 place-items-center rounded-full bg-white text-ink-900 shadow-card transition hover:-translate-y-0.5";
  if (href) {
    return (
      <AppLink href={href} aria-label={label} className={cls} onClick={onClick}>
        {children}
      </AppLink>
    );
  }
  return (
    <button type="button" aria-label={label} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
