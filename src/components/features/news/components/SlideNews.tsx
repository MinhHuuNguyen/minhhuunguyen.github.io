import { INews } from "@/@types/news";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { NewsCard } from "./NewsCard";

type SlideNewsProps = {
  slideNewsData: INews[];
};

const responsive = {
  0: {
    items: 1,
  },
  600: {
    items: 2,
  },
  1024: {
    items: 3,
  },
  1200: {
    items: 4,
  },
};

const renderNextButton = (props: { isDisabled?: boolean }) => (
  <IconButton
    disabled={props.isDisabled}
    sx={{
      position: "absolute",
      top: "48%",
      right: 0,
      width: 50,
      height: 50,
      backgroundColor: "#eee",
      "&:hover": {
        backgroundColor: "#eee",
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
      top: "48%",
      left: 0,
      width: 50,
      height: 50,
      backgroundColor: "#eee",
      "&:hover": {
        backgroundColor: "#eee",
      },
    }}
  >
    <ArrowBackIosNewIcon sx={{ fontSize: "15px" }} />
  </IconButton>
);

export const SlideNews: React.FC<SlideNewsProps> = ({ slideNewsData }) => {
  const listCard = slideNewsData.map((newsData) => (
    <NewsCard key={newsData.title} newsData={newsData} />
  ));

  return (
    <AliceCarousel
      paddingLeft={30}
      paddingRight={30}
      disableDotsControls
      responsive={responsive}
      items={listCard}
      disableButtonsControls={false}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
    />
  );
};
