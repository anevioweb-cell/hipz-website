// Motion constants. Source of truth for easing/durations is src/index.css (--ease-out, --duration-*);
// these mirror them for the motion JS API (which needs numbers, not var()).
// "measured" values come from docs/design/reference-measurements.json (see docs/design/REFERENCE_ANALYSIS.md §6).
export const ease = [0.22, 1, 0.36, 1];
export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  page: 0.12,
  reveal: 0.9, // measured 0.8–1.1 s
  nav: 0.592, // measured (Phase 6), with navEase
  hero: 1.848, // measured hero image scale (Phase 6), with heroEase
};
export const navEase = [0.15, 0.4, 0.15, 1]; // measured navbar curve
export const heroEase = [0.25, 1, 0.3, 1]; // measured hero photo curve (scale 1.35 → 1)
export const navDelay = 0.23; // measured: navbar starts ≈ 230 ms after the hero photo
export const heroScaleFrom = 1.35; // measured
export const heroParallax = { range: [0, 800], distance: -240 }; // measured −0.3 px per px scrolled
export const revealMargin = '0px 0px -18% 0px'; // measured: reveals start when element top ≈ 82 % of viewport
export const stagger = 0.08;
export const speeds = { ticker: 60, reviewRows: 54 }; // px/s, measured (ticker re-measured in Phase 6)

// ---- Phase 6 Part C: text pop + scroll reveals, re-measured frame by frame (docs/design/MOTION_SPEC.md) ----
// Headings (h1/h2): every CHARACTER pops from scale 0 to 1 (opacity stays 1), no overflow mask,
// transform-origin centre, 30 ms between characters, each 420 ms on an overshooting curve
// (peak 1.143 at ≈ 217 ms, lands on 1 at ≈ 400 ms, no undershoot).
export const popText = { ease: [0.35, 1.7, 0.6, 1], duration: 0.42, stagger: 0.03 };
// Paragraphs: every character at once (no stagger) from y 20 px, rotate 5°, opacity 0, in-out 420 ms.
export const softText = { ease: [0.45, 0, 0.5, 1], duration: 0.42, y: 20, rotate: 5 };
// Labels/chips/badges: scale 0 → 1 with opacity 0 → 1, under-damped spring (overshoot ≈ 12.8 %).
export const popBadge = { type: 'spring', stiffness: 250, damping: 17, mass: 1 };
// Blocks rise from opacity 0 and +y on one measured curve; the duration grows with the offset
// (fitted per element type, RMSE ≤ 0.004). Buttons (y 10) use their own, quicker curve.
export const riseEase = [0.25, 0.9, 0.35, 1];
export const rise = {
  10: { duration: 0.355, ease: [0.25, 0.2, 0.25, 1] }, // buttons
  20: { duration: 0.68 }, // arrows / small controls
  30: { duration: 0.703 }, // content groups (heading + text + button)
  40: { duration: 0.703 }, // footer brand / links
  50: { duration: 0.76 }, // pillars / rows
  60: { duration: 0.77 }, // review rows
  70: { duration: 0.785 }, // cards (100 ms apart)
  80: { duration: 0.868 }, // card grids
  120: { duration: 0.971 }, // stage (with scale .85)
};
export const riseFor = (y) => {
  const keys = Object.keys(rise).map(Number);
  const k = keys.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
  return { ease: riseEase, ...rise[k] };
};
export const cardStagger = 0.1; // s between cards in a row
// Triggers (measured with slow wheel scrolling): text starts as soon as it enters the viewport;
// blocks when their top reaches ≈ 82 % of the viewport height. All play once, no exit, no replay.
export const textMargin = '0px 0px 0px 0px';
// Hero entrance on load (after the photo starts): headline chars +0.42 s, lead chars +0.40 s, content
// group (y 30) +0.70 s, button (y 10) +1.55 s, nav +0.23 s.
export const heroText = { delay: 0.42, leadDelay: 0.4, groupDelay: 0.7, buttonDelay: 1.55 };
// Flavor detail hero (measured on the reference detail page, s after load): heading block (y 40), text
// blocks (y 30) one after another, chips pop afterwards (≈ 0.15 s apart).
export const detailHero = { heading: 0.16, blocks: [0.26, 0.32, 0.41, 0.47], chips: 0.63 };
// Fail-safe: anything still hidden this long after it is in view (or if IntersectionObserver is
// missing) is shown without animation.
export const revealFailSafeMs = 1500;

// Reads a CSS time token (e.g. --duration-page) in seconds, falling back to the mirror above.
export function cssSeconds(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const n = parseFloat(raw);
  return raw.endsWith('ms') ? n / 1000 : n;
}
