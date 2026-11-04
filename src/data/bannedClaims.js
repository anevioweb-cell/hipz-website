// Banned-claims list, run over every displayed string of src/data/copy.js and src/data/story.js
// (src/data/claims.test.js, and the scan section of docs/COPY_REVIEW.md via `npm run copy:review`).
// To extend: add { pattern, why } to BANNED. Digits are banned everywhere except the patterns in
// DIGIT_ALLOW (each with the reason it is fine).

export const BANNED = [
  { pattern: /real fruit/i, why: 'fruit-content claim' },
  { pattern: /\bnatural(ly)?\b/i, why: 'naturalness claim' },
  { pattern: /\bhealth(y|ier)?\b/i, why: 'health claim' },
  { pattern: /sugar/i, why: 'sugar claim' },
  { pattern: /calorie/i, why: 'calorie claim' },
  { pattern: /vitamin/i, why: 'nutrition claim' },
  { pattern: /organic/i, why: 'organic claim' },
  { pattern: /\bbest\b/i, why: 'superlative claim' },
  { pattern: /#\s?1\b|number one|n°\s?1/i, why: 'ranking claim' },
  { pattern: /award/i, why: 'award claim' },
  { pattern: /since\s+(19|20)\d\d|since 20/i, why: 'founding date (unconfirmed)' },
  {
    pattern: /made in algeria|produced in|brewed in|bottled in/i,
    why: 'origin / production claim',
  },
  { pattern: /deliver(y|ies|ed)?\b/i, why: 'delivery promise' },
  { pattern: /free shipping|free delivery/i, why: 'shipping promise' },
  { pattern: /discount|promo(tion)?\b|\boff\b\s*\d/i, why: 'price promotion' },
  { pattern: /%\s|\d\s?%/, why: 'percentage figure' },
  { pattern: /\breview(s|ed)?\b|customers? say|rated\b|stars?\b/i, why: 'review / rating' },
  {
    pattern: /followers?\b|subscribers?\b|views\b/i,
    why: 'audience numbers (third-party, unconfirmed)',
  },
];

export const DIGIT_ALLOW = [
  { pattern: /\b330\b/, why: 'approved volume (owner, BRAND_BRIEF row 34)' },
  {
    pattern: /05 XX XX XX XX|\+213 5XX XX XX XX|05\/06\/07/,
    why: 'phone-number FORMAT hint in the form (no real number)',
  },
  { pattern: /\b1000\b/, why: 'form length limit (a UI rule, not a claim)' },
];

const stripAllowed = (s) =>
  DIGIT_ALLOW.reduce((t, a) => t.replace(new RegExp(a.pattern, 'g'), ''), s);

/** @returns {{ rule: string, why: string }[]} problems found in one string */
export function checkString(s) {
  const out = [];
  for (const b of BANNED) if (b.pattern.test(s)) out.push({ rule: String(b.pattern), why: b.why });
  if (/\d/.test(stripAllowed(s))) out.push({ rule: 'digit', why: 'number not on the allow-list' });
  return out;
}

/** Which allow-list entries a string uses (for the report). */
export const allowedDigits = (s) => DIGIT_ALLOW.filter((a) => a.pattern.test(s));

/**
 * Every displayed string in an object tree, with its path. Skips non-displayed metadata: sources
 * (`source`, `ref`), flags, ids and numbers.
 */
export function collectStrings(node, path, out = []) {
  if (typeof node === 'string') out.push([path, node]);
  else if (Array.isArray(node)) node.forEach((v, i) => collectStrings(v, `${path}[${i}]`, out));
  else if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node))
      if (!['source', 'ref', 'kind', 'id', 'lang'].includes(k))
        collectStrings(v, `${path}.${k}`, out);
  return out;
}
