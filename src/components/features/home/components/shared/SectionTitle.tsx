import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { BLUE, gradientText } from "./tokens";

interface SectionTitleProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
}

/** Shared section heading: round gradient icon + uppercase eyebrow + gradient title + underline. */
export const SectionTitle = ({ icon, eyebrow, title }: SectionTitleProps) => (
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
