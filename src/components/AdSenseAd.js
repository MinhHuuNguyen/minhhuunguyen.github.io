// components/AdSenseAd.js
import React, { useEffect } from 'react';

const AdSenseAd = ({ adSlot }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ads = document.querySelectorAll('.adsbygoogle');
    ads.forEach(ad => {
      if (!ad.getAttribute('data-adsbygoogle-status')) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error(e);
        }
      }
    });
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSenseAd;
