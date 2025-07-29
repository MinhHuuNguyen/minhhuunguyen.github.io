import MarkdownIt from "markdown-it";
import { Box, Container } from "@mui/material";
import { format } from "date-fns";
import { getPostsList } from "@/utils/posts";
import { PostList } from "@/@types/post";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import matter from "gray-matter";
import newStyles from "@/styles/News.module.css";
import fs from "fs";
import Image from 'next/image';
import styles from "@/styles/markdownStyles.module.css";
// @ts-ignore
import katex from "markdown-it-katex";
import "katex/dist/katex.min.css";

const md = new MarkdownIt({
  html: true, linkify: true
}).use(katex);

export default function Blog({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <div className="w-100">
      <DefaultSeo {...SEO} title={frontmatter.title} />
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
                <Box id="content" className={styles.markdownBody} dangerouslySetInnerHTML={{ __html: md.render(content), }}/>
              ) : null}
            </div>
          </div>
        </section>
      </Container>
      {/* <AdBanner /> */}
    </div>
  );
}

export async function getStaticPaths() {
  const { highlightPosts, nonHighlightPosts } = getPostsList();

  const allPosts = [...highlightPosts, ...nonHighlightPosts];

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
  const { highlightPosts, nonHighlightPosts } = getPostsList();

  const post = [...highlightPosts, ...nonHighlightPosts].find((post) => post.slug === id);
  if (!post) {
    return {
      notFound: true,
    };
  }

  const fileContents = fs.readFileSync(post.filePath, 'utf8');
  const parsedContent = matter(fileContents);

  return {
    props: {
      frontmatter: {
        time: post.time,
        title: post.title,
        description: post.description,
        banner_url: post.banner_url,
        tags: post.tags,
      },
      content: parsedContent.content,
    },
  };
}
