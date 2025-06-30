// components/AdBanner.tsx
import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const adClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const adSlot = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT;

  return (
    <ins className="adsbygoogle"
      style={{ display: "inline-block", width: "728px", height: "90px" }}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
    ></ins>
  );
}
