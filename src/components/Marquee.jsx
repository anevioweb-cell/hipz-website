import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

// Pause / play control for moving content (WCAG 2.2.2: anything moving longer than 5 s can be paused).
export function MotionToggle({ paused, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      aria-label={paused ? 'Play moving text' : 'Pause moving text'}
      className={`inline-flex size-11 items-center justify-center rounded-full bg-ink text-paper shadow-card hover:bg-ink-soft ${className}`}
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z" />}
      </svg>
    </button>
  );
}

// Infinite ticker. `speed` is px/second (measured reference ticker: 60 px/s); `reverse` flips direction.
// Pauses on hover/focus, while offscreen, with its pause button (or the parent's, via `paused` +
// `control={false}`); static under prefers-reduced-motion (see .marquee-track in index.css).
export default function Marquee({
  children,
  speed = 60,
  reverse = false,
  className = '',
  label,
  paused: pausedProp,
  control = true,
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(40);
  const [pausedOwn, setPausedOwn] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const paused = pausedProp ?? pausedOwn;

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const width = el.scrollWidth / 2;
    if (width > 0 && speed > 0) setDuration(width / speed);
  }, [speed, children]);

  // no work while offscreen
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={rootRef}
        className={`marquee overflow-hidden ${paused || offscreen ? 'is-paused' : ''}`}
        role="group"
        aria-label={label}
        style={{
          '--marquee-duration': `${duration}s`,
          '--marquee-direction': reverse ? 'reverse' : 'normal',
        }}
      >
        <div ref={trackRef} className="marquee-track flex w-max">
          <div className="flex shrink-0 items-center">{children}</div>
          <div className="flex shrink-0 items-center" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
      {control && !reduce && (
        <MotionToggle
          paused={paused}
          onToggle={() => setPausedOwn((p) => !p)}
          className="absolute top-1/2 right-[max(0.5rem,env(safe-area-inset-right))] -translate-y-1/2"
        />
      )}
    </div>
  );
}
