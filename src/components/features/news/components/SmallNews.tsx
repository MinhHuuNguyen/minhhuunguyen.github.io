/* eslint-disable @next/next/no-img-element */

import { ellipsisText } from "@/utils/common";
import { Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

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
      <Grid item xs={3}>
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
            }}
          >
            <Image
              width={120}
              height={87}
              alt="banner_url"
              src={banner_url}
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                bottom: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Link>
      </Grid>
      <Grid item xs={9}>
        <Stack>
          <Link href={`/news/${slug}`}>
            <Typography
              sx={{
                fontSize: "15px",
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
              fontSize: "14px",
              lineHeight: "140%",
              color: "#4f4f4f",
              textAlign: "justify",
              ...ellipsisText(3),
            }}
          >
            <Link href={`/news/${slug}`}>{description}</Link>
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};
