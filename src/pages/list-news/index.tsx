import { INews } from "@/@types/news";
import { CardNews, HighlightNews } from "@/components/features/news";
import { ListSmallNews } from "@/components/features/news/ListSmallNews";
import { SEO } from "@/configs/seo.config";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { Container, Grid, Stack } from "@mui/material";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";

interface Props {
  highlightNews: INews;
  mediumNews: INews[];
  //   smallNews: INews[];
}

const ListNews: NextPage<Props> = ({
  highlightNews,
  mediumNews,
  //   smallNews,
}) => {
  return (
    <>
      <DefaultSeo {...SEO} title={"Danh sách bài viết"} />

      <Stack>
        {/* <img className={styles.banner} src={news?.banner_url} alt="banner" /> */}

        <Container maxWidth="lg">
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
                <Grid item xs={6} md={4} key={index}>
                  <CardNews
                    banner_url={news.banner_url}
                    slug={news.slug}
                    title={news.title}
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
    // const smallNews = getSmallNews();

    return {
      props: {
        highlightNews,
        mediumNews,
        // smallNews,
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
