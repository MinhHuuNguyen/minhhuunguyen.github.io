import MarkdownIt from "markdown-it";
import { Box, Container, Stack } from "@mui/material";
import { format } from "date-fns";
import { getPostsList } from "@/utils/posts";
import { PostList } from "@/@types/post";
import matter from "gray-matter";
import path from "path";
import fs from "fs";

const md = new MarkdownIt({
  html: true, 
});

const innerHtmlStyle = {
  textAlign: "justify",
  fontSize: "20px",

  "& .image-wrapper": {
    background: "#ffffff",
    position: "relative",

    marginTop: "20px",
    marginBottom: "20px",
    maxWidth: "700px",
    width: "100%",
    maxHeight: "675px",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",

    "& .logo": {
      position: "absolute",
      top: "10px",
      left: "10px",
      width: "50px",
      height: "50px"
    },
  },

  "& ul": {
    listStyleType: "disc",
    listStylePosition: "inside",

    display: "block",
    marginBlockStart: "0.5em",
    marginBlockEnd: "0.5em",
    marginInlineStart: "0px",
    marginInlineEnd: "0px",
    paddingInlineStart: "40px",
    margin: 0,
    marginBottom: "8px",
  },
  "& ol": {
    listStyleType: "decimal",
    listStylePosition: "inside",

    display: "block",
    marginBlockStart: "1em",
    marginBlockEnd: "1em",
    marginInlineStart: "0px",
    marginInlineEnd: "0px",
    paddingInlineStart: "40px",
  },
  "& ul ul, ol ul": {
    listStyleType: "circle",
    listStylePosition: "inside",
    marginLeft: "15px",
  },
  "& ol ol, ul ol": {
    listStyleType: "lower-latin",
    listStylePosition: "inside",
    marginLeft: "15px",
  },
  "& h2, h3, h4, blockquote": {
    fontWeight: "bold",
    fontSize: "1.3em",
    marginTop: "20px",
    marginBottom: "10px",
  },
  "& p": {
    marginTop: "15px"
  },
  "& em": {
    fontStyle: "italic",
  },
};

export default function Blog({ frontmatter, content }: { frontmatter: any, content: any }) {
  return (
    <div className="w-100">
      <Container maxWidth="xl">
        <section className="news lg:pt-4 pt-4 mb-5">
          <div className="flex flex-wrap">
            <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-3/4 pr-4 pl-4 w-full">
              <div className="flex justify-between items-center w-full">
                <span className="news-posted">
                  {frontmatter.time &&
                    format(new Date(frontmatter.time), "dd/MM/yyyy")}
                </span>
                <strong>{frontmatter.author}</strong>
              </div>
              <h1 className="news-title text-4xl">{frontmatter.title}</h1>
              {content ? (
                 <Box
                 id="content"
                 sx={innerHtmlStyle}
                 dangerouslySetInnerHTML={{
                   __html: md.render(content),
                 }}
               />
              ) : null}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
export async function getStaticPaths() {
  const posts = await getPostsList();
  return {
    paths: posts.map((post: PostList) => ({ params: { id: post.slug } })),
    fallback: false, 
  };
}

export async function getStaticProps({ params: { id } }: { params: { id: string } }) {
  const posts = await getPostsList();

  const post = posts.find((post) => post.slug === id);
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
        author: post.author,
        banner_url: post.banner_url,
        tags: post.tags,
      },
      content: parsedContent.content, 
    },
  };
}