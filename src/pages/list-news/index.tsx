/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { CardNews, HighlightNews } from "@/components/features/news";
import { ListSmallNews } from "@/components/features/news/ListSmallNews";
import { CoverImageSlide } from "@/components/features/home/components/CoverImageSlide";
import homeBanner from "../../utils/data/json/teams/banner/home.json";
import { SEO } from "@/configs/seo.config";
import styles from "@/styles/News.module.css";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { BANNER_LIST_NEWS_URL } from "@/utils/constants";
import { Box, Container, Grid, Stack } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";
import logoImg from "../../../public/ktcb-logo-512.png";

interface Props {
  highlightNews: INews;
  mediumNews: INews[];
}

const ListNews: NextPage<Props> = ({ highlightNews, mediumNews }) => {
  return (
    <>
      <DefaultSeo {...SEO} title={"Danh sách bài viết"} />

      <Stack>
        <Box className="relative">
          {/* <img
            className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
            src={logoImg.src}
            alt="banner"
          /> */}

          <CoverImageSlide coverImageData={homeBanner} />
        </Box>

        <Container maxWidth="xl">
          <Stack
            sx={{
              paddingTop: "40px",
              paddingBottom: "40px",
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
