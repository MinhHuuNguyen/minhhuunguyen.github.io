import { Container, Grid, Stack, Typography } from "@mui/material";
import { PostList } from "@/@types/post";
import { CardNews } from "@/components/features/news";

interface Props {
  highlightPosts: PostList[];
}

const ListNewsHome = ({ highlightPosts}: Props) => {
  const listNew = [...highlightPosts];

  return(
    <Container
      sx={{
        maxWidth: "1900px !important",
        paddingTop: 0,
      }}
    >
      <Stack alignItems="center">
        <Typography variant="h2" fontWeight="bold" textAlign="center">MY BLOG</Typography>
        <br></br>
      </Stack>
      <Stack>
        <Grid container spacing={2}>
          {listNew.map((post, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <CardNews key={index} post={post} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

export default ListNewsHome;
