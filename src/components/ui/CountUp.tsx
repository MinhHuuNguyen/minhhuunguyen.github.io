import { useEffect, useRef } from "react";
import { parseStat } from "@/lib/format.mjs";

const fmt = (n: number, decimals: number) => n.toFixed(decimals);

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    const stat = parseStat(value);
    if (!el || !stat) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;
    const decimals = (String(stat.value).split(".")[1] ?? "").length;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1200);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${stat.prefix}${fmt(stat.value * eased, decimals)}${stat.suffix}`;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        run();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} data-countup="" aria-label={value} className={className}>
      {value}
    </span>
  );
}
