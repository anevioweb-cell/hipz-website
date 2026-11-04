import { useEffect, useState } from 'react';

// true once the element has intersected the viewport (shrunk by `margin`), then stays true.
// Fail-safe: without IntersectionObserver it is true at once, so content is never left hidden.
export function useInViewOnce(ref, margin = '0px') {
  const supported = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  const [seen, setSeen] = useState(!supported);
  useEffect(() => {
    const el = ref.current;
    if (!supported || seen || !el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, seen, supported]);
  return seen;
}
