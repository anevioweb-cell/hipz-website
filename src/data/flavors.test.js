import { describe, expect, it } from 'vitest';
import { flavors, getFlavor } from './flavors.js';

describe('flavors data', () => {
  it('has exactly the two confirmed flavors', () => {
    expect(flavors.map((f) => f.slug)).toEqual(['lemon', 'peach']);
  });
  it('leaves unconfirmed facts empty instead of inventing them', () => {
    for (const f of flavors) {
      expect(f.description).toBeNull();
      expect(f.volume).toBeNull();
    }
  });
  it('looks flavors up by slug', () => {
    expect(getFlavor('peach').name).toBe('Peach');
    expect(getFlavor('nope')).toBeUndefined();
  });
});
