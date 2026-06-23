import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { Box, Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import resume from "@/utils/data/resume.json";
import home from "@/utils/data/home.json";
import { BLUE, PINK } from "./shared";

const styleBtn = {
  position: "absolute",
  top: "42%",
  zIndex: 3,
  width: 48,
  height: 48,
  color: "#fff",
  backgroundColor: "rgba(255, 255, 255, 0.18)",
  border: "1px solid rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(6px)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.32)",
  },
} as const;

const ctaBase = {
  px: 4,
  py: 1.25,
  borderRadius: "100rem",
  fontWeight: 700,
  textTransform: "none",
  transition: "all 0.3s ease",
} as const;

const primaryCta = {
  ...ctaBase,
  color: "#fff",
  background: BLUE,
  boxShadow: "rgba(59, 169, 248, 0.45) 0px 8px 22px",
  "&:hover": {
    background: BLUE,
    transform: "translateY(-3px)",
    boxShadow: "rgba(59, 169, 248, 0.55) 0px 12px 28px",
  },
} as const;

const secondaryCta = {
  ...ctaBase,
  color: "#fff",
  bgcolor: "rgba(255, 255, 255, 0.14)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(6px)",
  "&:hover": {
    bgcolor: "rgba(255, 255, 255, 0.26)",
    transform: "translateY(-3px)",
    border: "1px solid #fff",
  },
} as const;

type CoverImageSlideType = {
  coverImageData: string[];
};

const renderNextButton = (props: { isDisabled?: boolean }) => (
  <IconButton disabled={props.isDisabled} sx={{ ...styleBtn, right: 16 }}>
    <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
  </IconButton>
);

const renderPrevButton = (props: { isDisabled?: boolean }) => (
  <IconButton disabled={props.isDisabled} sx={{ ...styleBtn, left: 16 }}>
    <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
  </IconButton>
);

export const CoverImageSlide: React.FC<CoverImageSlideType> = ({
  coverImageData,
}) => {
  // AliceCarousel computes clones / active slide / transforms on the client,
  // so its markup differs from the server render and breaks hydration. Mount it
  // only after hydration and show a static first image during SSR so the server
  // and initial client render stay identical.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const listImageCard = coverImageData.map((url, index) => (
    <Box
      key={`${index}${url}`}
      sx={{ position: "relative", width: "100%", height: { xs: "72vh", md: "85vh" } }}
    >
      <Image
        src={url}
        alt={`${resume.personal.name} ${index + 1}`}
        fill
        priority={index === 0}
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
    </Box>
  ));

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        isolation: "isolate",
        // Float the carousel dots over the bottom of the image.
        "& .alice-carousel__dots": {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 20,
          margin: 0,
          zIndex: 3,
        },
        "& .alice-carousel__dots-item:not(.__custom)": {
          width: 9,
          height: 9,
          backgroundColor: "rgba(255, 255, 255, 0.55)",
        },
        "& .alice-carousel__dots-item:not(.__custom):hover, & .alice-carousel__dots-item:not(.__custom).__active":
          {
            backgroundColor: "#fff",
          },
      }}
    >
      {mounted ? (
        <AliceCarousel
          autoPlay
          infinite
          autoPlayInterval={8000}
          items={listImageCard}
          disableButtonsControls={false}
          renderPrevButton={renderPrevButton}
          renderNextButton={renderNextButton}
        />
      ) : (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "72vh", md: "85vh" },
          }}
        >
          <Image
            src={coverImageData[0]}
            alt={resume.personal.name}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </Box>
      )}

      {/* Dark scrim so the overlay text stays legible over any photo. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.68) 100%)",
        }}
      />

      {/* Identity overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          px: 2,
          pb: { xs: 9, md: 12 },
        }}
      >
        <Stack alignItems="center" spacing={2} sx={{ textAlign: "center", maxWidth: 880 }}>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            justifyContent="center"
          >
            {resume.personal.title.map((title) => (
              <Chip
                key={title}
                label={title}
                size="small"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  bgcolor: "rgba(255, 255, 255, 0.18)",
                  border: "1px solid rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(6px)",
                }}
              />
            ))}
          </Stack>

          <Typography
            component="h1"
            sx={{
              fontFamily: '"Raleway", sans-serif',
              fontWeight: 800,
              color: "#fff",
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              fontSize: { xs: 34, sm: 48, md: 64 },
              lineHeight: 1.05,
            }}
          >
            {resume.personal.name}
          </Typography>

          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.92)",
              textShadow: "0 2px 12px rgba(0,0,0,0.55)",
              fontSize: { xs: 15, md: 20 },
              maxWidth: 680,
            }}
          >
            {home.hero.tagline}
          </Typography>

          <Stack direction="row" spacing={0.75} alignItems="center">
            <LocationOnRoundedIcon sx={{ fontSize: 18, color: PINK }} />
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
              {resume.personal.social.location}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ mt: 1, pointerEvents: "auto" }}
          >
            {home.hero.ctas.map((cta, index) => (
              <Button
                key={cta.href}
                component={Link}
                href={cta.href}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={index === 0 ? primaryCta : secondaryCta}
              >
                {cta.label}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};
