/* eslint-disable @next/next/no-img-element */

import { ChevronRightIcon } from "@/components/shared/icons/ChevronRightIcon";
import { ellipsisText } from "@/utils/common";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  banner_url: string;
  slug: string;
}

export const CardNews: React.FC<Props> = ({ title, banner_url, slug }) => {
  const [loadedFile, setLoadedFile] = useState(false);
  const [imgUrl, setImgUrl] = useState(banner_url);

  useEffect(() => {
    setImgUrl(banner_url);
  }, [banner_url]);

  return (
    <Stack
      sx={{
        height: "100%",
        overflow: "hidden",
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px",
      }}
    >
      <Link
        href={`/news/${slug}`}
        style={{
          overflow: "hidden",
          position: "relative",
          paddingTop: "70%",
        }}
      >
        {!loadedFile && (
          <Skeleton
            width={"100%"}
            height={"100%"}
            sx={{
              transform: "unset",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "unset",
            }}
          />
        )}

        <Image
          alt="nft"
          src={imgUrl}
          width={300}
          height={120}
          sizes="100vw"
          style={{
            display: "block",
            position: "absolute",
            top: 0,
            left: 0,
            width: loadedFile ? "100%" : "0%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
          onLoad={() => {
            setLoadedFile(true);
          }}
          onError={() => {
            setLoadedFile(true);
          }}
        />
      </Link>
      <Stack
        sx={{
          padding: "12px 16px",
          backgroundColor: "#00aeef",
          flex: 1,
        }}
      >
        <Link
          href={`/news/${slug}`}
          style={{
            width: "fit-content",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              flex: 1,
              fontWeight: 600,
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },
              lineHeight: {
                xs: "24px",
                sm: "26px",
                md: "28px",
              },
              ...ellipsisText(3),

              WebkitLineClamp: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {title}
          </Typography>
        </Link>

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
    </Stack>
  );
};
