import { describe, expect, it } from 'vitest';
import { wilayas } from './wilayas.js';

describe('wilayas', () => {
  it('has exactly 69 entries with codes 01..69, in order, no gaps', () => {
    expect(wilayas).toHaveLength(69);
    expect(wilayas.map((w) => w.code)).toEqual(
      Array.from({ length: 69 }, (_, i) => String(i + 1).padStart(2, '0')),
    );
  });
  it('has unique Latin and Arabic names, all non-empty', () => {
    const latin = wilayas.map((w) => w.name);
    const arabic = wilayas.map((w) => w.nameAr);
    expect(new Set(latin).size).toBe(69);
    expect(new Set(arabic).size).toBe(69);
    for (const w of wilayas) {
      expect(w.name.trim()).toBe(w.name);
      expect(w.name.length).toBeGreaterThan(2);
      expect(w.nameAr).toMatch(/^[؀-ۿ\s]+$/);
    }
  });
  it('marks every code as verified (59–69 by decree 26-206, JO n° 40/2026)', () => {
    for (const w of wilayas) expect(typeof w.codeVerified, w.code).toBe('boolean');
    expect(wilayas.filter((w) => w.codeVerified)).toHaveLength(69);
  });
  it('carries the verified spellings of the official text', () => {
    const by = Object.fromEntries(wilayas.map((w) => [w.code, w]));
    expect(by['59'].nameAr).toBe('أفلو');
    expect(by['65'].name).toBe('Aïn Ouessara');
    expect(by['68'].name).toBe('Bou Saâda');
    expect(by['16'].nameAr).toBe('الجزائر');
  });
});
