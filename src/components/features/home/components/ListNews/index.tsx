/* eslint-disable @next/next/no-img-element */

import { INews } from "@/@types/news";
import { getHighlightNews, getMediumNews } from "@/utils/common";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { CardNews } from "./CardNews";
import { useMemo } from "react";

interface Props {
  team: string;
}

const ListNewsHome: NextPage<Props> = ({ team }) => {
  const highlightNews = getHighlightNews(team);
  const mediumNews = getMediumNews(team);
  const listNew = useMemo(() => {
    return [highlightNews, ...mediumNews.slice(0, 5)].filter((x) => x);
  }, [highlightNews, mediumNews]);

  return listNew && listNew?.length > 0 ? (
    <Container sx={{ maxWidth: "1900px !important" }}>
      <Stack alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          BÀI VIẾT GẦN ĐÂY
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
                banner_url={news?.banner_url}
                slug={news?.slug}
                title={news?.title}
                description={news?.description}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  ) : null;
};

export default ListNewsHome;
