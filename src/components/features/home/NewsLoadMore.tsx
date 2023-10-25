import { DataResponseInfinite } from "@/@types/common";
import { INews } from "@/@types/news";
import { useDisclosure } from "@/libs/hooks/useDisclosure";
import { loadMoreSmallNews } from "@/utils/common";
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
import Image from "next/image";
import { useMemo } from "react";

export const NewsLoadMore = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery<DataResponseInfinite<INews[]>>(
      ["smallNews"],
      async ({ pageParam = null }) => {
        const res = await loadMoreSmallNews(pageParam);

        return res;
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

  const _itemPerRow = {
    xs: 12,
    sm: 6,
    md: 4,
  };

  return (
    <Container maxWidth="lg">
      <Stack
        sx={{
          gap: {
            xs: "20px",
            sm: "25px",
            md: "30px",
          },
          alignItems: "center",
        }}
      >
        {!(isFetching && !isFetchingNextPage) ? (
          <Grid container spacing={2}>
            {dataFlat && dataFlat?.length > 0
              ? dataFlat.map((item, index) => (
                  <Grid key={index} item {..._itemPerRow}>
                    <Box
                      sx={{
                        overflow: "hidden",
                        borderRadius: "8px",
                        position: "relative",
                        paddingTop: "100%",
                        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px",

                        "&:hover > img": {
                          cursor: "pointer",
                          transform: "scale(1.1) !important",
                          transition: "transform 0.3s ease-in-out !important",
                        },
                      }}
                      onClick={() => {
                        open();
                      }}
                    >
                      <Image
                        className="banner"
                        width={120}
                        height={87}
                        alt="banner_url"
                        src={item.banner_url}
                        sizes="100vw"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          bottom: "0",
                          left: "0",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                          overflow: "hidden",

                          transform: "scale(1)",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                  </Grid>
                ))
              : null}
          </Grid>
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
          >
            Xem thêm
          </LoadingButton>
        )}
      </Stack>

      <Modal
        open={opened}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};
