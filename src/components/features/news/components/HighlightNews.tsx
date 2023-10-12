import { ChevronRightIcon } from "@/components/shared/icons/ChevronRightIcon";
import { ellipsisText } from "@/utils/common";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
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
        minHeight: "350px",
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
      >
        <Link href={`/news/${slug}`}>
          <Image
            src={banner_url}
            alt="banner_url"
            sizes="100vw"
            width={300}
            height={120}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Link>
      </Grid>

      <Grid item md={4} xs={12}>
        <Stack
          sx={{
            gap: "20px",
            backgroundColor: "#00aeef",
            padding: "20px",
            height: "100%",
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
