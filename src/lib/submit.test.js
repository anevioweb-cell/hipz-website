import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitWholesaleRequest } from './submit.js';
import { DEMO_MODE } from '../config.js';

const data = {
  business: 'Shop',
  contact: 'Ali',
  phone: '0560404339',
  wilaya: '16',
  type: 'shop',
  website: '',
};
let spies;
beforeEach(() => {
  spies = {
    fetch: vi.fn(() => Promise.reject(new Error('network used'))),
    xhr: vi.fn(),
    beacon: vi.fn(() => true),
    setItem: vi.spyOn(Storage.prototype, 'setItem'),
  };
  vi.stubGlobal('fetch', spies.fetch);
  vi.stubGlobal(
    'XMLHttpRequest',
    vi.fn(function XHR() {
      spies.xhr();
    }),
  );
  navigator.sendBeacon = spies.beacon;
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete navigator.sendBeacon;
});
const noNetwork = () => {
  expect(spies.fetch).not.toHaveBeenCalled();
  expect(spies.xhr).not.toHaveBeenCalled();
  expect(spies.beacon).not.toHaveBeenCalled();
  expect(spies.setItem).not.toHaveBeenCalled();
  expect(document.cookie).toBe('');
};

describe('submitWholesaleRequest', () => {
  it('ships with DEMO_MODE on', () => expect(DEMO_MODE).toBe(true));
  it('DEMO_MODE: resolves with success and makes NO network request and stores nothing', async () => {
    await expect(submitWholesaleRequest(data, { delay: 1 })).resolves.toEqual({ ok: true });
    noNetwork();
  });
  it('honeypot filled: pretends success and sends nothing, even with DEMO_MODE off', async () => {
    await expect(
      submitWholesaleRequest(
        { ...data, website: 'spam' },
        { demo: false, endpoint: 'https://x.test' },
      ),
    ).resolves.toEqual({ ok: true, ignored: true });
    noNetwork();
  });
  it('DEMO_MODE off without an endpoint: fails loudly instead of faking success', async () => {
    await expect(
      submitWholesaleRequest(data, { demo: false, endpoint: null }),
    ).rejects.toMatchObject({ code: 'NOT_AVAILABLE' });
    noNetwork();
  });
});
