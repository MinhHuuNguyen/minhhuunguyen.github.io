import { Box, Button, Container, Stack, Typography } from "@mui/material";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ReactNode } from "react";
import home from "@/utils/data/home.json";
import { BLUE } from "../shared";

const filledBtn = {
  px: 3.5,
  py: 1.25,
  borderRadius: "100rem",
  fontWeight: 700,
  textTransform: "none",
  color: "var(--color-secondary)",
  bgcolor: "#fff",
  transition: "all 0.3s ease",
  "&:hover": { bgcolor: "#fff", transform: "translateY(-3px)" },
} as const;

const outlineBtn = {
  px: 3.5,
  py: 1.25,
  borderRadius: "100rem",
  fontWeight: 700,
  textTransform: "none",
  color: "#fff",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  transition: "all 0.3s ease",
  "&:hover": {
    border: "1px solid #fff",
    bgcolor: "rgba(255, 255, 255, 0.15)",
    transform: "translateY(-3px)",
  },
} as const;

type ContactLink = {
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
  primary?: boolean;
};

const links: ContactLink[] = [
  {
    label: "Email",
    href: `mailto:${home.contact.email}`,
    icon: <EmailRoundedIcon />,
    primary: true,
  },
  {
    label: "LinkedIn",
    href: home.contact.linkedin,
    icon: <LinkedInIcon />,
    external: true,
  },
  {
    label: "GitHub",
    href: home.contact.github,
    icon: <GitHubIcon />,
    external: true,
  },
];

export const HomeContact = () => (
  <Box component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: "#fff" }}>
    <Container maxWidth="lg">
      <Stack
        alignItems="center"
        spacing={2.5}
        sx={{
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 8 },
          borderRadius: 5,
          textAlign: "center",
          color: "#fff",
          background: BLUE,
          boxShadow: "rgba(59, 169, 248, 0.45) 0px 18px 40px",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: '"Raleway", sans-serif',
            fontWeight: 800,
            fontSize: { xs: 26, md: 38 },
            lineHeight: 1.15,
          }}
        >
          {home.contact.heading}
        </Typography>
        <Typography sx={{ maxWidth: 560, opacity: 0.95, fontSize: { xs: 15, md: 17 } }}>
          {home.contact.desc}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mt: 1 }}
        >
          {links.map((link) => (
            <Button
              key={link.label}
              component="a"
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              startIcon={link.icon}
              sx={link.primary ? filledBtn : outlineBtn}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Stack>
    </Container>
  </Box>
);
