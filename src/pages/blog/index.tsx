import { DefaultSeo } from "next-seo";
import { SEO } from "@/configs/seo.config";
import { CardNews } from "@/components/features/news";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { getPostsList } from '@/utils/posts';
import { PostList } from '@/@types/post';
import { GetStaticProps } from 'next';
import { SmallNews } from "@/components/features/news/components/SmallNews";
import { SearchBar } from "@/components/features/search/SearchBar";
import { useI18n } from "@/libs/i18n/I18nContext";
import { normalizeText } from "@/utils/common";
import newStyle from '../../styles/News.module.css';
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

export interface BlogListPageProps {
  seriesPosts: PostList[];
  highlightPosts: PostList[];
  nonHighlightPosts: PostList[];
  allPosts: PostList[];
}
export default function BlogListPage({ seriesPosts, highlightPosts, nonHighlightPosts, allPosts }: BlogListPageProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  // Index the accent-stripped form of each field (and search the accent-stripped
  // query) so matching is case- and diacritic-insensitive for Vietnamese.
  const fuse = useMemo(
    () =>
      new Fuse(allPosts, {
        keys: [
          { name: "title", weight: 2, getFn: (p) => normalizeText(p.title) },
          { name: "description", getFn: (p) => normalizeText(p.description) },
          { name: "tags", getFn: (p) => (p.tags || []).map(normalizeText) },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [allPosts]
  );

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    return fuse.search(normalizeText(trimmedQuery)).map((r) => r.item);
  }, [fuse, isSearching, trimmedQuery]);

  return (
    <div className={newStyle.container}>
      <DefaultSeo {...SEO} title={"Bài viết của tôi"} />
      <Stack>
        <Container maxWidth="xl">
          <Stack sx={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <SearchBar value={query} onChange={setQuery} onClear={() => setQuery("")} />
          </Stack>
        </Container>

        {isSearching ? (
          <>
            <Stack><Typography variant="h3" fontWeight="bold" textAlign="center">{t("blog.searchResultsTitle")}</Typography></Stack>
            <Container maxWidth="xl">
              <Stack sx={{ paddingTop: "40px", paddingBottom: "40px", gap: "30px" }}>
                {results.length > 0 ? (
                  <Grid container spacing={2}>
                    {results.map((post: PostList) => (
                      <Grid item xs={12} md={6} lg={3} key={post.slug}>
                        <CardNews post={post} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography textAlign="center" color="text.secondary">
                    {t("blog.searchNoResults")}
                  </Typography>
                )}
              </Stack>
            </Container>
          </>
        ) : (
          <>
            <Stack><Typography variant="h3" fontWeight="bold" textAlign="center">CÁC SERIES BÀI VIẾT</Typography></Stack>
            <Container maxWidth="xl">
              <Stack sx={{paddingTop: "40px", paddingBottom: "40px", gap: "30px"}}>
                <Grid container spacing={2}>
                  {seriesPosts.map((post: PostList) => (
                    <Grid item xs={12} md={6} lg={3} key={post.slug}>
                      <CardNews post={post} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Container>
            <Stack><Typography variant="h3" fontWeight="bold" textAlign="center">DANH SÁCH BÀI VIẾT</Typography></Stack>
            <Container maxWidth="xl">
              <Stack sx={{paddingTop: "40px", paddingBottom: "40px", gap: "30px"}}>
                <Grid container spacing={2}>
                  {highlightPosts.map((post: PostList) => (
                    <Grid item xs={12} md={6} lg={3} key={post.slug}>
                      <CardNews post={post} />
                    </Grid>
                  ))}
                </Grid>

                <Grid container spacing={2}>
                  {nonHighlightPosts.map((post: PostList) => (
                    <Grid item xs={12} md={6} lg={3} key={post.slug}>
                      <SmallNews post={post} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Container>
          </>
        )}
      </Stack>
    </div>
  );
}

export const getStaticProps: GetStaticProps<BlogListPageProps> = async () => {
  const { seriesPosts, highlightPostsNotSeries6, nonHighlightPostsNotSeries, allPosts } = getPostsList();

  // The list page never renders post `content`/`filePath`; drop them so the full
  // markdown of every post isn't shipped to the client as page data.
  const stripHeavy = (posts: PostList[]): PostList[] =>
    posts.map(({ content, filePath, ...rest }) => ({ ...rest, filePath: "" }));

  return {
    props: {
      seriesPosts: stripHeavy(seriesPosts),
      highlightPosts: stripHeavy(highlightPostsNotSeries6),
      nonHighlightPosts: stripHeavy(nonHighlightPostsNotSeries),
      allPosts: stripHeavy(allPosts),
    },
  };
}
