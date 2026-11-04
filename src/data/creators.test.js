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
  it('is not used by any page yet', () => {
    const files = import.meta.glob(
      ['../pages/**/*.jsx', '../components/**/*.jsx', '../layout/**/*.jsx'],
      {
        query: '?raw',
        import: 'default',
        eager: true,
      },
    );
    for (const [path, src] of Object.entries(files))
      expect(src, path).not.toMatch(/creators\.js|creators\//);
  });
});
