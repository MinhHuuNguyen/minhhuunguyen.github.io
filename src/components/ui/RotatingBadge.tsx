import { ArrowUpRight } from "lucide-react";
import { AppLink } from "./AppLink";

export function RotatingBadge({ text, href, label, onClick }: { text: string; href: string; label: string; onClick?: () => void }) {
  return (
    <AppLink href={href} aria-label={label} onClick={onClick} className="relative inline-grid size-40 place-items-center">
      <svg viewBox="0 0 160 160" width="160" height="160" aria-hidden="true" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
        </defs>
        <text fontSize="13" fontWeight="600" letterSpacing="3" fill="currentColor">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="grid size-16 place-items-center rounded-full border border-white/30 bg-white/10 text-accent backdrop-blur">
        <ArrowUpRight size={28} aria-hidden="true" />
      </span>
    </AppLink>
  );
}
