export declare const EN_FM_KEYS: string[];
export declare const ALLOWLIST: string[];
export declare function stripPipelineVideoBlock(body: string): string;
export declare function bodyHash(viBody: string): string;
export declare function stripCodeComments(code: string): string;
export declare function vietnameseRatio(text: string, allowlist?: string[]): { ratio: number; words: string[] };
export declare function checkPair(viBody: string, enMarkdown: string): { errors: string[]; warnings: string[] };
export declare function checkEnFrontmatter(
  fm: Record<string, unknown>,
  ctx: { viBySourcePath: Map<string, { slug: string }>; enSlugs: Map<string, string> },
): string[];
export declare function missingLogEntries(logText: string, sourcePaths: string[]): string[];
