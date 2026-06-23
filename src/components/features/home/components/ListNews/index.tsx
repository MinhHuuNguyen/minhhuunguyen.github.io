import { Box, Button, Container, Grid, Stack } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import Link from "next/link";
import { PostList } from "@/@types/post";
import { CardNews } from "@/components/features/news";
import { BLUE, SectionTitle } from "../shared";

interface Props {
  highlightPosts: PostList[];
}

const ListNewsHome = ({ highlightPosts }: Props) => (
  <Box component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: "#fff" }}>
    <Container sx={{ maxWidth: "var(--container-max-wide) !important" }}>
      <SectionTitle
        icon={<NewspaperRoundedIcon />}
        eyebrow="Chia sẻ"
        title="Bài viết nổi bật"
      />

      <Grid container spacing={2}>
        {highlightPosts.map((post, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <CardNews post={post} />
          </Grid>
        ))}
      </Grid>

      <Stack alignItems="center" sx={{ mt: { xs: 4, md: 5 } }}>
        <Button
          component={Link}
          href="/blog"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            px: 4,
            py: 1.25,
            borderRadius: "100rem",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            background: BLUE,
            boxShadow: "rgba(59, 169, 248, 0.4) 0px 8px 20px",
            transition: "all 0.3s ease",
            "&:hover": {
              background: BLUE,
              transform: "translateY(-4px)",
              boxShadow: "rgba(59, 169, 248, 0.5) 0px 12px 26px",
            },
          }}
        >
          Xem tất cả bài viết
        </Button>
      </Stack>
    </Container>
  </Box>
);

export default ListNewsHome;
