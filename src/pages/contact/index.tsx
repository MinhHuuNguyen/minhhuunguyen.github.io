import { NextPage } from 'next';
import { useState } from 'react';

const Contact: NextPage = () => {
  const [tab, setTab] = useState<Number>(0);

  return (
    <section className="contact lg:py-6 py-3">
      <ul className="nav nav-pills mb-5">
        <li className="nav-item">
          <button className="nav-link active" onClick={() => setTab(0)}>Tham gia tài trợ</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" onClick={() => setTab(1)}>Tham gia KTCB</button>
        </li>
      </ul>
      <div className="tab-content mb-4" id="pills-tabContent">
        {tab == 0 && (
          <div className="tab-pane opacity-0 opacity-100 block active">
            <form className="flex flex-wrap  g-3 needs-validation justify-center">
              <div className="flex flex-wrap  lg:mb-0 mb-4">
                <div className="lg:w-2/3 pr-4 pl-4 w-full flex flex-col items-center gap-4">
                  <div className=" md:w-2/3 pr-4 pl-4 w-full flex flex-col justify-center items-center mb-3">
                    <h1 className="title-section mb-2" data-aos="fade-right">Liên hệ</h1>
                    <p className="h5 mb-4 mt-3 text-center">Đăng ký nhận tư vấn từ đội ngũ chuyên gia</p>
                    <span className="span-section">Hoàn toàn miễn phí! Đội ngũ chuyên giá của chúng mình sẽ giúp bạn xây
                      dựng và tiếp cận những dự án tình nguyện phù hợp với bạn</span>
                  </div>
                  <div className="xl:w-2/3 pr-4 pl-4 w-full relative">
                    <label htmlFor="validationCustom01" className="form-label">Họ và tên</label>
                    <input type="text" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded" id="validationCustom01" placeholder="..." required />
                    <div className="hidden mt-1 text-sm text-red">
                      Họ và tên không phù hợp !
                    </div>
                  </div>
                  <div className="xl:w-2/3 pr-4 pl-4 w-full relative">
                    <label htmlFor="validationCustom02" className="form-label">Email</label>
                    <input type="text" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded" id="validationCustom02" placeholder="..." required />
                    <div className="hidden mt-1 text-sm text-red">
                      Email không phù hợp !
                    </div>
                  </div>
                  <div className="xl:w-2/3 pr-4 pl-4 w-full relative">
                    <label htmlFor="validationCustom03" className="form-label">Số điện thoại</label>
                    <input type="text" className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded" id="validationCustom03" placeholder="..." required />
                    <div className="hidden mt-1 text-sm text-red">
                      Số điện thoại không hợp lệ !
                    </div>
                  </div>
                  <div className="xl:w-2/3 pr-4 pl-4 w-full relative">
                    <label htmlFor="validationTextarea" className="form-label">Nội dung</label>
                    <textarea className="block appearance-none w-full py-1 px-2 mb-1 text-base leading-normal bg-white text-gray-800 border border-gray-200 rounded" id="validationTextarea" placeholder="Nhập nội dung yêu cầu ..."
                      rows={4} required></textarea>
                    <div className="hidden mt-1 text-sm text-red">
                      Vui lòng nhập nội dung liên hệ !
                    </div>
                  </div>
                  <div className="xl:w-2/3 pr-4 pl-4 w-full mt-3">
                    <button className="btn-filled-pink block mx-auto" type="submit">Gửi yêu cầu</button>
                  </div>
                </div>
                <div className="lg:w-1/3 pr-4 pl-4 my-auto hidden lg:block">
                  <div className="flex flex-col items-start gap-4">
                    <div className="contact-box">
                      <div className="contact-box-icon">
                        <i className="fa-regular fa-compass"></i>
                      </div>
                      <div className="contact-box-content">
                        <h5>Địa chỉ</h5>
                        <p>Vietnam, Hanoi</p>
                      </div>
                    </div>
                    <div className="contact-box">
                      <div className="contact-box-icon">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div className="contact-box-content">
                        <h5>Hotline</h5>
                        <p>+84 705081088</p>
                      </div>
                    </div>
                    <div className="contact-box">
                      <div className="contact-box-icon">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div className="contact-box-content">
                        <h5>Email</h5>
                        <p>khoangtroicuabe.kby@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        {tab == 1 && (
          <div className="tab-pane fade">
            <div className="d-flex justify-content-center align-items-start">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdnW4kvTgjuLViGyr9rhDe6g8cCPtPoJiw4_ob_fuZjNhzo3g/viewform?embedded=true"
                width="700" height="520">Loading…</iframe>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Contact;
