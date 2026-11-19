export declare function relatedPosts(
  post: { slug: string; tags?: string[] | null },
  all: { slug: string; tags?: string[] | null; time: string }[],
  pathOf: (slug: string) => string | null,
  k?: number,
): string[];
