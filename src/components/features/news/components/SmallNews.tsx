/* eslint-disable @next/next/no-img-element */

import { ellipsisText } from "@/utils/common";
import { Grid, Stack, Typography, Box } from "@mui/material";
import Link from "next/link";
import { imageAbsolute } from "@/styles/commonStyles";
import logoImg from "../../../../../public/ktcb_logo_no_background.png";

interface Props {
  title: string;
  banner_url: string;
  description: string;
  slug: string;
}

export const SmallNews: React.FC<Props> = ({
  title,
  banner_url,
  description,
  slug,
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Link
          href={`/news/${slug}`}
          style={{
            display: "block",
            overflow: "hidden",
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#f4f4f4",
            paddingBottom: "60%",
            borderRadius: "10px",
          }}
        >
          <img
            className="absolute top-1 left-1 w-10 h-10 object-cover z-10"
            src={logoImg.src}
            alt="banner"
          />

          <Box
            component="img"
            alt="banner_url"
            src={banner_url}
            sizes="100vw"
            sx={{
              ...imageAbsolute,

              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </Link>
      </Grid>
      <Grid item xs={8}>
        <Stack>
          <Link href={`/news/${slug}`}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "4px",
                ...ellipsisText(),
              }}
            >
              {title}
            </Typography>
          </Link>

          <Typography
            sx={{
              fontSize: "18px",
              color: "#4f4f4f",
              textAlign: "justify",
              ...ellipsisText(4),
            }}
          >
            <Link href={`/news/${slug}`}>{description}</Link>
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};
