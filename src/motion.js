// Motion constants. Source of truth for easing/durations is src/index.css (--ease-out, --duration-*);
// these mirror them for the motion JS API (which needs numbers, not var()).
// "measured" values come from docs/reference-measurements.json (see docs/REFERENCE_ANALYSIS.md §6).
export const ease = [0.22, 1, 0.36, 1];
export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  page: 0.12,
  reveal: 0.9, // measured 0.8–1.1 s
  nav: 0.9, // measured
  hero: 1.2, // measured hero image scale
};
export const navDelay = 0.3; // measured: navbar holds ~300 ms before moving
export const heroScaleFrom = 1.35; // measured
export const heroParallax = { range: [0, 800], distance: -240 }; // measured −0.3 px per px scrolled
export const revealMargin = '0px 0px -18% 0px'; // measured: reveals start when element top ≈ 82 % of viewport
export const stagger = 0.08;
export const speeds = { ticker: 72, reviewRows: 54 }; // px/s, measured

// Reads a CSS time token (e.g. --duration-page) in seconds, falling back to the mirror above.
export function cssSeconds(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const n = parseFloat(raw);
  return raw.endsWith('ms') ? n / 1000 : n;
}
