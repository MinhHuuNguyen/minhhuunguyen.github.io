import { ChevronRightIcon } from "@/components/shared/icons/ChevronRightIcon";
import { ellipsisText } from "@/utils/common";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface Props {
  title: string;
  banner_url: string;
  description: string;
  slug: string;
}

export const HighlightNews: React.FC<Props> = ({
  title,
  banner_url,
  description,
  slug,
}) => {
  return (
    <Grid
      container
      sx={{
        height: "400px",
        background: `url(${banner_url}) no-repeat center center`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Grid
        item
        md={8}
        xs={12}
        sx={{
          height: {
            xs: "300px",
            md: "inherit",
          },
        }}
      ></Grid>

      <Grid item md={4} xs={4}>
        <Stack
          sx={{
            gap: "20px",
            // backgroundColor: "#00aeef",
            padding: "40px",
            height: "100%",
            backdropFilter: "blur(10px)",
          }}
        >
          <Link href={`/news/${slug}`}>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "26px",
                fontWeight: "700",

                ...ellipsisText(2),
              }}
            >
              {title}
            </Typography>
          </Link>

          <Typography
            sx={{
              color: "#fff",
              ...ellipsisText(5),

              WebkitLineClamp: {
                xs: 3,
                sm: 4,
                md: 5,
              },
            }}
          >
            {description}
          </Typography>

          <Link
            href={`/news/${slug}`}
            style={{
              width: "fit-content",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                padding: "4px 0",
              }}
            >
              <ChevronRightIcon width={20} height={20} fill={"#fff"} />
              <span
                style={{
                  color: "#fff",
                  alignSelf: "flex-end",
                }}
              >
                Xem thêm
              </span>
            </Box>
          </Link>
        </Stack>
      </Grid>
    </Grid>
  );
};
