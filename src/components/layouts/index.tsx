import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }: any) => {
  return (
    <>
      <Header />

      {/* <div id="primary" className="content-area pt-0">
        <main id="main" className="site-main mt-[80px]" role="main">
          {children}
        </main>
      </div> */}
      <Footer />
    </>
  );
};

export default Layout;
