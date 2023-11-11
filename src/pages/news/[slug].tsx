/* eslint-disable @next/next/no-img-element */
import { INews } from "@/@types/news";
import { ItemNews } from "@/components/features/news/components/ItemNews";
import { SlideNews } from "@/components/features/news/components/SlideNews";
import { SEO } from "@/configs/seo.config";
import styles from "@/styles/News.module.css";
import {
  getNewsBySlug,
  getNewsByTags,
  getOtherNewWithoutTags,
} from "@/utils/common";
import { Box, Container, Stack } from "@mui/material";
import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";
import Error404 from "../404";

interface Props {
  news: INews;
  rightOtherNews?: INews[];
  content: string;
}

const News: NextPage<Props> = ({ news, rightOtherNews, content }) => {
  const slideNewsData = getOtherNewWithoutTags(news?.tags);

  return (
    <>
      <DefaultSeo {...SEO} title={news?.title} />

      {news ? (
        <>
          <Stack>
            <img
              className={styles.banner}
              src={news?.banner_url}
              alt="banner"
            />

            <Container maxWidth="xl">
              <section className="news lg:pt-4 pt-4 mb-5">
                <div className="flex flex-wrap">
                  <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-3/4 pr-4 pl-4 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="news-posted">
                        {news?.time &&
                          format(new Date(news?.time), "dd/MM/yyyy")}
                      </span>
                      <strong>{news?.author}</strong>
                    </div>
                    <h2 className="news-title text-2xl">{news?.title}</h2>

                    {content ? (
                      <Box
                        sx={{
                          textAlign: "justify",

                          "& ul": {
                            listStyleType: "disc",
                            listStylePosition: "inside",

                            display: "block",
                            marginBlockStart: "1em",
                            marginBlockEnd: "1em",
                            marginInlineStart: "0px",
                            marginInlineEnd: "0px",
                            paddingInlineStart: "40px",
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
                        }}
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(content),
                        }}
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-col align-center justify-start gap-4 lg:px-6 lg:w-1/4 pr-4 pl-4 w-full lg:mt-0 mt-4">
                    <Stack>
                      <h3 className="news-title">Tin liên quan</h3>
                      {rightOtherNews?.map((news, index) => (
                        <ItemNews
                          banner_url={news.banner_url}
                          description={news.description}
                          slug={news.slug}
                          title={news.title}
                          key={index}
                        />
                      ))}
                    </Stack>
                  </div>
                </div>
              </section>
            </Container>
          </Stack>
          <Stack alignItems="center" px={7}>
            <SlideNews slideNewsData={slideNewsData} />
          </Stack>
        </>
      ) : (
        <Error404 />
      )}
    </>
  );
};

export default News;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    let rightOtherNews = null;

    const news = getNewsBySlug(params?.slug as string);

    if (news) {
      rightOtherNews = getNewsByTags(news?.title, news?.tags);
    }

    const content = await import(`@/utils/data/html/${params?.slug}`)
      .then((response) => JSON.stringify(response?.default))
      .catch((err) => {
        return "";
      });

    return {
      props: {
        news,
        rightOtherNews: rightOtherNews?.slice(0, 6),
        content: content,
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        news: {},
        rightOtherNews: [],
      },
    };
  }
};
