import type { ReactNode } from "react";

export function Marquee({ items, speedSec = 40, label }: { items: ReactNode[]; speedSec?: number; label: string }) {
  return (
    <div data-marquee="" role="region" aria-label={label} tabIndex={0} className="group overflow-hidden">
      <div
        data-marquee-track=""
        className="flex w-max animate-marquee gap-6 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSec}s` }}
      >
        {items.map((it, i) => (
          <div key={`a${i}`} data-marquee-item="">{it}</div>
        ))}
        {items.map((it, i) => (
          <div key={`b${i}`} data-marquee-item="" aria-hidden="true">
            {it}
          </div>
        ))}
      </div>
    </div>
  );
}
