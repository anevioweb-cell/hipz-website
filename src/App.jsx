import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Flavors from './pages/Flavors.jsx';
import FlavorDetail from './pages/FlavorDetail.jsx';
import NotFound from './pages/NotFound.jsx';

// Route-level code splitting: /distributors (form, 69 wilayas) and /our-story load on demand, so the other
// pages do not pay for them. Their static pre-JS first frame covers the extra chunk request.
const Distributors = lazy(() => import('./pages/Distributors.jsx'));
const OurStory = lazy(() => import('./pages/OurStory.jsx'));
// While a chunk loads, an empty block keeps the footer below the fold (no layout shift when it arrives).
const Pending = () => <div aria-hidden="true" className="min-h-[200svh]" />;
const page = (el) => <Suspense fallback={<Pending />}>{el}</Suspense>;

// /_kit exists only in development: the dead branch is removed from the production build.
const Kit = import.meta.env.DEV ? lazy(() => import('./pages/Kit.jsx')) : null;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="flavors" element={<Flavors />} />
        <Route path="flavors/:slug" element={<FlavorDetail />} />
        <Route path="distributors" element={page(<Distributors />)} />
        <Route path="our-story" element={page(<OurStory />)} />
        {Kit && (
          <Route
            path="_kit"
            element={
              <Suspense fallback={null}>
                <Kit />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
