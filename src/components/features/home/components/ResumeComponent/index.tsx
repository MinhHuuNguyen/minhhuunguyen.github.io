import { Container, Box, Stack, Typography } from "@mui/material";
import ktcbBackground from "../../../../../../public/mission-background.jpg";
import LoadingButton from "@mui/lab/LoadingButton";

type ResumeProps = {
  missionCartData: {
    title: string;
    imageUrl: string;
    description: string;
  }[];
};

const resume = {
  imgArea: {
    imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO2IFYwOO5ZwC3KDAxzq2BWiyxjU905ZChbuAy1gKZtQ&s",

  },

  info: {
    name: "Nguyen Huu Tai",
  },

  Experience: [
    {
      title: "Data Scientist - AI Engineer",
      company: "PIXTA Vietnam Co. Ltd.",
      duration: "May 2019 - Present (4 years 5 months)",

    },

    {
      title: "Software Engineer",
      company: "FPT Software",
      duration: "May 2018 - May 2019 (1 year 1 month)",

    },

    {
      title: "Software Engineer",
      company: "FPT Software",
      duration: "May 2018 - May 2019 (1 year 1 month)",

    }
    // Add more job experiences as needed
  ],
  Education: [
    {
      degree: "Master of Science",
      field: "Mathematics and informatics",
      school: "Hanoi University of Science and Technology",
      duration: "Oct 2020 - Aug 2022"
    },

    {
      degree: "Engineer's degree",
      field: "Mathematics and informatics",
      school: "Hanoi University of Science and Technology",
      duration: "Aug 2015 - June 2020"
    },
    // Add more education experiences as needed
  ],

};

export const ResumeComponent: React.FC<ResumeProps> = ({
}) => {
  return (
    <Container
      sx={{
        maxWidth: "1900px !important",
        paddingTop: 7,
        paddingBottom: 12,
        backgroundImage: `url(${ktcbBackground.src})`,
        backgroundSize: "100% 100%;",
        backgroundPosition: "center",
      }}
    >
      <Stack alignItems="center">
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "2rem",
              md: "3rem",
            },
          }}
        >
          ABOUT ME
        </Typography>

        <Stack direction="row" justifyContent="space-between" spacing={20}>
          <Box flexBasis="33%" p={3}>
            <img src={resume.imgArea.imgSrc} alt="Profile" style={{ width: '100%', borderRadius: '50%', border: '2px solid black' }} />
            <Typography variant="h6" style={{ textAlign: 'center' }}>{resume.info.name}</Typography>
          </Box>

          <Box flexBasis="33%" p={2}>
            {resume.Experience.map((job, index) => (
              <Box key={index} style={{ margin: '10px 0', padding: '10px' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{job.title}</Typography>
                <Typography style={{ fontStyle: 'italic' }}>{job.company}</Typography>
                <Typography>{job.duration}</Typography>
              </Box>
            ))}
          </Box>

          <Box flexBasis="33%" p={2}>
            {resume.Education.map((education, index) => (
              <Box key={index} style={{ margin: '10px 0', padding: '10px' }}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{education.degree}</Typography>
                <Typography style={{ fontStyle: 'italic' }}>{education.field}</Typography>
                <Typography style={{ fontStyle: 'italic' }}>{education.school}</Typography>
                <Typography>{education.duration}</Typography>
              </Box>
            ))}
          </Box>
        </Stack>

        <LoadingButton
          variant="outlined"
          sx={{
            alignSelf: "center",
            width: "fit-content",
          }}>
          Load More
        </LoadingButton>
      </Stack>
    </Container>
  );
};
