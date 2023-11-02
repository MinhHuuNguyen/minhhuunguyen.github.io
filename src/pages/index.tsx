/* eslint-disable @next/next/no-img-element */

import { IIntro } from "@/@types/team";
import { HomeContent, Intro, NewsLoadMore } from "@/components/features/home";
import { SEO } from "@/configs/seo.config";
import { getIntroByTeam } from "@/utils/common";
import { GetStaticProps, NextPage } from "next";
import { DefaultSeo } from "next-seo";

interface Props {
  intro: IIntro;
}

const Home: NextPage<Props> = ({ intro }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <HomeContent />
      {/* <section className="w-100 relative" id="hero-banner">
        <div className="single-item">
          <div
            id="default-carousel"
            className="relative w-full"
            data-carousel="slide"
          >
            <div className="relative overflow-hidden hero-background">
              <div
                className="hidden duration-700 ease-in-out hero-background"
                data-carousel-item
              >
                <img
                  src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className="hidden duration-700 ease-in-out hero-background"
                data-carousel-item
              >
                <img
                  src="https://img.freepik.com/free-vector/volunteers-trash-out-composition-with-cityscape-illustration-group-flat-human-characters-with-cleaning-utensils_1284-61784.jpg?size=626&ext=jpg&uid=R79996222&ga=GA1.2.1113200829.1670333508&semt=sph"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className="hidden duration-700 ease-in-out hero-background"
                data-carousel-item
              >
                <img
                  src="https://img.freepik.com/premium-vector/environment-care-campaign-illustration-collection-set_106954-1461.jpg?size=626&ext=jpg&uid=R79996222&ga=GA1.2.1113200829.1670333508"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
            </div>
            <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="true"
                aria-label="Slide 1"
                data-carousel-slide-to="0"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 2"
                data-carousel-slide-to="1"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 3"
                data-carousel-slide-to="2"
              ></button>
            </div>
            <button
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-next
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
        <div className="absolute banner-logo">
          <Image src={logo512.src} width={512} height={512} alt="Logo" />
        </div>
      </section>

      <section className="vision-section mb-5" id="vision">
        <div className="px-4 px-md-5">
          <div className="title-wrapper">
            <div className="flex flex-col justify-center align-center mb-5">
              <h1 className="title-section mb-2 text-3xl" data-aos="fade-right">
                Sứ mệnh
              </h1>
              <span
                className="span-section"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                Chúng tôi khát vọng về một tương lai tươi sáng
              </span>
            </div>
          </div>
          <div className="vision" data-aos="fade-up" data-aos-duration="1500">
            <div className="vision-items">
              <Image
                src={arrows.src}
                width={20}
                height={20}
                sizes="100vw"
                alt=""
                className="vision-arrows arrow1"
              />
              <h4>Các bạn trẻ</h4>
              <Image
                className="vision-img"
                sizes="100vw"
                width={20}
                height={20}
                src={youth.src}
                alt=""
              />
            </div>
            <div className="flex flex-col relative" style={{ gap: 100 }}>
              <Image
                src={arrows.src}
                width={20}
                height={20}
                sizes="100vw"
                alt=""
                className="vision-arrows arrow2"
              />
              <div className="vision-items">
                <h4>Trẻ em khó khăn</h4>
                <Image
                  className="vision-img"
                  sizes="100vw"
                  width={20}
                  height={20}
                  src={children.src}
                  alt=""
                />
              </div>
              <div className="vision-items">
                <h4>Khoảng Trời Của Bé</h4>
                <Image
                  className="vision-img"
                  sizes="100vw"
                  width={20}
                  height={20}
                  src={logo512.src}
                  alt=""
                />
              </div>
            </div>
            <div className="vision-items">
              <Image
                src={arrows.src}
                sizes="100vw"
                width={20}
                height={20}
                alt=""
                className="vision-arrows arrow3"
              />

              <h4>Các nhà hảo tâm</h4>
              <Image
                className="vision-img"
                sizes="100vw"
                width={20}
                height={20}
                src={love.src}
                alt=""
              />
            </div>
          </div>
          <div className="flex justify-center">
            <a href="/pages/introduction.html" className="btn-filled-pink">
              Tìm Hiểu Thêm
            </a>
          </div>
        </div>
      </section> */}

      {intro ? (
        <Intro
          title={intro.title}
          content={intro.content}
          banner_url={intro?.banner_url}
        />
      ) : null}

      <NewsLoadMore />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const intro = getIntroByTeam();

    if (!intro?.title || !intro?.content || !intro?.banner_url) {
      return {
        props: {
          intro: null,
        },
      };
    }

    return {
      props: {
        intro,
      },
    };
  } catch (err) {
    console.log("err", err);

    return {
      props: {
        intro: {},
      },
    };
  }
};
