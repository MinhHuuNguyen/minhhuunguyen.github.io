import { Box, Paper, Stack, Typography } from "@mui/material";

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
      }}
    >
      <Stack>
        <Box
          width="100%"
          height="50%"
          component="img"
          src={missionCard.imageUrl}
          alt="mission-image"
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        ></Box>
        <Box sx={{ padding: 2 }}>
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
