import { DEMO_MODE, FORM_ENDPOINT } from '../config.js';

// The ONE place where the wholesale request leaves the page.
// - Honeypot filled (bot): resolves as if successful, sends nothing.
// - DEMO_MODE true: waits a short realistic delay and resolves with success. NO network request, and the
//   entered data is not stored anywhere (no localStorage, cookies or logging) — it is simply dropped.
// - DEMO_MODE false and no FORM_ENDPOINT configured: rejects with code NOT_AVAILABLE so the page shows a
//   visible "not available yet" state instead of faking success.
// - DEMO_MODE false with an endpoint: POSTs JSON. Replace/extend this before any public launch.
export async function submitWholesaleRequest(
  data,
  { demo = DEMO_MODE, endpoint = FORM_ENDPOINT, delay = 900 } = {},
) {
  if (data.website) return { ok: true, ignored: true };
  if (demo) {
    await new Promise((r) => setTimeout(r, delay));
    return { ok: true };
  }
  if (!endpoint) {
    const err = new Error('Wholesale requests are not available yet');
    err.code = 'NOT_AVAILABLE';
    throw err;
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`);
    err.code = 'FAILED';
    throw err;
  }
  return { ok: true };
}
