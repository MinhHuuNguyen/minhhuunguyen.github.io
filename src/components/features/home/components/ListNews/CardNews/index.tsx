/* eslint-disable @next/next/no-img-element */

import { hoverReadMore, imageAbsolute } from "@/styles/commonStyles";
import { ImageLoader, ReadMore } from "@/styles/styled";
import { ellipsisText } from "@/utils/common";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const CardNews =  ({ post }: { post: any }) => {
 const [loadedFile, setLoadedFile] = useState(false);
  return (
    <Stack
      sx={{
        height: "100%",
        overflow: "hidden",
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px",
        borderRadius: "6px",
        position: "relative",

        ...hoverReadMore,
      }}
    >
      <Link
        href={`blog/${post.slug}`}
        style={{
          overflow: "hidden",
          position: "relative",
          paddingTop: "70%",
        }}
      >
        {!loadedFile && <ImageLoader />}

        <Image
          alt="img"
          src={post.banner_url}
          width={300}
          height={120}
          sizes="100vw"
          style={{
            ...imageAbsolute,
            width: loadedFile ? "100%" : "0%",
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
          backdropFilter: "blur(50px)",
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: -1,
          }}
        />

        <Link
          href={`blog/${post.slug}`}
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
                xs: "25px",
                sm: "27px",
                md: "29px",
              },
              ...ellipsisText(1),
            }}
          >
            {post.title}
          </Typography>
        </Link>

        <Link
          href={`blog/${post.slug}`}
          style={{
            width: "fit-content",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              textAlign: "justify",
              fontSize: {
                xs: "15px",
                sm: "17px",
                md: "19px",
              },

              ...ellipsisText(2),
            }}
          >
            {post.description}
          </Typography>

          <ReadMore className="read-more">Load more</ReadMore>
        </Link>
      </Stack>
    </Stack>
  );
};
