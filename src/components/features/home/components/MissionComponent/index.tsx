import { Container, Grid, Stack, Typography } from "@mui/material";
import { MissionCard } from "./MissionCard";
import missionBackground from "../../../../../../public/mission-background.jpg";

type MissionProps = {
  missionCartData: {
    title: string;
    imageUrl: string;
    description: string;
  }[];
};

export const MissionComponent: React.FC<MissionProps> = ({
  missionCartData,
}) => {
  return (
    <Container
      sx={{
        maxWidth: "1900px !important",
        paddingBottom: 8,
        backgroundImage: `url(${missionBackground.src})`,
        backgroundSize: "100% 100%;",
        backgroundPosition: "center",
      }}
    >
      <Stack alignItems="center">
        <Typography variant="h4" fontWeight="bold">SỨ MỆNH RA ĐỜI VÀ HOẠT ĐỘNG</Typography>
      </Stack>

      <Grid container spacing={2} my={0} sx={{ justifyContent: "center" }}>
        {missionCartData.map((mission, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <MissionCard key={mission.title} missionCard={mission} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
