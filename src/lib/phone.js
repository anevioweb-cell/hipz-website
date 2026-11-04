// Algerian phone numbers.
// Accepted input: optional +213 / 00213 / 213 prefix (a leading 0 after the prefix is tolerated),
// spaces, dots, dashes and brackets are ignored.
// National forms after normalising:
//   mobile   0 + [5|6|7] + 8 digits  (10 digits, e.g. 05 12 34 56 78)
//   landline 0 + [2|3|4] + 7 digits  (9 digits,  e.g. 021234567)
// Returns { national, e164 } or null.
export function normalizeDZ(input) {
  if (typeof input !== 'string') return null;
  let s = input.trim().replace(/[\s.\-()]/g, '');
  if (s.startsWith('+')) s = s.slice(1);
  if (s.startsWith('00213')) s = s.slice(5);
  else if (s.startsWith('213') && s.length >= 11) s = s.slice(3);
  else if (!s.startsWith('0')) return null;
  if (!/^\d+$/.test(s)) return null;
  if (!s.startsWith('0')) s = `0${s}`;
  const mobile = /^0[567]\d{8}$/.test(s);
  const landline = /^0[234]\d{7}$/.test(s);
  if (!mobile && !landline) return null;
  return { national: s, e164: `+213${s.slice(1)}` };
}

// tel: href for a displayed number (throws if the number is not valid — data error, not user input)
export function telHref(display) {
  const n = normalizeDZ(display);
  if (!n) throw new Error(`Invalid Algerian number: ${display}`);
  return `tel:${n.e164}`;
}
