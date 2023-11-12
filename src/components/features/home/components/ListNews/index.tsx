/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { CardNews } from "./CardNews";

interface Props {
  team: string;
}

const ListNewsHome: NextPage<Props> = ({ team }) => {
  const highlightNews = getHighlightNews(team);
  const mediumNews = getMediumNews(team);
  const listNew = [highlightNews, ...mediumNews.slice(0, 5)];

  return (
    <Container sx={{ maxWidth: "1900px !important" }}>
      <Stack alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          DANH SÁCH BÀI VIẾT
        </Typography>
      </Stack>
      <Stack
        sx={{
          paddingTop: "60px",
          paddingBottom: "60px",
          gap: "30px",
        }}
      >
        <Grid container spacing={2}>
          {listNew.map((news, index) => (
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
