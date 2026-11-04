import { useSyncExternalStore } from 'react';

// Shared "business type" for the wholesale form: the "Get in touch" rows pre-select it, the form's
// select reads and writes it. A tiny external store (no prop drilling, no effects).
let value = '';
const listeners = new Set();
export function setRequestType(next) {
  value = next;
  listeners.forEach((l) => l());
}
export function useRequestType() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => value,
    () => '',
  );
}
