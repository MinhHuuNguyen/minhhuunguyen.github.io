import { DefaultSeo, NextSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { Container } from "@/components/ui/Container";
import { PillButton } from "@/components/ui/Button";
import { SITE } from "@/lib/seo.mjs";

/** Trang tạm cho slug được link tới mà chưa có bài: song ngữ, noindex, không quảng cáo, không dữ liệu có cấu trúc. */
export function PostPlaceholder({ slug }: { slug: string }) {
  return (
    <>
      <DefaultSeo {...SEO} title="Bài sắp ra mắt" />
      <NextSeo noindex nofollow={false} canonical={`${SITE}/blog/${slug}`} />
      <Container className="py-20 font-sans text-ink-900">
        <h1 className="text-3xl font-bold">Bài này sẽ được viết trong thời gian tới</h1>
        <p className="mt-3 text-ink-700" lang="en">
          This article will be written soon.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <PillButton href="/blog" variant="dark">
            Về danh sách bài viết
          </PillButton>
          <PillButton href="/en/blog" variant="dark">
            Back to the blog
          </PillButton>
        </div>
      </Container>
    </>
  );
}

export default PostPlaceholder;
