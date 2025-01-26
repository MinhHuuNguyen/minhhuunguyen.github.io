import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { CardNews } from "@/components/features/news";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { getPostsList } from '@/utils/posts';
import { PostList } from '@/@types/post';
import { GetStaticProps } from 'next';
import { SmallNews } from "@/components/features/news/components/SmallNews";
import newStyle from '../../styles/News.module.css';

export interface BlogListPageProps {
  highlightPosts: PostList[];
  nonHighlightPosts: PostList[];
}
export default function BlogListPage({ highlightPosts, nonHighlightPosts }: BlogListPageProps) {
  return (
    <div className={newStyle.container}>
      <DefaultSeo {...SEO} title={"MY BLOG"} />
      <Stack>
        <Stack alignItems="center">
          <Typography variant="h2" fontWeight="bold" textAlign="center">MY BLOG</Typography>
          <br></br>
        </Stack>
        <Container maxWidth="xl">
          <Stack
            sx={{
              paddingTop: "40px",
              paddingBottom: "40px",
              gap: "30px",
            }}
          >

            <Grid container spacing={2}>
              {highlightPosts.map((post: any, index: any) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <CardNews key={index} post={post} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              {nonHighlightPosts.map((post: any, index: any) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <SmallNews key={index} post={post} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Stack>
    </div>
  );
}

export const getStaticProps: GetStaticProps<BlogListPageProps> = async () => {
  const { highlightPosts, nonHighlightPosts } = getPostsList();

  return {
    props: {
      highlightPosts: highlightPosts,
      nonHighlightPosts: nonHighlightPosts,
    },
  };
}