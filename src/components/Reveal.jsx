import { motion, useReducedMotion } from 'motion/react';
import { ease, duration, revealMargin } from '../motion.js';

// Scroll reveal, once. Measured on the reference: starts when the element's top reaches ≈ 82 % of the
// viewport height, settles in ≈ 0.9 s, decelerating; start offsets 40–120 px (`y`) from opacity 0.
// Under reduced motion it renders without movement.
export default function Reveal({ children, delay = 0, y = 50, scale, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, ...(scale ? { scale } : {}) }}
      whileInView={{ opacity: 1, y: 0, ...(scale ? { scale: 1 } : {}) }}
      viewport={{ once: true, margin: revealMargin }}
      transition={{ duration: duration.reveal, ease, delay }}
    >
      {children}
    </Tag>
  );
}
