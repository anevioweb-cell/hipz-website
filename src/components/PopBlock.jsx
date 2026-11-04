import { useEffect, useRef, useState } from 'react';
import { m, useAnimationControls, useReducedMotion } from 'motion/react';
import { useInViewOnce } from '../hooks/useInViewOnce.js';
import { popBadge, revealMargin, revealFailSafeMs, riseFor } from '../motion.js';

// Measured block entrance (docs/MOTION_SPEC.md), plays once when the block's top reaches ≈ 82 % of the
// viewport. variant "rise": opacity 0 → 1 and +y → 0 on the curve/duration measured for that offset
// (optional start `scale`, e.g. .85 for a stage, and `rotate`); variant "badge": scale 0 → 1 with
// opacity on an under-damped spring (labels, chips, stickers).
// Fail-safe: shown without motion if IntersectionObserver is missing, if focus enters it, or if it is
// still hidden `revealFailSafeMs` after being in view. `immediate` (heroes): plays on load after `delay`.
// Reduced motion: rendered static.
export default function PopBlock({
  children,
  variant = 'rise',
  y = 30,
  scale,
  rotate,
  delay = 0,
  immediate = false,
  className = '',
  as = 'div',
  ...rest
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  // heroes: play on load (after `delay`), whatever the scroll trigger says
  const seen = useInViewOnce(ref, revealMargin);
  const inView = immediate || seen;
  const [forced, setForced] = useState(false);
  const controls = useAnimationControls();
  const Tag = m[as];

  useEffect(() => {
    if (reduce || inView) return undefined;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        clearInterval(id);
        setTimeout(() => setForced(true), revealFailSafeMs);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [reduce, inView]);

  const badge = variant === 'badge';
  const hiddenState = badge
    ? { opacity: 0, scale: 0 }
    : { opacity: 0, y, ...(scale ? { scale } : {}), ...(rotate ? { rotate } : {}) };
  const shown = badge ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0, scale: 1, rotate: 0 };

  // the delay is a timer (not motion's own delay) so that focus can cancel it cleanly
  const timer = useRef(0);
  const settled = useRef(false);
  const [focusShown, setFocusShown] = useState(false);
  const showNow = () => {
    settled.current = true;
    clearTimeout(timer.current);
    controls.stop();
    controls.set(shown);
  };
  // keyboard focus: final state via !important classes, which win over any inline motion style
  const onFocus = () => {
    if (settled.current && focusShown) return;
    showNow();
    setFocusShown(true);
  };
  useEffect(() => {
    if (reduce || settled.current) return undefined;
    if (inView) {
      timer.current = setTimeout(() => {
        if (!settled.current) controls.start(shown, badge ? popBadge : riseFor(y));
      }, delay * 1000);
    } else if (forced) showNow();
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, inView, forced]);

  if (reduce)
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );

  return (
    <Tag
      ref={ref}
      data-mm={badge ? 'badge' : `rise-${y}`}
      // keyboard users never land on a still-hidden control: focus jumps to the final state
      onFocusCapture={onFocus}
      className={`${className}${focusShown ? ' opacity-100! transform-none!' : ''}`}
      initial={inView ? false : hiddenState}
      animate={controls}
      {...rest}
    >
      {children}
    </Tag>
  );
}
