import type { GetStaticProps } from "next";
import type { Locale } from "@/libs/i18n/types";

/** Bọc getStaticProps của trang để thêm `locale` vào props (trang /en dùng chung code với trang vi). */
export function withLocale<P extends object = Record<string, never>>(
  locale: Locale,
  gsp?: GetStaticProps<P>,
): GetStaticProps<P & { locale: Locale }> {
  return async (ctx) => {
    if (!gsp) return { props: { locale } as P & { locale: Locale } };
    const res = await gsp(ctx);
    if (!("props" in res)) return res as never;
    return { ...res, props: { ...(await res.props), locale } } as { props: P & { locale: Locale } };
  };
}
