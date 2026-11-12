import { Box, Container } from "@mui/material";
import { format } from "date-fns";
import { getPostsList } from "@/utils/posts";
import { PostList } from "@/@types/post";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo, NextSeo } from "next-seo";
import Image from 'next/image';
import styles from "@/styles/markdownStyles.module.css";
import AdSenseAd from "@/components/AdSenseAd";
import JsonLd from "@/components/seo/JsonLd";
import { SITE, blogPostingLd, videoObjectLd } from "@/lib/seo.mjs";
import type { PostVideo } from "@/lib/seo.mjs";

import "katex/dist/katex.min.css";
import { renderMarkdown } from "@/lib/render.mjs"; // markdown -> sanitized HTML (the YouTube-only iframe rule lives there)

type BlogProps = {
  frontmatter: Pick<PostList, "time" | "title" | "description" | "banner_url" | "tags">;
  content: string;
  slug: string;
  video: PostVideo | null;
};

export default function Blog({ frontmatter, content, slug, video }: BlogProps) {
  const url = `${SITE}/blog/${slug}`;
  const structuredData = [blogPostingLd(frontmatter, url), ...(video ? [videoObjectLd(video, url)] : [])];
  return (
    <div className="w-100">
      <DefaultSeo {...SEO} title={frontmatter.title} />
      <NextSeo
        canonical={url}
        description={frontmatter.description}
        openGraph={{
          url,
          type: "article",
          title: frontmatter.title,
          description: frontmatter.description,
          images: frontmatter.banner_url ? [{ url: frontmatter.banner_url }] : [],
        }}
      />
      <JsonLd data={structuredData} />
      <Image src={frontmatter.banner_url} alt="banner" width={0} height={0} style={{ width: "100vw", height: "60vh" }}/>
      <Container maxWidth="xl">
        <section className="news lg:pt-4 pt-4 mb-5">
          <div className="flex flex-wrap">
            <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-3/4 pr-4 pl-4 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="news-posted">
                  {frontmatter.time &&
                    format(new Date(frontmatter.time), "dd/MM/yyyy")}
                </span>
              </div>
              <h1 className="news-title text-4xl">{frontmatter.title}</h1>
              <em>{frontmatter.description}</em>
              {content ? (
                <Box id="content" className={styles.markdownBody} dangerouslySetInnerHTML={{ __html: renderMarkdown(content), }}/>
              ) : null}
            </div>
            <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-1/4 pr-4 pl-4 w-full">
              <AdSenseAd adSlot="4893845087" />
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

export async function getStaticPaths() {
  // Every published post gets a page. The older list [...series, ...highlight6, ...non-highlight] left out the
  // highlight posts after the sixth, so those posts had no page of their own.
  const { allPosts } = getPostsList();

  const paths = allPosts
    .filter((post: PostList) => post.slug !== '')
    .map((post: PostList) => ({ params: { id: post.slug } }));
  // console.log('Static paths:', paths);
  return {
    paths,
    fallback: false, 
  };
}

export async function getStaticProps({ params: { id } }: { params: { id: string } }) {
  const { allPosts } = getPostsList();

  const post = allPosts.find((post) => post.slug === id);
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      frontmatter: {
        time: post.time,
        title: post.title,
        description: post.description,
        banner_url: post.banner_url,
        tags: post.tags,
      },
      content: post.content,
      slug: post.slug,
      video: post.video ?? null,
    },
  };
}
