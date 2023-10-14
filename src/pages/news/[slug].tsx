/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { ItemNews } from "@/components/features/news/components/ItemNews";
import { SEO } from "@/configs/seo.config";
import styles from "@/styles/News.module.css";
import {
  getNewsBySlug,
  getNewsByTags,
  getOtherNewWithoutTags,
} from "@/utils/common";
import { Container, Stack, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { SlideNew } from "./components/SlideNew";

interface Props {
  news: INews;
  rightOtherNews?: INews[];
  bottomOtherNews?: INews[];
}

const News: NextPage<Props> = ({ news, rightOtherNews, bottomOtherNews }) => {
  const router = useRouter();

  const slideNewsData = getOtherNewWithoutTags(news.tags);
  console.log({ slideNewsData, news });

  console.log("news", news);
  console.log("rightOtherNews", rightOtherNews);
  console.log("bottomOtherNews", bottomOtherNews);

  return (
    <>
      <DefaultSeo {...SEO} title={news?.title} />

      <Stack>
        <img className={styles.banner} src={news?.banner_url} alt="banner" />

        <Container maxWidth="xl">
          <section className="news lg:pt-4 pt-4 mb-5">
            <div className="flex flex-wrap">
              <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-6 lg:w-2/3 pr-4 pl-4 w-full">
                <div className="flex justify-between items-center w-full">
                  {/* <span className="news-status">{news?.status}</span> */}
                  <span className="news-posted">{news?.time}</span>
                </div>
                <h2 className="news-title">{news?.title}</h2>
                {news?.contents?.map((content, index) => (
                  <React.Fragment key={index}>
                    {content.type === "image" ? (
                      <Stack>
                        <Image
                          src={content.url}
                          height={400}
                          width={400}
                          sizes="100vw"
                          style={{
                            width: "100%",
                            height: "auto",
                          }}
                          alt={content.caption}
                        />

                        {content?.caption ? (
                          <Typography
                            sx={{
                              fontSize: "14px",
                              color: "#333",
                              paddingTop: "6px",
                              textAlign: "left",
                            }}
                          >
                            {content?.caption}
                          </Typography>
                        ) : null}
                      </Stack>
                    ) : (
                      <p className="news-content" key={content.content}>
                        {content.content}
                      </p>
                    )}
                  </React.Fragment>
                ))}

                <span className="self-end">
                  Tác giả: <strong>{news.author}</strong>
                </span>
              </div>

              <div className="flex flex-col align-center justify-start gap-4 lg:px-6 lg:w-1/3 pr-4 pl-4 w-full lg:mt-0 mt-4">
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
      <Stack width="100%" alignItems="center">
        <SlideNew slideNewsData={slideNewsData} />
      </Stack>
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
    let bottomOtherNews = null;

    const news = getNewsBySlug(params?.slug as string);

    if (news) {
      rightOtherNews = getNewsByTags(news?.title, news?.tags);
      bottomOtherNews = getNewsByTags(news?.title, news?.tags);
    }

    if (rightOtherNews && rightOtherNews?.length > 6) {
      rightOtherNews = rightOtherNews?.slice(0, 6);
    }

    return {
      props: {
        news,
        rightOtherNews,
        bottomOtherNews,
      },
    };
  } catch (err) {
    return {
      props: {
        news: {},
        rightOtherNews: {},
        bottomOtherNews: {},
      },
    };
  }
};
