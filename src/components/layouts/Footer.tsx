import Image from 'next/image';
import logo512 from '../../../public/ktcb-logo-512.png';

const Footer = () => {
  return (
    <footer className="md:px-12 px-4 footer">
      <div className="flex flex-wrap  justify-center">
        <div className="lg:w-2/5 pr-4 pl-4 md:w-full pr-4 pl-4 px-4 md:px-6 py-3 lg:py-0">
          <h5 className="footer-title">khoảng trời của bé</h5>
          <div className="flex justify-start items-center gap-3 mb-3">
            <i className="fa-solid fa-phone"></i>:
            <p className="mb-0 fw-bold"><em>+84 346535857</em></p>
          </div>
          <div className="flex justify-start items-center gap-3">
            <i className="fa-solid fa-envelope"></i>:
            <p className="mb-0 fw-bold"><em>khoangtroicuabe.kby@gmail.com</em></p>
          </div>
        </div>
        <div className="lg:w-2/5 pr-4 pl-4 md:w-full pr-4 pl-4 px-4 md:px-6 py-3 lg:py-0">
          <div className="footer-logo">
            <Image src={logo512.src} width={512} height={512} alt="" />
          </div>
          <div className="flex justify-start items-center gap-3">
            <i className="fa-brands fa-facebook"></i>:
            <a className="mb-0 fw-bold" target="_blank" href="https://www.facebook.com/khoangtroicuabektcb">
              <em>facebook.com/khoangtroicuabektcb</em>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
