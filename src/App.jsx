import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Flavors from './pages/Flavors.jsx';
import FlavorDetail from './pages/FlavorDetail.jsx';
import Distributors from './pages/Distributors.jsx';
import OurStory from './pages/OurStory.jsx';
import NotFound from './pages/NotFound.jsx';

// /_kit exists only in development: the dead branch is removed from the production build.
const Kit = import.meta.env.DEV ? lazy(() => import('./pages/Kit.jsx')) : null;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="flavors" element={<Flavors />} />
        <Route path="flavors/:slug" element={<FlavorDetail />} />
        <Route path="distributors" element={<Distributors />} />
        <Route path="our-story" element={<OurStory />} />
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
