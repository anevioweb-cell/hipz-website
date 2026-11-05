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
  it('has a draft flag on every entry; all approved by the owner (Phase 8)', () => {
    for (const [path, leaf] of leaves) expect(leaf.draft, path).toBe(false);
  });
  it('contains no forbidden claims', () => {
    const banned =
      /calorie|sugar|real fruit|natural|organic|vitamin|made in|award|the best|best-selling|#1|\d+\s?(ml|%|cl)|review|customers? say/i;
    expect(JSON.stringify(copy)).not.toMatch(banned);
  });
  it('the distributors copy invites contact only (no commercial terms or promises)', () => {
    const txt = JSON.stringify(copy.distributors);
    expect(txt).not.toMatch(
      /24\s?h|within|minimum|margin|price|discount|deliver|free|offer|promo|wholesale price|exclusive|guarantee/i,
    );
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
