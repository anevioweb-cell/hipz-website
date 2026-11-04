import { describe, expect, it } from 'vitest';
import { creatorPhotos } from './creators.js';

describe('creator photos data', () => {
  it('has a focal point per image and only known people', () => {
    expect(creatorPhotos.length).toBeGreaterThanOrEqual(6);
    for (const c of creatorPhotos) {
      expect(c.focal.x).toBeGreaterThanOrEqual(0);
      expect(c.focal.x).toBeLessThanOrEqual(1);
      if (c.people) for (const p of c.people) expect(['kada', 'miloud']).toContain(p);
    }
  });
  it('only selected photos are kept by the build', () => {
    expect(creatorPhotos.every((c) => typeof c.selected === 'boolean')).toBe(true);
  });
  it('every selected photo has a use, alt text and a caption that names only verified people', () => {
    for (const c of creatorPhotos.filter((x) => x.selected)) {
      expect(['hero', 'solo', 'bottling'], c.id).toContain(c.use);
      expect(c.alt?.length, c.id).toBeGreaterThan(20);
      expect(c.alt, c.id).not.toMatch(/Kada|Miloud/); // alt describes what is visible only
      if (c.people === null) {
        // left/right unknown: never a positional label
        expect(c.caption).toBe('Kada & Miloud');
      }
      if (c.people?.length === 1) expect(c.caption).toMatch(/^(Kada|Miloud)$/);
    }
  });
  it('pages reference creator photos only through creators.js (never a file name)', () => {
    const files = import.meta.glob(
      ['../pages/**/*.jsx', '../components/**/*.jsx', '../layout/**/*.jsx'],
      { query: '?raw', import: 'default', eager: true },
    );
    for (const [path, src] of Object.entries(files))
      expect(src, path).not.toMatch(/creators\/(miloud|both|kada)-/);
  });
});
