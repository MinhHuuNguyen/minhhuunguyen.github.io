export declare const PDF_EXCLUDED_SLUGS: string[];
export declare function hasPdf(post: { slug?: string; tags?: string[] | null } | null | undefined): boolean;
export declare function pdfHref(slug: string, locale: "vi" | "en"): string;
export declare function pdfFile(slug: string, locale: "vi" | "en"): string;
export declare function pdfHrefFor(post: { slug?: string; tags?: string[] | null } | null | undefined, locale: "vi" | "en"): string | null;
export declare function eligiblePosts(data: unknown): { locale: "vi" | "en"; slug: string; post: unknown }[];
