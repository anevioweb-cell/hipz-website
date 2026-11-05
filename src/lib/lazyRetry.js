import { lazy } from 'react';

// React.lazy with ONE retry: a lazy route chunk can fail on a flaky connection (or right after a new
// deploy). Wait a moment and try again once; if that fails too, the error reaches the ErrorBoundary,
// which shows a friendly "reload" page instead of a blank screen.
export function retryOnce(load, delay = 800) {
  return () => load().catch(() => new Promise((r) => setTimeout(r, delay)).then(load));
}
export const lazyRetry = (load, delay) => lazy(retryOnce(load, delay));

/** True for the errors browsers throw when a dynamic import (lazy chunk) cannot be fetched. */
export const isChunkError = (e) =>
  /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|Failed to fetch/i.test(
    `${e?.name} ${e?.message}`,
  );
