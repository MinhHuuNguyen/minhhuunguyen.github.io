/* eslint-disable @next/next/no-img-element */

import {
  HomeContent,
  Intro,
  NewsLoadMore,
} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { getQuoteByTeam } from "@/utils/common";
import { Stack, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";


const Home = () => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <HomeContent />

      <Stack py={2} alignItems="center">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "3rem",
            },
          }}
        >
          KHO ẢNH KỶ NIỆM
        </Typography>
      </Stack>
      <NewsLoadMore />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quote = getQuoteByTeam();

    if (!quote?.title || !quote?.content || !quote?.banner_url) {
      return {
        props: {
          quote: null,
        },
      };
    }

    return {
      props: {
        quote,
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        quote: {},
      },
    };
  }
};
