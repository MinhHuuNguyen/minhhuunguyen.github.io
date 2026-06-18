import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import data from "@/utils/data/resume.json";
import { getDuration } from "@/utils/common";

const BLUE = "linear-gradient(135deg, #84c8f8, #3ba9f8)";
const PINK = "#fa4996";

const gradientText = {
  background: "linear-gradient(135deg, #3ba9f8, #1f74d0)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

const cardSx = {
  bgcolor: "#fff",
  borderRadius: 3,
  boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 15px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "rgba(59, 169, 248, 0.22) 0px 12px 28px",
  },
} as const;

const datePill = {
  mt: 1,
  fontWeight: 600,
  color: "#1f8ae0",
  bgcolor: "rgba(59, 169, 248, 0.12)",
  border: "1px solid rgba(59, 169, 248, 0.25)",
} as const;

const roleChip = {
  fontWeight: 600,
  color: "#1f8ae0",
  bgcolor: "rgba(59, 169, 248, 0.12)",
  border: "1px solid rgba(59, 169, 248, 0.25)",
} as const;

/** A row of circular logos that overlap slightly (close together). */
const LogoCluster = ({
  logos,
  alt,
  size = 56,
}: {
  logos: string[];
  alt: string;
  size?: number;
}) => (
  <Stack direction="row" sx={{ flexShrink: 0 }}>
    {logos.map((src, i) => (
      <Box
        key={src}
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          bgcolor: "#fff",
          border: "2px solid #fff",
          boxShadow:
            "0 0 0 2px rgba(59, 169, 248, 0.4), rgba(0, 0, 0, 0.12) 0px 4px 10px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: i === 0 ? 0 : `-${Math.round(size / 3)}px`,
          zIndex: logos.length - i,
        }}
      >
        <Image
          src={src}
          alt={`${alt} ${i + 1}`}
          width={size}
          height={size}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: 6,
          }}
        />
      </Box>
    ))}
  </Stack>
);

const SectionTitle = ({
  icon,
  eyebrow,
  title,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}) => (
  <Stack alignItems="center" spacing={1} sx={{ mb: { xs: 3, md: 4 } }}>
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        background: BLUE,
        boxShadow: "rgba(59, 169, 248, 0.4) 0px 6px 16px",
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        letterSpacing: 3,
        fontWeight: 700,
        fontSize: 12,
        color: "#1f8ae0",
        textTransform: "uppercase",
      }}
    >
      {eyebrow}
    </Typography>
    <Typography
      variant="h4"
      component="h2"
      sx={{
        fontWeight: 800,
        fontFamily: '"Raleway", sans-serif',
        textAlign: "center",
        ...gradientText,
      }}
    >
      {title}
    </Typography>
    <Box sx={{ width: 60, height: 4, borderRadius: 2, background: BLUE }} />
  </Stack>
);

export const ResumeComponent = () => {
  const router = useRouter();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 8 },
        background: "linear-gradient(180deg, #ffffff 0%, #f3f9ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Profile header */}
        <Stack alignItems="center" spacing={1.25} sx={{ mb: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              width: { xs: 116, md: 132 },
              height: { xs: 116, md: 132 },
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #fff",
              boxShadow:
                "rgba(59, 169, 248, 0.45) 0px 5px 16px, rgba(250, 73, 150, 0.25) 0px 12px 30px",
            }}
          >
            <Image
              src={data.personal.avatar}
              alt={data.personal.name}
              width={132}
              height={132}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: '"Raleway", sans-serif',
              textAlign: "center",
              ...gradientText,
            }}
          >
            {data.personal.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            justifyContent="center"
          >
            {data.personal.title.map((title) => (
              <Chip key={title} label={title} size="small" sx={roleChip} />
            ))}
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnRoundedIcon sx={{ fontSize: 18, color: PINK }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {data.personal.social.location}
            </Typography>
          </Stack>
        </Stack>

        {/* Experience — horizontal timeline */}
        <SectionTitle
          icon={<WorkOutlineRoundedIcon />}
          eyebrow="Về tôi"
          title="Kinh nghiệm làm việc"
        />

        <Box sx={{ position: "relative", maxWidth: 980, mx: "auto" }}>
          {/* horizontal axis line (md+), centered on the pink dots */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              left: "8%",
              right: "8%",
              top: "73px",
              transform: "translateY(-50%)",
              height: 3,
              borderRadius: 2,
              background: BLUE,
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: { xs: 2.5, md: 3 },
              position: "relative",
              zIndex: 1,
            }}
          >
            {data.experience.map((job, index) => {
              const duration = getDuration(job.startDate, job.endDate);
              return (
                <Stack
                  key={index}
                  alignItems="center"
                  spacing={1.25}
                  sx={{ height: "100%" }}
                >
                  <LogoCluster logos={job.logo} alt={job.company} size={56} />

                  {/* pink node dot sitting on the axis line */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: PINK,
                      border: "3px solid #fff",
                      boxShadow: "rgba(250, 73, 150, 0.45) 0px 0px 0px 3px",
                    }}
                  />

                  <Stack
                    sx={{
                      width: "100%",
                      flexGrow: 1,
                      p: { xs: 2, md: 2.25 },
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      ...cardSx,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.3,
                        fontSize: { xs: 17, md: 18 },
                      }}
                    >
                      {job.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontStyle: "italic",
                        mt: 0.25,
                        fontSize: 14,
                      }}
                    >
                      {job.company}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${job.startDate} – ${job.endDate}${
                        duration ? ` · ${duration}` : ""
                      }`}
                      sx={datePill}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Box>
        </Box>

        {/* Education */}
        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <SectionTitle
            icon={<SchoolRoundedIcon />}
            eyebrow="Nền tảng"
            title="Học vấn"
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: { xs: 2, md: 3 },
              maxWidth: 760,
              mx: "auto",
            }}
          >
            {data.education.map((edu, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ p: { xs: 2, md: 2.25 }, ...cardSx }}
              >
                <LogoCluster logos={edu.logo} alt={edu.school} size={52} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {edu.degree}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 0.25 }}
                  >
                    {edu.school}
                  </Typography>
                  <Chip size="small" label={edu.duration} sx={datePill} />
                </Box>
              </Stack>
            ))}
          </Box>
        </Box>

        {/* CTA */}
        <Stack alignItems="center" sx={{ mt: { xs: 5, md: 6 } }}>
          <LoadingButton
            onClick={() => router.push("/resume")}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              px: 4,
              py: 1.25,
              borderRadius: "100rem",
              color: "#fff",
              fontWeight: 700,
              textTransform: "none",
              background: BLUE,
              boxShadow: "rgba(59, 169, 248, 0.4) 0px 8px 20px",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                background: BLUE,
                boxShadow: "rgba(59, 169, 248, 0.5) 0px 12px 26px",
              },
            }}
          >
            Xem thêm
          </LoadingButton>
        </Stack>
      </Container>
    </Box>
  );
};
