export type RouteLocale = "vi" | "en";
export type PostPairs = { viToEn: Record<string, string>; enToVi: Record<string, string> };
export declare const SITE_URL: string;
export declare function localeOf(path: string): RouteLocale;
export declare function localizePath(path: string, locale: RouteLocale): string;
export declare function counterpartUrl(path: string, target: RouteLocale, opts?: { postPairs?: PostPairs }): string;
export declare function hreflangLinks(
  viPath: string,
  opts?: { enPath?: string | null; site?: string },
): { hrefLang: string; href: string }[];
