import { describe, expect, it } from 'vitest';
import { copy } from './copy.js';

const leaves = [];
(function walk(node, path) {
  if (node && typeof node === 'object' && 'draft' in node) leaves.push([path, node]);
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
})(copy, 'copy');

describe('copy.js', () => {
  it('has copy entries', () => {
    expect(leaves.length).toBeGreaterThan(25);
  });
  it('marks every entry draft: true except the owner-approved hero headline and chip', () => {
    const approvedPaths = ['copy.hero.eyebrow', 'copy.hero.headline'];
    for (const [path, leaf] of leaves) expect(leaf.draft, path).toBe(!approvedPaths.includes(path));
  });
  it('contains no forbidden claims', () => {
    const banned =
      /calorie|sugar|real fruit|natural|organic|vitamin|made in|award|the best|best-selling|#1|\d+\s?(ml|%|cl)|review|customers? say/i;
    expect(JSON.stringify(copy)).not.toMatch(banned);
  });
  it('limits ticker items to neutral words', () => {
    const allowed = new Set([
      'Hipz',
      'Lemon',
      'Peach',
      'Ice cold',
      'Pop it',
      'Share it',
      'هايبز',
      'ليمون',
      'خوخ',
    ]);
    for (const i of copy.ticker.items.items) expect(allowed.has(i.text ?? i.ar)).toBe(true);
  });
});
