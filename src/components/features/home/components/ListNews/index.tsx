import { Container, Grid, Stack, Typography } from "@mui/material";
import { PostList } from "@/@types/post";
import { CardNews } from "./CardNews"; // Import component CardNews
import background from "../../../../../../public/default-background.jpg"; // Đường dẫn tới ảnh nền

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
        backgroundImage: `url(${background.src})`,
        backgroundSize: "100% 100%;",
        backgroundPosition: "center",
      }}
    >
      <Stack alignItems="center">
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
          FEATURED NEWS
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
