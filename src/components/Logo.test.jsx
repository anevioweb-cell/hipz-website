import { describe, expect, it } from 'vitest';

// The logo exists only as a 150 px file: every wordmark use must stay ≤ 52 px tall (≈ 74 CSS px wide,
// ≈ 150 device px on 2× screens). Checks every Logo `height` prop and every <img src="/logo-…"> class.
const files = import.meta.glob(['../**/*.jsx', '!../**/*.test.jsx'], {
  query: '?raw',
  import: 'default',
  eager: true,
});
const px = (cls) => {
  const m = cls.match(/\bh-\[(\d+)px\]|\bh-(\d+)\b/);
  if (!m) return null;
  return m[1] ? +m[1] : +m[2] * 4;
};

describe('logo display size', () => {
  it('is never rendered taller than 52 px (no blown-up small logo)', () => {
    const uses = [];
    for (const [path, src] of Object.entries(files)) {
      for (const m of src.matchAll(/<Logo[^>]*height="([^"]+)"/g)) uses.push([path, m[1]]);
      for (const m of src.matchAll(
        /src="\/logo-(?:white|ink)\.png"[\s\S]{0,200}?className="([^"]+)"/g,
      ))
        uses.push([path, m[1]]);
    }
    expect(uses.length).toBeGreaterThan(1);
    for (const [path, cls] of uses) expect(px(cls), `${path}: ${cls}`).toBeLessThanOrEqual(52);
    // the default (no height prop) is h-12 = 48 px
    expect(files['./Logo.jsx']).toMatch(/height = 'h-12'/);
  });
});
