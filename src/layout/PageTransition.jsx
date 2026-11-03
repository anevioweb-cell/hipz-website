import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { duration } from '../motion.js';

// The reference changes pages instantly (measured); we use only a very light 120 ms fade-in
// (opacity, no exit wait) and return to the top on navigation.
export default function PageTransition() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (reduce) return <div>{outlet}</div>;
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.page }}
    >
      {outlet}
    </motion.div>
  );
}
