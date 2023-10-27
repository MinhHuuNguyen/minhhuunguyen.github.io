import { DataResponseInfinite } from "@/@types/common";
import { INews } from "@/@types/news";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { ellipsisText, loadMoreNews } from "@/utils/common";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Gallery } from "react-grid-gallery";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const images = [
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    // width: 320,
    // height: 174,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    // width: 320,
    // height: 212,

    alt: "Boats (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    // width: 320,
    // height: 212,
  },
];

export const NewsLoadMore = () => {
  const [newsSelected, setNewsSelected] = useState<INews>();

  const [opened, { open, close }] = useDisclosure(false);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<DataResponseInfinite<INews[]>>(
      ["smallNews"],
      async ({ pageParam = null }) => {
        const res = await loadMoreNews(pageParam);

        const data = res.data.map((item) => ({
          ...item,
          src: item.banner_url,
        }));

        console.log("res", res.data);

        return {
          ...res,
          data,
        };
      },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage?.pageKey) {
            return lastPage.pageKey;
          }

          return undefined;
        },
      }
    );

  const dataFlat = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data)?.filter((d) => d);
  }, [data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <Container maxWidth="xl">
      <Stack
        sx={{
          gap: {
            xs: "20px",
            sm: "25px",
            md: "30px",
          },
        }}
      >
        <Gallery
          enableImageSelection={false}
          onClick={(e) => {
            console.log(e);
            console.log(dataFlat[e]);
          }}
          images={dataFlat}
        />

        {!(isFetching && !isFetchingNextPage) ? (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1400: 4 }}
          >
            <Masonry gutter="16px" style={{ paddingRight: "16px" }}>
              {dataFlat && dataFlat?.length > 0
                ? dataFlat.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: "10px",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.banner_url}
                          alt="banner_url"
                          sx={{
                            cursor: "pointer",
                            borderRadius: "10px",
                            width: "100%",
                            display: "block",
                            objectFit: "cover",
                            transform: "scale(1)",
                            transition: "transform 0.3s ease-in-out",
                            overflow: "hidden",

                            "&:hover": {
                              transform: "scale(1.1) !important",
                              transition:
                                "transform 0.3s ease-in-out !important",
                            },
                          }}
                          onClick={() => {
                            setNewsSelected(item);
                            open();
                          }}
                          loading="lazy"
                        />
                      </Box>
                    );
                  })
                : null}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <Box sx={{ display: "flex" }}>
            <CircularProgress
              size={"16px"}
              sx={{
                color: "#fff",
              }}
            />
          </Box>
        )}

        {hasNextPage && (
          <LoadingButton
            variant="outlined"
            onClick={handleLoadMore}
            disabled={!hasNextPage || isFetchingNextPage}
            loading={isFetchingNextPage}
            sx={{
              alignSelf: "center",
              width: "fit-content",
            }}
          >
            Xem thêm
          </LoadingButton>
        )}
      </Stack>

      <Modal open={opened} onClose={close}>
        {newsSelected ? (
          <Grid
            container
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "80vw",
              width: "100%",
              height: "auto",
              minHeight: "700px",
              bgcolor: "background.paper",
            }}
          >
            <Grid
              item
              xs={9}
              sx={{
                position: "relative",
                paddingTop: "50%",
                backgroundColor: "#000",
                paddingRight: "16px",
                paddingLeft: "16px",
              }}
            >
              <Box
                component="img"
                src={newsSelected.banner_url}
                alt="news"
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",

                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </Grid>
            <Grid
              item
              xs={3}
              p={2}
              sx={{
                backgroundColor: "#242526",
              }}
            >
              <Typography
                sx={{
                  color: "#e4e6eb",
                  fontSize: "26px",
                  fontWeight: "700",
                  ...ellipsisText(1),
                }}
              >
                {newsSelected.title}
              </Typography>

              <Typography
                sx={{
                  color: "#e4e6eb",
                  textAlign: "justify",
                  ...ellipsisText(5),
                  mt: 2,
                  WebkitLineClamp: {
                    xs: 5,
                    md: 7,
                  },
                }}
              >
                {newsSelected.description}
              </Typography>

              <Typography sx={{ mt: 1, color: "#e4e6eb" }}>
                {newsSelected.time}
              </Typography>

              <Link href={`/news/${newsSelected.slug}`}>
                <Typography
                  sx={{
                    cursor: "pointer",
                    color: "#e4e6eb",
                    mt: 1,
                    fontWeight: "600",
                  }}
                >
                  Đọc tiếp
                </Typography>
              </Link>
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
};
