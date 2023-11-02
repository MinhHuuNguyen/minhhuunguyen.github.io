import { Container, Grid, Stack, Typography } from "@mui/material";
import { MissionCard } from "./MissionCard";

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
    <Container maxWidth="xl">
      <Stack alignItems="center">
        <Typography variant="h5">Sứ Mệnh Và Mục Đích Ra Đời</Typography>
        <Typography mt={1} textAlign="center">
          Tại Khoảng Trời Của Bé, chúng tôi khát vọng về một tương lai
        </Typography>
        <Typography textAlign="center">
          sức khỏe và quyền lợi bệnh nhân được cải thiện thông qua dịch vụ phẫu
          thuật an toàn
        </Typography>
      </Stack>

      <Grid container spacing={2} my={4} sx={{ justifyContent: "center" }}>
        {missionCartData.map((mission, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <MissionCard key={mission.title} missionCard={mission} />
          </Grid>
        ))}
      </Grid>

      {/* <Stack
      direction="row"
      rowGap={2}
      columnGap={[2, 10]}
      flexWrap="wrap"
      justifyContent="center"
    >
      {missionCartData.map((mission) => (
        <MissionCard key={mission.title} missionCard={mission} />
      ))}
    </Stack> */}
    </Container>
  );
};
