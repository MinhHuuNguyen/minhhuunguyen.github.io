/* eslint-disable @next/next/no-img-element */

import { IIntro } from "@/@types/team";
import { HomeContent, Intro, NewsLoadMore } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { getIntroByTeam } from "@/utils/common";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";

interface Props {
  intro: IIntro;
}

const Home: NextPage<Props> = ({ intro }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <HomeContent />

      {intro ? (
        <Intro
          title={intro.title}
          content={intro.content}
          banner_url={intro?.banner_url}
        />
      ) : null}

      <NewsLoadMore />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const intro = getIntroByTeam();

    if (!intro?.title || !intro?.content || !intro?.banner_url) {
      return {
        props: {
          intro: null,
        },
      };
    }

    return {
      props: {
        intro,
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        intro: {},
      },
    };
  }
};
