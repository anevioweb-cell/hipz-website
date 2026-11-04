import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import { duration } from '../motion.js';
import { hideHeroShell } from '../lib/heroShell.js';

const FIRST_PATH = typeof window === 'undefined' ? '/' : window.location.pathname;

// The reference changes pages instantly (measured); we use only a very light 120 ms fade-in
// (opacity, no exit wait) and return to the top on navigation.
export default function PageTransition() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    // leaving the page the static first frame was painted for: hide it
    if (pathname !== FIRST_PATH) hideHeroShell();
  }, [pathname]);

  if (reduce) return <div>{outlet}</div>;
  return (
    <m.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.page }}
    >
      {outlet}
    </m.div>
  );
}
