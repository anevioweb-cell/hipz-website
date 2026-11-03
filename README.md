# Hipz

Frontend-only brand site (React + Vite + Tailwind CSS + motion). Phase 0 (research and planning) only — see `docs/`.

## DEMO_MODE

`src/config.js` will export `DEMO_MODE = true`. While true, **nothing is sent anywhere**: forms and "quick add" only simulate success. **Before any public launch, DEMO_MODE must be replaced by a real backend (or the flag deliberately kept).** The site is also marked `noindex, nofollow` (meta tag + robots.txt) and the repository must stay private.
