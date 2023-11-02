/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { getMediumNews } from "@/utils/common";
import { Container, Grid, Stack } from "@mui/material";
import { NextPage } from "next";
import { CardNews } from "./CardNews";

interface Props {
  highlightNews?: INews;
  mediumNews?: INews[];
}

const ListNewsHome: NextPage<Props> = () => {
  const mediumNews = getMediumNews().slice(0, 6);
  console.log(111, { mediumNews });

  return (
    <Container maxWidth="xl">
      <Stack
        sx={{
          paddingTop: "60px",
          paddingBottom: "60px",
          gap: "30px",
        }}
      >
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
      </Stack>
    </Container>
  );
};

export default ListNewsHome;
