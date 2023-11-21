/* eslint-disable @next/next/no-img-element */
import { Box, Stack, Typography } from "@mui/material";
import "react-alice-carousel/lib/alice-carousel.css";
import React from "react";

import brandImages from "../../../../utils/data/json/teams/bannerListNew/banner-list-new.json";

const overlayStyle = {
  backgroundColor: "black",
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 101,
  transition: "opacity 0.3s",
};

type CoverImageBrandType = {
  team?: string;
};

const textConvertTeam = {
  home: "trang chủ",
  "cung-be-trai-nghiem": "cùng bé trải nghiệm",
  "yeu-cung-be": "yêu cùng bé",
  "kien-truc-su-tinh-nguyen": "kiến trúc sư tình nguyện",
  "truyen-thong": "truyền thông",
  "noi-dung": "nội dung",
  "quy-ktcb": "quỹ ktcb",
  "chuong-trinh-khac": "chương trình khác",
};

export const CoverImageBrand: React.FC<CoverImageBrandType> = ({ team }) => {
  const imageUrl = team
    ? brandImages[team as keyof typeof brandImages]
    : brandImages["home"];
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Box
      className="relative w-full h-[90vh]"
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        position="absolute"
        sx={{ top: 0, right: 0, zIndex: 100 }}
        component="img"
        width="100%"
        height="100%"
        src={imageUrl}
      />
      <Stack
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        sx={{ ...overlayStyle, opacity: isHovered ? 0.3 : 0 }}
      >
        <Typography color="white">
          DANH SÁCH BÀI VIẾT{" "}
          {textConvertTeam[team as keyof typeof textConvertTeam].toUpperCase()}
        </Typography>
      </Stack>
    </Box>
  );
};
