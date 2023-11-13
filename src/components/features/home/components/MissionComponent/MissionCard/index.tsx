/* eslint-disable @next/next/no-img-element */
import { Box, Paper, Stack, Typography } from "@mui/material";
import logoImg from "../../../../../../../public/ktcb-logo-512.png";

type MissionCardProps = {
  missionCard: { title: string; imageUrl: string; description: string };
};

export const MissionCard: React.FC<MissionCardProps> = ({ missionCard }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: "10px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
        height: "100%",
        position: "relative",
      }}
    >
      <Stack mx={8} my={2}>
        <Stack mx={8} my={4} className="relative" alignItems="center">
          {/* <img
            className="absolute top-1 left-1 w-12 h-12 object-cover z-10"
            src={logoImg.src}
            alt="banner"
          /> */}
          <Box
            height="100px"
            component="img"
            src={missionCard.imageUrl}
            alt="mission-image"
            sx={{
              objectFit: "cover",
              borderRadius: "10px",
            }}
          ></Box>
        </Stack>

        <Box sx={{ padding: 1 }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            {missionCard.title}
          </Typography>
          <Typography mt={1} textAlign="center" color="GrayText">
            {missionCard.description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
