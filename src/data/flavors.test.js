import { describe, expect, it } from 'vitest';
import { flavors, getFlavor, otherFlavor } from './flavors.js';
import { images } from './images.generated.js';

describe('flavors data', () => {
  it('has exactly the two confirmed flavors with Arabic names', () => {
    expect(flavors.map((f) => f.slug)).toEqual(['lemon', 'peach']);
    expect(flavors.map((f) => f.nameAr)).toEqual(['ليمون', 'خوخ']);
  });
  it('keeps the volume unknown (null) — a size is never invented', () => {
    for (const f of flavors) {
      expect(f.volume).toBeNull();
      expect(JSON.stringify(f)).not.toMatch(/\d+\s?(ml|cl|l)\b|medium/i);
    }
  });
  it('only carries verified attributes (format, cap, serve) with no empty values', () => {
    for (const f of flavors) {
      expect(Object.keys(f.attributes).sort()).toEqual(['cap', 'format', 'serve']);
      for (const v of Object.values(f.attributes)) expect(v).toBeTruthy();
    }
  });
  it('points every image key at a generated image with focal data for scenes', () => {
    for (const f of flavors) {
      expect(images[f.images.bottle]).toBeTruthy();
      for (const k of ['heroWide', 'heroPortrait']) {
        const meta = images[f.images[k]];
        expect(meta.focal).toBeTruthy();
        expect(meta.box.w).toBeGreaterThan(0);
        expect(meta.width).toBeGreaterThan(0);
      }
    }
  });
  it('looks flavors up by slug and finds the other one', () => {
    expect(getFlavor('peach').name).toBe('Peach');
    expect(getFlavor('nope')).toBeUndefined();
    expect(otherFlavor('lemon').slug).toBe('peach');
  });
});
