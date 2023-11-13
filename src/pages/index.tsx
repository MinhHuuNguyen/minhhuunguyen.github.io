/* eslint-disable @next/next/no-img-element */

import { QQuote } from "@/@types/team";
import {
  HomeContent,
  Intro,
  NewsLoadMore,
  Opportunity,
} from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { getQuoteByTeam } from "@/utils/common";
import { Stack, Typography } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";

interface Props {
  qquote: QQuote;
}

const Home: NextPage<Props> = ({ qquote }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <HomeContent />

      {qquote ? (
        <Intro
          title={qquote.title}
          content={qquote.content}
          banner_url={qquote?.banner_url}
        />
      ) : null}
      <Opportunity />

      <Stack py={2} alignItems="center">
        <Typography variant="h5" fontWeight="bold">
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
