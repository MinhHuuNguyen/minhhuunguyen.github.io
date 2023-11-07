/* eslint-disable @next/next/no-img-element */

import { ReadMore } from "@/styles/styled";
import { ellipsisText } from "@/utils/common";
import { Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {hoverReadMore} from '@/styles/commonStyles'
interface Props {
  title: string;
  banner_url: string;
  slug: string;
  description: string;
}

export const CardNews: React.FC<Props> = ({
  title,
  banner_url,
  slug,
  description,
}) => {
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
        borderRadius: "6px",
        position: "relative",

        ...hoverReadMore

        
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
          padding: "12px 16px 4px",
          backdropFilter: "blur(10px)",
          flex: 1,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: "40%",

          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: -1,
          }}
        />

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
                xs: "16px",
                sm: "18px",
                md: "20px",
              },
              lineHeight: {
                xs: "26px",
                sm: "28px",
                md: "30px",
              },
              ...ellipsisText(1),
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
          <Typography
            sx={{
              color: "#fff",
              textAlign: "justify",

              ...ellipsisText(2),
            }}
          >
            {description}
          </Typography>

          <ReadMore
            className="read-more"
          >
            Đọc tiếp
          </ReadMore>
        </Link>
      </Stack>
    </Stack>
  );
};
