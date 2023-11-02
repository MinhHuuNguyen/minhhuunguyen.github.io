import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, IconButton } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

type CoverImageSlideProps = {
  coverImageData: string[];
};

const responsive = {
  0: {
    items: 1,
  },
  1200: {
    items: 1,
  },
};

const renderNextButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      position: "absolute",
      top: "40%",
      right: 0,
      width: 50,
      height: 50,
      backgroundColor: "#eee",
      opacity: 0.5,
      "&:hover": {
        backgroundColor: "#eee",
        opacity: 1,
      },
    }}
  >
    <ArrowForwardIosIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

const renderPrevButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      position: "absolute",
      top: "40%",
      left: 0,
      width: 50,
      height: 50,
      backgroundColor: "#eee",
      opacity: 0.5,
      "&:hover": {
        backgroundColor: "#eee",
        opacity: 1,
      },
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

export const CoverImageSlide: React.FC<CoverImageSlideProps> = ({
  coverImageData,
}) => {
  const listImageCard = coverImageData.map((url, index) => (
    <Box
      key={`${index}${url}`}
      component="img"
      width="100%"
      height="100%"
      src={url}
    ></Box>
  ));

  return (
    <AliceCarousel
      disableDotsControls
      autoPlay
      infinite
      autoPlayInterval={8000}
      items={listImageCard}
      disableButtonsControls={false}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
    />
  );
};
