import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { CardNews } from "@/components/features/news";
import { CoverImageBrand } from "@/components/features/home/components/CoverImageBrand";
import { Container, Grid, Stack } from "@mui/material";
import { getPostsList } from '@/utils/posts';
import { PostList } from '@/@types/post';
import { GetStaticProps } from 'next';
import { SmallNews } from "@/components/features/news/components/SmallNews";

export interface BlogListPageProps {
  highlightPosts: PostList[];
  nonHighlightPosts: PostList[];
}
export default function BlogListPage({ highlightPosts, nonHighlightPosts }: BlogListPageProps) {
  return (
    <>
      <DefaultSeo {...SEO} title={"Danh sách bài viết"} />
      <Stack>
        <CoverImageBrand />
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
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <CardNews key={index} post={post} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              {nonHighlightPosts.map((post: any, index: any) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <SmallNews key={index} post={post} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Stack>

    </>
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