/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { CardNews, HighlightNews } from "@/components/features/news";
import { ListSmallNews } from "@/components/features/news/ListSmallNews";
import { SEO } from "@/configs/seo.config";
import styles from "@/styles/News.module.css";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { BANNER_LIST_NEWS_URL } from "@/utils/constants";
import { Container, Grid, Stack } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";

interface Props {
  highlightNews: INews;
  mediumNews: INews[];
}

const ListNews: NextPage<Props> = ({ highlightNews, mediumNews }) => {
  return (
    <>
      <DefaultSeo {...SEO} title={"Danh sách bài viết"} />

      <Stack>
        <img
          className={styles.banner}
          src={BANNER_LIST_NEWS_URL}
          alt="banner"
        />

        <Container maxWidth="xl">
          <Stack
            sx={{
              paddingTop: "60px",
              paddingBottom: "60px",
              gap: "30px",
            }}
          >
            <HighlightNews
              banner_url={highlightNews.banner_url}
              description={highlightNews.description}
              slug={highlightNews.slug}
              title={highlightNews.title}
            />

            <Grid container spacing={2}>
              {mediumNews.map((news, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <CardNews
                    banner_url={news.banner_url}
                    slug={news.slug}
                    title={news.title}
                    description={news.description}
                  />
                </Grid>
              ))}
            </Grid>

            <ListSmallNews />
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export default ListNews;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const highlightNews = getHighlightNews();
    const mediumNews = getMediumNews();

    return {
      props: {
        highlightNews,
        mediumNews,
      },
    };
  } catch (err) {
    return {
      props: {
        highlightNews: {},
        mediumNews: {},
        // smallNews: {},
      },
    };
  }
};
