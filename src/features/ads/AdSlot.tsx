import { useEffect, useRef } from "react";
import { useI18n } from "@/libs/i18n/I18nContext";
import { ADS_MODE, PUBLISHER_ID } from "@/lib/ads-env";
import ads from "@/utils/data/ads.json";

const CFG = {
  rail: { minH: 600, style: { display: "inline-block", width: 300, height: 600 }, attrs: {} },
  inArticle: { minH: 280, style: { display: "block", textAlign: "center" }, attrs: { "data-ad-layout": "in-article", "data-ad-format": "fluid" } },
  multiplex: { minH: 360, style: { display: "block" }, attrs: { "data-ad-format": "autorelaxed" } },
} as const;

/** Khối quảng cáo giữ chỗ cố định (không gây nhảy bố cục); chỉ nạp quảng cáo khi gần vào khung nhìn. */
export function AdSlot({ slot, index = 0 }: { slot: keyof typeof CFG; index?: number }) {
  const { t } = useI18n();
  const ref = useRef<HTMLModElement>(null);
  useEffect(() => {
    if (ADS_MODE !== "live" || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (!el.getAttribute("data-adsbygoogle-status")) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.warn("[ads]", err);
          }
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (ADS_MODE === "off") return null;
  const c = CFG[slot];
  return (
    <div data-ad-slot={slot} data-ad-index={index} className="ad-wrap my-10" style={{ minHeight: c.minH + 24 }}>
      <p className="ad-label">{t("ads.label")}</p>
      {ADS_MODE === "placeholder" ? (
        <div className="ad-placeholder" style={{ minHeight: c.minH }}>
          {slot} #{index}
        </div>
      ) : (
        <ins
          ref={ref}
          className="adsbygoogle"
          style={c.style}
          data-ad-client={PUBLISHER_ID}
          data-ad-slot={ads.slots[slot]}
          {...c.attrs}
        />
      )}
    </div>
  );
}
