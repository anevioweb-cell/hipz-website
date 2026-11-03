import { m, useReducedMotion } from 'motion/react';
import { ease, duration, stagger } from '../motion.js';

// Line-by-line headline reveal: each line fades and rises. `lines` is an array of strings.
// No overflow mask on purpose: clipped text that slides into view grows its painted area frame by
// frame, which makes Chrome report LCP at the END of the animation (seen in Lighthouse, ~4 s).
// Opacity + translate keeps the painted area constant, so LCP lands at the first visible frame.
// Under reduced motion the lines are simply shown.
export default function SplitLines({
  lines,
  as = 'h1',
  className = '',
  delay = 0,
  inView = false,
  immediate = false,
}) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  if (immediate) {
    // no entrance at all: used for the above-the-fold h1, whose paint time Chrome reports as LCP
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={line} className="block">
            {line}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <m.span
          key={line}
          className="block"
          initial={reduce ? false : { opacity: 0, y: '45%' }}
          {...(inView
            ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true } }
            : { animate: { opacity: 1, y: 0 } })}
          transition={{ duration: duration.reveal, ease, delay: delay + i * stagger }}
        >
          {line}
          {i < lines.length - 1 ? ' ' : ''}
        </m.span>
      ))}
    </Tag>
  );
}
