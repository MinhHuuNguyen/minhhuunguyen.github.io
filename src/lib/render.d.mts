export type BlockKind = "text" | "code" | "table" | "math" | "media" | "quote" | "list" | "heading" | "html" | "other";
export interface PostSection { html: string; words: number; first: BlockKind; last: BlockKind; hasMedia: boolean }
export interface TocItem { id: string; text: string; level: 2 | 3 }
export interface RenderedPost { sections: PostSection[]; toc: TocItem[]; words: number }
export declare function renderPost(markdown: string): RenderedPost;
export declare function renderMarkdown(markdown: string): string;
