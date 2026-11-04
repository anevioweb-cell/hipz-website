import { normalizeDZ } from './phone.js';
import { wilayas } from '../data/wilayas.js';

export const BUSINESS_TYPES = ['shop', 'wholesale', 'horeca', 'events', 'other'];
export const MESSAGE_MAX = 1000;
const NAME_MAX = 120;
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const CODES = new Set(wilayas.map((w) => w.code));

// Validation rules for the wholesale request form. Returns { field: errorKey } (empty = valid).
// - business, contact: required, trimmed, 2–120 characters (any script: Arabic or Latin)
// - phone: required, Algerian mobile (05/06/07 + 8 digits) or landline (02/03/04 + 7 digits),
//          optional +213 / 00213 prefix, spaces . - ( ) tolerated   (see lib/phone.js)
// - email: optional; if filled must look like name@domain.tld
// - wilaya: required, one of the 69 codes
// - type: required, one of BUSINESS_TYPES
// - message: optional, at most 1000 characters
export function validateRequest(v) {
  const e = {};
  const text = (x) => (typeof x === 'string' ? x.trim() : '');
  for (const f of ['business', 'contact']) {
    const t = text(v[f]);
    if (t.length < 2) e[f] = 'required';
    else if (t.length > NAME_MAX) e[f] = 'tooLong';
  }
  if (!text(v.phone)) e.phone = 'required';
  else if (!normalizeDZ(v.phone)) e.phone = 'phone';
  if (text(v.email) && !EMAIL.test(text(v.email))) e.email = 'email';
  if (!CODES.has(v.wilaya)) e.wilaya = 'required';
  if (!BUSINESS_TYPES.includes(v.type)) e.type = 'required';
  if (text(v.message).length > MESSAGE_MAX) e.message = 'tooLong';
  return e;
}
