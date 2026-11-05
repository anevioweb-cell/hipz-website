import { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { heroParallax } from '../../motion.js';

// Transform-only parallax.
// mode "page":    y follows window scroll (measured hero: −0.3 px per px over the first 800 px).
// mode "element": y goes from +distance to −distance as the element crosses the viewport.
export default function Parallax({
  children,
  mode = 'page',
  range = heroParallax.range,
  distance = heroParallax.distance,
  className = '',
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollY, scrollYProgress } = useScroll(
    mode === 'element' ? { target: ref, offset: ['start end', 'end start'] } : {},
  );
  const y = useTransform(
    mode === 'element' ? scrollYProgress : scrollY,
    mode === 'element' ? [0, 1] : range,
    mode === 'element' ? [-distance, distance] : [0, distance],
  );
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div ref={ref} style={{ y }} className={className}>
      {children}
    </m.div>
  );
}
