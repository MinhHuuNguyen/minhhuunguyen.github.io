export type CommentsLocale = "vi" | "en";
export type CommentsConfig = {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  exclude: string[];
  report: { template: string; titlePrefix: Record<CommentsLocale, string> };
};
export type CommentsPostRef = { relPath: string; commentsKey?: string | null };
export type CommentsProps = {
  term: string;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  ready: boolean;
  backLink: string;
  reportUrl: string;
  discussionsUrl: string;
};
export declare const GISCUS_ORIGIN: "https://giscus.app";
export declare const WIDGET_ID: "giscus-thread";
export declare const SESSION_KEY: "giscus-session";
export declare const REPORT_TITLE_MAX: number;
export declare const SESSION_HANDOFF_SCRIPT: string;
export declare function commentsKey(post: CommentsPostRef): string;
export declare function assertUniqueCommentKeys(posts: CommentsPostRef[]): void;
export declare function validateCommentsConfig(raw: unknown): { config: CommentsConfig | null; errors: string[] };
export declare function isReady(config: CommentsConfig): boolean;
export declare function reportUrl(
  config: CommentsConfig,
  args: { locale: CommentsLocale; title: string; pageUrl: string; sourceFile: string },
): string;
export declare function commentsProps(args: {
  config: CommentsConfig;
  post: CommentsPostRef;
  locale: CommentsLocale;
  title: string;
  pageUrl: string;
  sourceFile: string;
  backLink: string;
}): CommentsProps | null;
export declare function parseGiscusMessage(
  event: { origin: string; data: unknown } | null | undefined,
): { count: number; url: string } | null;
export declare function wantsImmediateMount(search: string, hash: string): boolean;
