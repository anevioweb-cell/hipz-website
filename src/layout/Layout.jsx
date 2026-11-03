import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import PageTransition from './PageTransition.jsx';
import ToastProvider from '../components/Toast.jsx';
import SmoothScroll from '../components/SmoothScroll.jsx';

export default function Layout() {
  return (
    <ToastProvider>
      <SmoothScroll />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-pill focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <div className="relative">
        <Navbar />
        <main id="main">
          <PageTransition />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
