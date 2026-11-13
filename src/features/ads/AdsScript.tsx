import Script from "next/script";
import { ADS_MODE, PUBLISHER_ID } from "@/lib/ads-env";

/** Nạp adsbygoogle.js; chỉ dùng ở trang bài và chỉ khi chế độ live. */
export function AdsScript() {
  if (ADS_MODE !== "live") return null;
  return (
    <Script
      id="adsbygoogle"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
    />
  );
}
