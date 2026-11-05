import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useInViewOnce } from '../../hooks/useInViewOnce.js';
import { popText, softText, textMargin, revealFailSafeMs } from '../../motion.js';

// Measured text entrance (docs/design/MOTION_SPEC.md), transform/opacity only, plays once. Runs on the Web
// Animations API (compositor, exact cubic-bezier incl. the overshoot; no JS animation engine in the bundle).
// variant "pop"  (headings): each character pops from scale 0 → 1, 30 ms apart, overshooting curve.
// variant "soft" (paragraphs): all characters at once from y 20 px, rotate 5°, opacity 0.
// trigger "view": starts when the text enters the viewport; "load": on mount (+ delay), for heroes.
//
// Accessibility: the visible characters are aria-hidden and the full text is given once — as the
// heading's aria-label (headings), or as a visually hidden copy (other tags, where aria-label is not
// allowed). The visible text stays selectable; the hidden copy is not selectable, so copy-paste gives
// the text once. Arabic words are never split into letters (joining would break): they pop as a word.
// Reduced motion: plain text, no split, no animation.
// Fail-safe: no IntersectionObserver, or still hidden `revealFailSafeMs` after being in view → shown.

const ARABIC = /\p{Script=Arabic}/u;
const seg =
  typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null;
const graphemes = (w) => (seg ? [...seg.segment(w)].map((s) => s.segment) : [...w]);
const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const hidden = {
  pop: { transform: 'scale(0)' },
  soft: { transform: `translateY(${softText.y}px) rotate(${softText.rotate}deg)`, opacity: 0 },
};

function Pieces({ lines, variant }) {
  const style = hidden[variant];
  return lines.map((line, li) => (
    <span key={li} className={lines.length > 1 ? 'block' : undefined}>
      {line
        .split(/(\s+)/)
        .filter(Boolean)
        .map((word, wi) =>
          /^\s+$/.test(word) ? (
            ' '
          ) : (
            <span key={wi} className="inline-block whitespace-nowrap">
              {(ARABIC.test(word) ? [word] : graphemes(word)).map((c, ci) => (
                <span key={ci} data-pop="" className="inline-block" style={style}>
                  {c}
                </span>
              ))}
            </span>
          ),
        )}
      {li < lines.length - 1 ? ' ' : null}
    </span>
  ));
}

export default function PopText({
  text,
  lines: linesProp,
  as: Tag = 'h2',
  variant = 'pop',
  trigger = 'view',
  delay = 0,
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion();
  const lines = linesProp ?? [text];
  const label = lines.join(' ');
  const scope = useRef(null);
  const inView = useInViewOnce(scope, textMargin);
  const done = useRef(false);

  const play = (instant = false) => {
    if (done.current || !scope.current) return;
    done.current = true;
    const els = scope.current.querySelectorAll('[data-pop]');
    // Final state goes inline first; the animation's backwards fill shows the start state meanwhile.
    for (const el of els) {
      el.style.transform = 'none';
      el.style.opacity = '1';
    }
    if (instant || typeof els[0]?.animate !== 'function') return;
    const bezier = (e) => `cubic-bezier(${e.join(',')})`;
    els.forEach((el, i) => {
      if (variant === 'pop')
        el.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
          duration: popText.duration * 1000,
          delay: (delay + i * popText.stagger) * 1000,
          easing: bezier(popText.ease),
          fill: 'backwards',
        });
      else
        el.animate(
          [
            { transform: hidden.soft.transform, opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          {
            duration: softText.duration * 1000,
            delay: delay * 1000,
            easing: bezier(softText.ease),
            fill: 'backwards',
          },
        );
    });
  };

  // fail-safes: never leave text invisible
  useEffect(() => {
    if (reduce) return undefined;
    if (typeof window.IntersectionObserver === 'undefined') {
      play(true);
      return undefined;
    }
    const id = setInterval(() => {
      const el = scope.current;
      if (done.current || !el) return clearInterval(id);
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        clearInterval(id);
        setTimeout(() => play(true), revealFailSafeMs);
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    if (reduce) return undefined;
    if (trigger === 'load' || inView) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, trigger, inView]);

  if (reduce)
    return (
      <Tag className={className} {...rest}>
        {lines.map((line, i) => (
          <span key={i} className={lines.length > 1 ? 'block' : undefined}>
            {line}
            {i < lines.length - 1 ? ' ' : null}
          </span>
        ))}
      </Tag>
    );

  const heading = HEADINGS.has(Tag);
  return (
    <Tag ref={scope} className={className} aria-label={heading ? label : undefined} {...rest}>
      {!heading && <span className="sr-only select-none">{label}</span>}
      <span aria-hidden="true">
        <Pieces lines={lines} variant={variant} />
      </span>
    </Tag>
  );
}
