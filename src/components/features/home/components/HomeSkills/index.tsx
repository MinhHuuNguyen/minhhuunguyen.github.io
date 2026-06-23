import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { ReactNode } from "react";
import home from "@/utils/data/home.json";
import { BLUE, cardSx, roleChip, SectionTitle } from "../shared";

const areaIcons: ReactNode[] = [
  <TerminalRoundedIcon key="0" />,
  <CampaignRoundedIcon key="1" />,
  <GroupsRoundedIcon key="2" />,
];

export const HomeSkills = () => (
  <Box
    component="section"
    sx={{
      py: { xs: 5, md: 8 },
      background: "linear-gradient(180deg, #f3f9ff 0%, #ffffff 100%)",
    }}
  >
    <Container maxWidth="lg">
      <SectionTitle
        icon={<AutoAwesomeRoundedIcon />}
        eyebrow="Thế mạnh"
        title="Kỹ năng & công nghệ"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: { xs: 2, md: 3 },
          mb: { xs: 4, md: 5 },
        }}
      >
        {home.skills.areas.map((area, index) => (
          <Stack
            key={area.name}
            spacing={1.25}
            sx={{ p: { xs: 2.5, md: 3 }, height: "100%", ...cardSx }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                background: BLUE,
                boxShadow: "rgba(59, 169, 248, 0.4) 0px 6px 16px",
              }}
            >
              {areaIcons[index % areaIcons.length]}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
              {area.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {area.desc}
            </Typography>
          </Stack>
        ))}
      </Box>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        justifyContent="center"
      >
        {home.skills.stacks.map((tech) => (
          <Chip key={tech} label={tech} sx={roleChip} />
        ))}
      </Stack>
    </Container>
  </Box>
);
