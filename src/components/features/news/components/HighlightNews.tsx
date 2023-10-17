import { ellipsisText } from "@/utils/common";
import { Grid, Stack, Typography } from "@mui/material";
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
        sm={5}
        xs={0}
        sx={{
          height: {
            xs: "300px",
            md: "inherit",
          },
        }}
      ></Grid>

      <Grid
        item
        md={4}
        sm={7}
        xs={12}
        sx={{
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        />
        <Stack
          sx={{
            gap: "20px",
            padding: {
              xs: "40px",
              md: "20px",
            },
            height: "100%",
            backdropFilter: "blur(10px)",
            justifyContent: "space-evenly",
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
              textAlign: "justify",

              ...ellipsisText(5),

              WebkitLineClamp: {
                xs: 5,
                md: 7,
              },
            }}
          >
            {description}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};
