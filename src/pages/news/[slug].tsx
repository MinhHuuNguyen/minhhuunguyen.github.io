import { INews } from "@/@types/news";
import { getNewsBySlug } from "@/utils/renderNews";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

interface Props {
  news: INews;
}

const News: NextPage<Props> = ({ news }) => {
  const router = useRouter();

  return (
    <section className="news lg:pt-4 pt-4 mb-5">
      <div className="flex flex-wrap ">
        <div className="flex flex-col align-center justify-start gap-4 lg:ps-6 lg:pe-12 lg:w-2/3 pr-4 pl-4 w-full">
          <div className="flex justify-between items-center w-full">
            <span className="news-status">{news?.status}</span>
            <span className="news-posted">{news?.time}</span>
          </div>
          <h2 className="news-title">{news?.title}</h2>
          {news?.contents.map((content) => (
            <p className="news-content" key={content.content}>
              {content.content}
            </p>
          ))}
        </div>
        {/* <div className="flex flex-col align-center justify-start gap-4 lg:px-6 lg:w-1/3 pr-4 pl-4 w-full lg:mt-0 mt-4">
          {news?.images.map((image) => (
            <div className="news-image" key={image.src}>
              <div className="news-image-frame">
                <img src={image.src} alt={image.alt} />
              </div>
              <p>{image.description}</p>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default News;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const news = getNewsBySlug(params?.slug as string);

    return {
      props: {
        news,
      },
    };
  } catch (err) {
    return {
      props: {
        news: {},
      },
    };
  }
};
