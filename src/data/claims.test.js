import { describe, expect, it } from 'vitest';
import { copy } from './copy.js';
import { story } from './story.js';
import { checkString, collectStrings } from './bannedClaims.js';

const strings = [...collectStrings(copy, 'copy'), ...collectStrings(story, 'story')];

describe('banned claims (copy.js + story.js)', () => {
  it('scans a real number of strings', () => {
    expect(strings.length).toBeGreaterThan(150);
  });
  it('flags nothing', () => {
    const flagged = strings
      .map(([path, s]) => ({ path, s, problems: checkString(s) }))
      .filter((f) => f.problems.length);
    // the failure message lists each flagged string, its path and the rule it broke
    expect(flagged, JSON.stringify(flagged, null, 1)).toEqual([]);
  });
  it('the checker itself catches the banned phrases', () => {
    for (const bad of [
      'Made with real fruit',
      'All natural',
      'A healthy choice',
      'No sugar',
      'Zero calories',
      'Packed with vitamins',
      'Organic lemons',
      'The best soda',
      'The #1 drink',
      'Award-winning',
      'Since 2019',
      'Made in Algeria',
      'Fast delivery',
      'Free shipping',
      '10% discount',
      'Rated 5 stars',
      '120K followers',
      'Open 7 days',
    ])
      expect(checkString(bad), bad).not.toEqual([]);
    for (const ok of ['330 ml', 'e.g. 05 XX XX XX XX', 'Up to 1000 characters.', 'Lemon or peach?'])
      expect(checkString(ok), ok).toEqual([]);
  });
});
