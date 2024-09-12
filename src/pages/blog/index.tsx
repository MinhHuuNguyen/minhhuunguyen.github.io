import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { CardNews, HighlightNews } from "@/components/features/news";
import { CoverImageBrand } from "@/components/features/home/components/CoverImageBrand";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { getPostsList } from '@/utils/posts';
import { PostList } from '@/@types/post';
import { GetStaticProps } from 'next';

export interface BlogListPageProps {
	posts: PostList[]
}
export default function BlogListPage({ posts }: BlogListPageProps) {
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
              {posts.map((post: any, index: any) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <CardNews key={index} post={post} />
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
	// convert markdown files into list of javascript objects
	const postList = await getPostsList()

	return {
		props: {
			posts: postList,
		},
	}
}