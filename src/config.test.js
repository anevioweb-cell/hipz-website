import { describe, expect, it } from 'vitest';
import { DEMO_MODE } from './config.js';

describe('config', () => {
  it('ships with DEMO_MODE on so nothing is ever sent', () => {
    expect(DEMO_MODE).toBe(true);
  });
});
