import { describe, expect, it } from 'vitest';
import { normalizeDZ, telHref } from './phone.js';

describe('normalizeDZ', () => {
  it.each([
    ['05 60404339', '+213560404339'],
    ['07 70787889', '+213770787889'],
    ['0560404339', '+213560404339'],
    ['06.12.34.56.78', '+213612345678'],
    ['07-70-78-78-89', '+213770787889'],
    ['+213 560 40 43 39', '+213560404339'],
    ['+213560404339', '+213560404339'],
    ['00213 560404339', '+213560404339'],
    ['+213 0560404339', '+213560404339'], // stray 0 after the prefix
    ['213560404339', '+213560404339'],
    ['021 23 45 67', '+21321234567'], // Algiers landline
    ['(041) 33 22 11', '+21341332211'], // Oran landline
  ])('%s → %s', (input, e164) => {
    expect(normalizeDZ(input)?.e164).toBe(e164);
  });
  it.each([
    '',
    '12345',
    '0860404339',
    '05604043',
    '056040433999',
    '+33 6 12 34 56 78',
    '05 6040 4339 x',
    'abc',
    '٠٥٦٠٤٠٤٣٣٩',
  ])('rejects %s', (input) => {
    expect(normalizeDZ(input)).toBeNull();
  });
  it('builds tel: links from the displayed bio numbers', () => {
    expect(telHref('05 60404339')).toBe('tel:+213560404339');
    expect(telHref('07 70787889')).toBe('tel:+213770787889');
  });
});
