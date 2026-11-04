// Which creator image files may ship in dist/: only derivatives of photos marked `selected: true` in
// src/data/creators.js. Used by the build (prune) and by `npm run check` (fail if anything else slipped in).
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { usedCreatorImages } from '../src/data/creators.js';

// "creators/miloud-01-768.avif" → "creators/miloud-01"
const setOf = (file) => `creators/${file.replace(/-\d+\.(avif|webp|jpg|png)$/, '')}`;

export function unusedCreatorFiles(distDir, allowed = usedCreatorImages()) {
  const dir = join(distDir, 'images', 'creators');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => !allowed.includes(setOf(f)))
    .map((f) => join(dir, f));
}

export function pruneCreatorImages(distDir, allowed = usedCreatorImages()) {
  const extra = unusedCreatorFiles(distDir, allowed);
  for (const f of extra) rmSync(f);
  const dir = join(distDir, 'images', 'creators');
  if (existsSync(dir) && readdirSync(dir).length === 0) rmSync(dir, { recursive: true });
  return extra.length;
}
