export interface AdPackage {
  maxPerPost: number;
  minWordsBeforeFirst: number;
  minGapWords: number;
  minWordsPerAd: number;
}
export interface AdSection {
  words: number;
  first: string;
  last: string;
  hasMedia: boolean;
}
export declare const AD_PACKAGES: Record<"max" | "balanced" | "light", AdPackage>;
export declare function planInArticleAds(sections: AdSection[], pkg: AdPackage): number[];
export type AdsMode = "live" | "placeholder" | "off";
export declare function adsMode(env: {
  NEXT_PUBLIC_ADS_MODE?: string;
  NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID?: string;
  NODE_ENV?: string;
}): AdsMode;
