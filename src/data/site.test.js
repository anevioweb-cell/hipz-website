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

describe('SOCIAL_LINKS', () => {
  it('has the three owner-supplied links, https and external-safe, and no TikTok', async () => {
    const { SOCIAL_LINKS } = await import('./site.js');
    expect(SOCIAL_LINKS.map((s) => s.href)).toEqual([
      'https://www.instagram.com/hipzdrink/',
      'https://www.youtube.com/@kadaWmiloud',
      'https://www.instagram.com/kadawmiloud/',
    ]);
    for (const s of SOCIAL_LINKS) {
      expect(s.href).toMatch(/^https:\/\//);
      expect(s.label).toBeTruthy();
    }
    expect(JSON.stringify(SOCIAL_LINKS)).not.toMatch(/tiktok/i);
  });
});
