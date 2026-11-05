import { mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pruneCreatorImages, unusedCreatorFiles } from './creator-images.mjs';

const fakeDist = (files) => {
  const d = mkdtempSync(join(tmpdir(), 'dist-'));
  mkdirSync(join(d, 'images', 'creators'), { recursive: true });
  for (const f of files) writeFileSync(join(d, 'images', 'creators', f), '');
  return d;
};

describe('creator images in dist/', () => {
  it('flags and prunes every file of a photo that is not selected', () => {
    const d = fakeDist(['miloud-01-480.avif', 'miloud-01-480.jpg', 'both-01-768.webp']);
    const allowed = ['creators/both-01'];
    expect(unusedCreatorFiles(d, allowed)).toHaveLength(2);
    expect(pruneCreatorImages(d, allowed)).toBe(2);
    expect(readdirSync(join(d, 'images', 'creators'))).toEqual(['both-01-768.webp']);
    expect(unusedCreatorFiles(d, allowed)).toEqual([]);
  });
  it('removes the folder when nothing is used', () => {
    const d = fakeDist(['both-03-480.avif']);
    pruneCreatorImages(d, []);
    expect(readdirSync(join(d, 'images'))).toEqual([]);
  });
});
