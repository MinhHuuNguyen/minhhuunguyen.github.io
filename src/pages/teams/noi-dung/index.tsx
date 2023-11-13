import { NdTeamContent } from "@/components/features/home/teams/noi-dung";
import { Intro, Opportunity } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { GetStaticProps, NextPage } from "next";
import { getQuoteByTeam } from "@/utils/common";
import { TEAM_NAME } from "@/utils/constants";
import { QQuote, TeamName } from "@/@types/team";

interface Props {
  quote: QQuote;
}

const NdTeam: NextPage<Props> = ({ quote }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <NdTeamContent />
      {quote ? (
        <Intro
          title={quote.title}
          content={quote.content}
          banner_url={quote?.banner_url}
        />
      ) : null}
      <Opportunity />
    </>
  );
};

export default NdTeam;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quote = getQuoteByTeam(TEAM_NAME["NOI_DUNG"] as TeamName);

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
