import { adsMode } from "@/lib/ads.mjs";
// Viết từng process.env.X dạng literal: Next chỉ thay biến ở dạng này trong code client.
export const ADS_MODE = adsMode({
  NEXT_PUBLIC_ADS_MODE: process.env.NEXT_PUBLIC_ADS_MODE,
  NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID,
  NODE_ENV: process.env.NODE_ENV,
});
export const PUBLISHER_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID;
