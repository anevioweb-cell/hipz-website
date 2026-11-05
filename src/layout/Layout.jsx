import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useLocation } from 'react-router-dom';
import PageTransition from './PageTransition.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import ToastProvider from '../components/Toast.jsx';
import SmoothScroll from '../components/SmoothScroll.jsx';

export default function Layout() {
  const { pathname } = useLocation();
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
          {/* a crash inside a page keeps the navbar and footer; the route change resets it */}
          <ErrorBoundary resetKey={pathname}>
            <PageTransition />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
