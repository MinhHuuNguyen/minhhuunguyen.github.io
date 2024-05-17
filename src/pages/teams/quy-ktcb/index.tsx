import { QuyktcbTeamContent } from "@/components/features/home/teams/quy-ktcb";
import { Intro, Opportunity } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { DefaultSeo } from "next-seo";
import { GetStaticProps, NextPage } from "next";
import { TEAM_NAME } from "@/utils/constants";
import { getQuoteByTeam } from "@/utils/common";
import { QQuote, TeamName } from "@/@types/team";

interface Props {
  quote: QQuote;
}

const QuyktcbTeam: NextPage<Props> = ({ quote }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <QuyktcbTeamContent />
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

export default QuyktcbTeam;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const quote = getQuoteByTeam(TEAM_NAME["QUY_KTCB"] as TeamName);

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
