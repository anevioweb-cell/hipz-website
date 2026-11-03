import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { duration } from '../motion.js';

// Cross-fades routes (opacity only) and returns to the top on navigation.
export default function PageTransition() {
  const { pathname } = useLocation();
  const outlet = useOutlet(); // element snapshot keeps the exiting page intact
  const reduce = useReducedMotion();

  useEffect(() => window.scrollTo(0, 0), [pathname]);

  if (reduce) return <div>{outlet}</div>;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.page }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
