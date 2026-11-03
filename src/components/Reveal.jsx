import { motion, useReducedMotion } from 'motion/react';
import { ease, duration } from '../motion.js';

// Scroll reveal: fades + rises into view once. Under reduced motion it renders without movement.
export default function Reveal({ children, delay = 0, y = 50, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: duration.slow, ease, delay }}
    >
      {children}
    </Tag>
  );
}
