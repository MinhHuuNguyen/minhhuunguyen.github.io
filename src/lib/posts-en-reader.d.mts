import type { FullPost } from "./posts-reader.mjs";
export type EnPost = FullPost & { viSlug: string; stale: boolean };
export interface PostPairs {
  viToEn: Record<string, string>;
  enToVi: Record<string, string>;
}
export declare function readEnPosts(enRoots: string[], viPosts: FullPost[]): { enPosts: EnPost[]; pairs: PostPairs; errors: string[] };
