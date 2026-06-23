import { Box, Container, Stack, Typography } from "@mui/material";
import resume from "@/utils/data/resume.json";
import { parseResumeDate } from "@/utils/common";
import { cardSx, gradientText } from "../shared";

const isLecturer = (title: string) => title.toLowerCase().includes("lecturer");

const earliestStart = Math.min(
  ...resume.experience.map((e) => parseResumeDate(e.startDate).getTime())
);
const years = Math.floor(
  (Date.now() - earliestStart) / (1000 * 60 * 60 * 24 * 365.25)
);
const projectCount = resume.experience
  .filter((e) => !isLecturer(e.title))
  .reduce((sum, e) => sum + e.projects.length, 0);
const courseCount = resume.experience
  .filter((e) => isLecturer(e.title))
  .reduce((sum, e) => sum + e.projects.length, 0);

const stats: { value: string; label: string }[] = [
  { value: `${years}+`, label: "Năm kinh nghiệm" },
  { value: `${projectCount}+`, label: "Dự án AI/ML" },
  { value: `${courseCount}`, label: "Khoá đào tạo" },
  { value: `${resume.award.length}`, label: "Giải thưởng" },
];

export const HomeStats = () => (
  <Box component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: "#fff" }}>
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: { xs: 2, md: 3 },
        }}
      >
        {stats.map((stat) => (
          <Stack
            key={stat.label}
            alignItems="center"
            spacing={0.5}
            sx={{ py: { xs: 3, md: 4 }, px: 2, textAlign: "center", ...cardSx }}
          >
            <Typography
              // `years` is derived from the current date, so the statically
              // exported value can differ from the client at view time.
              suppressHydrationWarning
              sx={{
                fontFamily: '"Raleway", sans-serif',
                fontWeight: 800,
                fontSize: { xs: 34, md: 46 },
                lineHeight: 1,
                ...gradientText,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: { xs: 13, md: 15 },
              }}
            >
              {stat.label}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Container>
  </Box>
);
