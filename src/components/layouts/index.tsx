import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div id="primary" className="content-area pt-0">
        <main id="main" className="site-main" role="main">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
