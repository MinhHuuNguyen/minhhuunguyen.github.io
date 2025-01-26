import { Container, Box, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import data from '../../../../../utils/data/resume.json';
import { useRouter } from 'next/router';
import Image from 'next/image';


export const ResumeComponent = ({
}) => {
  const router = useRouter();
  return (
    <Container
    sx={{
      maxWidth: "1900px !important",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))`
    }}
    >
      <Stack alignItems="center">
        <Typography variant="h2" fontWeight="bold" textAlign="center"> MY CAREER</Typography>
        <Stack direction="row">
          <Box flexBasis="20%" p={2}>
            <Image src={data.personal.avatar} alt="Profile" width={300} height={300} style={{ borderRadius: '50%', border: '2px' }} />
          </Box>

          <Box flexBasis="50%" p={2} display="flex" flexWrap="wrap">
            {data.experience.slice(0, 5).map((job: { title: string; company: string; startDate: string; endDate: string; logo: string}, index: number) => {
              const startDate = new Date(job.startDate);
              let endDate = new Date(); // Default to current date

              if (job.endDate !== 'Present') { endDate = new Date(job.endDate); }

              const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
              const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
              const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30));

              const yearString = diffYears > 1 ? `${diffYears} years` : diffYears === 1 ? `${diffYears} year` : '';
              const monthString = diffMonths > 1 ? `${diffMonths} months` : diffMonths === 1 ? `${diffMonths} month` : '';

              const duration = [yearString, monthString].filter(Boolean).join(', ');

              return (
                <Box key={index} flexBasis="50%">
                  <Typography variant="h6" style={{ fontWeight: 'bold', paddingTop: 7 }}>{job.title}</Typography>
                  <Typography style={{ fontStyle: 'italic', paddingTop: 7 }}>{job.company}</Typography>
                  <Typography style={{ fontStyle: 'italic', paddingTop: 7 }}>{job.startDate} - {job.endDate} ({duration})</Typography>
                  <Image src={job.logo} alt="Company Logo" width={150} height={150} style={{ paddingTop: 7 }} />
                </Box>
              );
            })}
          </Box>

          <Box flexBasis="30%" p={2} display="flex" flexWrap="wrap">
            {data.education.map((education: { degree: string; school: string; duration: string; }, index: number) => (
              <Box key={index}>
                <Typography variant="h6" style={{ fontWeight: 'bold'}}>{education.degree}</Typography>
                <Typography style={{ fontStyle: 'italic'}}>{education.school}</Typography>
                <Typography style={{ fontStyle: 'italic'}}>{education.duration}</Typography>
              </Box>
            ))}
          </Box>
        </Stack>

        <LoadingButton
          variant="outlined"
          onClick={() => router.push('/resume')}
          sx={{
            alignSelf: "center",
            width: "fit-content",
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "red",
              color: "red",
              backgroundColor: "white",
            },
          }}
        >
          Load More
        </LoadingButton>
      </Stack>
    </Container>
  );
};