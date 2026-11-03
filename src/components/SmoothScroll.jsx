import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { SMOOTH_SCROLL } from '../config.js';

// Optional Lenis smooth scrolling. Loaded after first paint (idle), never under reduced motion.
// Elements with data-lenis-prevent (e.g. the mobile menu dialog) keep native wheel behavior.
export default function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!SMOOTH_SCROLL || reduce) return undefined;
    let lenis;
    let frame;
    let cancelled = false;
    const start = async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, anchors: true });
      const loop = (time) => {
        lenis.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback ?? clearTimeout;
    const handle = idle(start);
    return () => {
      cancelled = true;
      cancelIdle(handle);
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reduce]);

  return null;
}
