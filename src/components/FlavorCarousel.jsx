/* A scroll container must be keyboard focusable (axe: scrollable-region-focusable), so the scroller
   <div role="region"> legitimately has tabIndex and key handlers. */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
import { Children, useCallback, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { copy } from '../data/copy.js';

const GAP = 20; // px, measured gap between reference cards

// Horizontal scroll-snap carousel. One step = card width + gap (reference: 289 px at a 269 px card).
// Arrows appear only when the items overflow; arrow keys scroll when the list has focus; swipe works
// natively. With few items that fit, they are centered (no arrows, no empty space on the left).
export default function FlavorCarousel({ children, label = copy.flavors.carouselLabel.text }) {
  const reduce = useReducedMotion();
  const [el, setEl] = useState(null);
  const [state, setState] = useState({ overflow: false, atStart: true, atEnd: true });

  const ref = useCallback((node) => {
    setEl(node);
    if (!node) return undefined;
    const update = () =>
      setState({
        overflow: node.scrollWidth > node.clientWidth + 1,
        atStart: node.scrollLeft <= 1,
        atEnd: node.scrollLeft + node.clientWidth >= node.scrollWidth - 1,
      });
    update();
    node.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => {
      node.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, []);

  const step = (dir) => {
    if (!el) return;
    const first = el.querySelector('[aria-roledescription="slide"]');
    const size = (first ? first.getBoundingClientRect().width : 300) + GAP;
    el.scrollBy({ left: dir * size, behavior: reduce ? 'auto' : 'smooth' });
  };

  const items = Children.toArray(children);
  const arrowCls =
    'grid size-12 place-items-center rounded-full bg-ink text-paper transition-opacity disabled:opacity-30';

  return (
    <div role="group" aria-roledescription="carousel" aria-label={label}>
      {state.overflow && (
        <div className="mb-6 flex justify-end gap-2 px-gutter lg:px-gutter-lg">
          <button
            type="button"
            className={arrowCls}
            aria-label={copy.flavors.prev.text}
            disabled={state.atStart}
            onClick={() => step(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={arrowCls}
            aria-label={copy.flavors.next.text}
            disabled={state.atEnd}
            onClick={() => step(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
      {/* a scroll container must be keyboard focusable (axe: scrollable-region-focusable) */}
      <div
        ref={ref}
        role="region"
        tabIndex={0}
        aria-label={label}
        data-lenis-prevent-touch
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          }
        }}
        className="snap-x snap-mandatory overflow-x-auto scroll-px-gutter px-gutter pt-2 pb-10 [scrollbar-width:none] lg:px-gutter-lg [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max min-w-full gap-5">
          {items.map((child, i) => (
            <div
              key={child.key ?? i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              className="shrink-0 snap-center first:ml-auto last:mr-auto"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
