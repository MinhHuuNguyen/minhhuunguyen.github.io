import introductionData from "@/utils/data/json/introduction.json";
import { NextPage } from "next";

const Introduction: NextPage = () => {
  return (
    <>
      <section className="introduction pt-4">
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="title-section mb-2" data-aos="fade-right">
            Giới thiệu chung
          </h1>
          <span className="span-section">
            Giới thiệu chung về Khoảng Trời Của Bé.
          </span>
        </div>
        <div className="introduction-form">
          <div className="introduction-inner">
            <div className="introduction-inner-content">
              <h3 id="title">{introductionData.title}</h3>
              <p id="title-content">{introductionData.title_content}</p>
            </div>
            <div className="introduction-inner-image">
              <img src={introductionData.imgs[0]} alt="" id="img-1" />
            </div>
          </div>
          <div className="introduction-inner">
            <div className="introduction-inner-content lg:order-1 order-0">
              <h3 id="title-2">{introductionData.title_2}</h3>
              <p id="title-content-2">{introductionData.title_content_2}</p>
            </div>
            <div className="introduction-inner-image">
              <img src={introductionData.imgs[1]} id="img-2" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="timeline mt-5">
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="title-section mb-2" data-aos="fade-right">
            Chặng đường đã đi
          </h1>
          <span className="span-section">
            Cùng trải nghiệm với Khoảng Trời Của Bé.
          </span>
        </div>
        <div
          className="timeline-background"
          data-aos="fade-down"
          data-aos-duration="2000"
        ></div>
        <div className="timeline-form">
          <div className="timeline-item">
            <div
              className="timeline-item-year"
              data-aos="zoom-in-up"
              data-aos-duration="2000"
            >
              2015
            </div>
            <div className="timeline-item-image">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dm9sdW50ZWVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="timeline-item-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium quaerat tempore alias at distinctio inventore optio
              veritatis! Est aliquam assumenda nostrum quisquam asperiores,
              necessitatibus modi ut suscipit aut nemo architecto?
            </div>
          </div>
          <div className="timeline-item">
            <div
              className="timeline-item-year"
              data-aos="zoom-in-down"
              data-aos-duration="2000"
            >
              2016
            </div>
            <div className="timeline-item-image">
              <img
                src="https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dm9sdW50ZWVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="timeline-item-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium quaerat tempore alias at distinctio inventore optio
              veritatis! Est aliquam assumenda nostrum quisquam asperiores,
              necessitatibus modi ut suscipit aut nemo architecto?
            </div>
          </div>
          <div className="timeline-item">
            <div
              className="timeline-item-year"
              data-aos="zoom-in-down"
              data-aos-duration="2000"
            >
              2018
            </div>
            <div className="timeline-item-image">
              <img
                src="https://images.unsplash.com/photo-1513477967668-2aaf11838bd6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8dm9sdW50ZWVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="timeline-item-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium quaerat tempore alias at distinctio inventore optio
              veritatis! Est aliquam assumenda nostrum quisquam asperiores,
              necessitatibus modi ut suscipit aut nemo architecto?
            </div>
          </div>
          <div className="timeline-item">
            <div
              className="timeline-item-year"
              data-aos="zoom-in-down"
              data-aos-duration="2000"
            >
              2020
            </div>
            <div className="timeline-item-image">
              <img
                src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHZvbHVudGVlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="timeline-item-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium quaerat tempore alias at distinctio inventore optio
              veritatis! Est aliquam assumenda nostrum quisquam asperiores,
              necessitatibus modi ut suscipit aut nemo architecto?
            </div>
          </div>
          <div className="timeline-item">
            <div
              className="timeline-item-year"
              data-aos="zoom-in-down"
              data-aos-duration="2000"
            >
              2021
            </div>
            <div className="timeline-item-image">
              <img
                src="https://images.unsplash.com/photo-1461532257246-777de18cd58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHZvbHVudGVlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="timeline-item-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium quaerat tempore alias at distinctio inventore optio
              veritatis! Est aliquam assumenda nostrum quisquam asperiores,
              necessitatibus modi ut suscipit aut nemo architecto?
            </div>
          </div>
          <div className="timeline-item">
            <div
              className="timeline-item-year"
              data-aos="zoom-in-down"
              data-aos-duration="2000"
            >
              2022
            </div>
            <div className="timeline-item-image">
              <img
                src="https://images.unsplash.com/photo-1557660559-42497f78035b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHZvbHVudGVlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                alt=""
              />
            </div>
            <div className="timeline-item-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laudantium quaerat tempore alias at distinctio inventore optio
              veritatis! Est aliquam assumenda nostrum quisquam asperiores,
              necessitatibus modi ut suscipit aut nemo architecto?
            </div>
          </div>
        </div>
      </section>
      <section className="vision mt-5">
        <div className="flex flex-col justify-center items-center mb-5">
          <h1 className="title-section mb-2" data-aos="fade-right">
            Tầm nhìn & Sứ mệnh
          </h1>
          <span className="span-section">
            Chúng tôi khát vọng về một tương lai tươi sáng
          </span>
        </div>
        <div className="vision-form-background" data-aos="zoom-down"></div>
        <div className="vision-form">
          <div className="vision-box">
            {/* <h4 className="vision-box-title" style="background-image: linear-gradient(to right bottom, #f40076, #df98fa)">Tầm
              nhìn</h4> */}
            <p className="vision-box-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              inventore unde expedita quis iure reprehenderit, deleniti ea, in,
              quasi aperiam excepturi maxime qui exercitationem amet? Animi
              blanditiis quidem recusandae velit. Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <button className="btn-vision">
              <i className="fa-solid fa-eye"></i>
            </button>
          </div>
          <div className="vision-box">
            {/* <h4 className="vision-box-title" style={{backgroundImage: linear-gradient(to right bottom, #fa7cbb, #f14658)}}>Sứ
              mệnh</h4> */}
            <p className="vision-box-content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
              inventore unde expedita quis iure reprehenderit, deleniti ea, in,
              quasi aperiam excepturi maxime qui exercitationem amet? Animi
              blanditiis quidem recusandae velit. Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <button className="btn-mission">
              <i className="fa-solid fa-bars-progress"></i>
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Introduction;
