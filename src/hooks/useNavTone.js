import { useLayoutEffect, useSyncExternalStore } from 'react';

// Tiny external store: pages tell the overlay navbar whether the area behind it is bright ("dark" text)
// or dark ("light" text). Default is "light" (white text on ink).
let tone = 'light';
const listeners = new Set();
const set = (next) => {
  if (tone === next) return;
  tone = next;
  listeners.forEach((l) => l());
};

export const useNavToneValue = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => tone,
    () => 'light',
  );

// Call from a page whose top area is bright. Resets on unmount.
export function useNavTone(next) {
  useLayoutEffect(() => {
    set(next);
    return () => set('light');
  }, [next]);
}
