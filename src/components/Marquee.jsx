import { useLayoutEffect, useRef, useState } from 'react';

// Infinite ticker. `speed` is px/second; `reverse` flips direction.
// Pauses on hover/focus; static under prefers-reduced-motion (see .marquee-track in index.css).
export default function Marquee({ children, speed = 60, reverse = false, className = '', label }) {
  const trackRef = useRef(null);
  const [duration, setDuration] = useState(40);

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const width = el.scrollWidth / 2;
    if (width > 0 && speed > 0) setDuration(width / speed);
  }, [speed, children]);

  return (
    <div
      className={`marquee overflow-hidden ${className}`}
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
  );
}
