import { describe, expect, it } from 'vitest';
import { PUBLIC_CONTACT, SITE } from './site.js';

describe('site data', () => {
  it('PUBLIC_CONTACT has labelled phones with display and tel forms', () => {
    expect(PUBLIC_CONTACT.phones).toHaveLength(2);
    for (const p of PUBLIC_CONTACT.phones) {
      expect(p.display).toMatch(/^0[5-7] ?\d{8}$/);
      expect(p.tel).toMatch(/^\+213[5-7]\d{8}$/);
    }
  });
  it('names the brand in Latin and Arabic', () => {
    expect(SITE.name).toBe('Hipz');
    expect(SITE.nameAr).toBe('هايبز');
  });
});
