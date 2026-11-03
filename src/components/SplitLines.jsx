import { motion, useReducedMotion } from 'motion/react';
import { ease, duration, stagger } from '../motion.js';

// Line-by-line headline reveal: each line slides up out of a mask. `lines` is an array of strings.
// Under reduced motion the lines are simply shown.
export default function SplitLines({
  lines,
  as = 'h1',
  className = '',
  delay = 0,
  inView = false,
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: '110%' }}
            {...(inView
              ? { whileInView: { y: 0 }, viewport: { once: true } }
              : { animate: { y: 0 } })}
            transition={{ duration: duration.reveal, ease, delay: delay + i * stagger }}
          >
            {line}
            {i < lines.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
