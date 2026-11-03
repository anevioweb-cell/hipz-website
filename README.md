# Hipz

Frontend-only brand site: React + Vite + Tailwind CSS v4 + `motion` + react-router. Local only, private repository.

## Run

```bash
npm install
npm run dev          # http://localhost:5173  (dev-only component kit at /_kit)
npm run check        # lint (0 warnings) + prettier check + build + tests; stops at the first failure
npm run build && npm run preview
npm run measure:reference   # Playwright motion measurement of the reference (writes docs/reference-shots/)
```

## Structure

```
src/config.js        DEMO_MODE flag
src/index.css        ALL design tokens (@theme): colors, type, spacing, radii, shadows, motion
src/motion.js        easing/duration mirrors for the motion JS API
src/components/      Button, Chip, Ar, Section, SectionHeader, InsetCard, Marquee, Reveal, EmptyState, Toast, Logo, FlavorTheme
src/layout/          Layout, Navbar (+ mobile menu), Footer, PageTransition
src/pages/           Home, Flavors, FlavorDetail, Distributors, OurStory, NotFound, Kit (dev only)
src/data/            flavors.js (lemon, peach — confirmed); wilayas.js comes in Phase 5
docs/                research, roadmap, reference analysis, font licenses; docs/inputs = owner material
scripts/             check.mjs, measure-reference.mjs
```

Color rule: hex values live only in `src/index.css`. Tokens sampled from real Hipz images are labelled REAL, others PLACEHOLDER. Per-flavor colors come from `src/data/flavors.js` through the `--flavor-accent` CSS variable (`FlavorTheme`).

## DEMO_MODE

`src/config.js` exports `DEMO_MODE = true`. While true, **nothing is sent anywhere**: forms and "quick add" only simulate success. **Before any public launch, DEMO_MODE must be replaced by a real backend (or the flag consciously kept).** The site is also marked `noindex, nofollow` (meta tag in `index.html` + `public/robots.txt` with `Disallow: /`).

## Images stay private

Photos, videos, logo and bottle images (`docs/inputs/`, `sourse of Kada and Miloud/`) are gitignored and must never be published. Keep this repository private; never make it public or deploy a public preview without the owners' written permission.
