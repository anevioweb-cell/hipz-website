// Motion helpers. The easing/duration source of truth is src/index.css (--ease-out etc.).
// Values below mirror those tokens for motion's JS API (which needs numbers, not var()).
export const ease = [0.22, 1, 0.36, 1];
export const duration = { fast: 0.2, base: 0.4, slow: 0.7, page: 0.3 };
export const stagger = 0.08;

// Reads a CSS time token (e.g. --duration-page) in seconds, falling back to the mirror above.
export function cssSeconds(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const n = parseFloat(raw);
  return raw.endsWith('ms') ? n / 1000 : n;
}
