import { INews } from "@/@types/news";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

type NewsCardProps = {
  newsData: INews;
};

export const NewsCard: React.FC<NewsCardProps> = ({ newsData }) => {
  const router = useRouter();
  return (
    <Stack px={2} sx={{ cursor: "pointer" }}>
      <Box
        sx={{
          padding: 1,
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "lightblue",
            "& .MuiIconButton-root": {
              backgroundColor: "#fa4996",
              color: "white",
            },
          },
        }}
        onClick={() => router.push(newsData.slug)}
      >
        <Box
          borderRadius="5px"
          component="img"
          src={newsData.banner_url}
          sx={{ width: "100%", height: "200px", objectFit: "cover" }}
        ></Box>
        <Typography
          variant="h5"
          mt={2}
          fontWeight="bold"
          sx={{
            minHeight: "65px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {newsData.title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            minHeight: "90px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {newsData.description}
        </Typography>
        <IconButton
          sx={{
            width: 50,
            height: 50,
            backgroundColor: "#eee",
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};
