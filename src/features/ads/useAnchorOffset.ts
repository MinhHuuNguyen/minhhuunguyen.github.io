import { useEffect, useState } from "react";

const ANCHOR = 'ins.adsbygoogle[data-anchor-status="displayed"], .adsbygoogle-noablate[data-anchor-shown="true"]';

/** Chiều cao (px) của quảng cáo neo đáy màn hình; 0 khi không có. Selector cần kiểm lại với quảng cáo thật (Appendix G-10). */
export function useAnchorOffset(): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const measure = () => {
      const el = document.querySelector<HTMLElement>(ANCHOR);
      if (!el) return setOffset(0);
      const r = el.getBoundingClientRect();
      setOffset(window.innerHeight - r.bottom <= 8 && r.height > 0 ? Math.round(r.height) : 0);
    };
    measure();
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { subtree: true, childList: true, attributes: true });
    window.addEventListener("resize", measure);
    return () => {
      mo.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return offset;
}
