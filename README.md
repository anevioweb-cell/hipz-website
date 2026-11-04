# Hipz

Frontend-only brand site: React + Vite + Tailwind CSS v4 + `motion` + react-router. Local only, private repository.

## Run

```bash
npm install
npm run dev          # http://localhost:5173  (dev-only component kit at /_kit)
npm run check        # lint (0 warnings) + prettier check + build + tests; stops at the first failure
npm run build && npm run preview
npm run images       # masters in docs/inputs → AVIF/WebP/JPG|PNG in public/images + src/data/images.generated.js
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
src/data/            flavors.js (lemon, peach), site.js (PUBLIC_CONTACT — distributors page only), copy.js (ALL copy, draft: true), images.generated.js (build output)
docs/                research, roadmap, reference analysis, font licenses; docs/inputs = owner material
scripts/             check.mjs, measure-reference.mjs, images.mjs (+ config), make-logo.mjs
```

Color rule: hex values live only in `src/index.css`. Tokens sampled from real Hipz images are labelled REAL, others PLACEHOLDER. Per-flavor colors come from `src/data/flavors.js` through the `--flavor-accent` CSS variable (`FlavorTheme`).

## DEMO_MODE

`src/config.js` exports `DEMO_MODE = true`. While true, **nothing is sent anywhere**: forms and "quick add" only simulate success. **Before any public launch, DEMO_MODE must be replaced by a real backend (or the flag consciously kept).** The site is also marked `noindex, nofollow` (meta tag in `index.html` + `public/robots.txt` with `Disallow: /`).

## Images stay private

Photos, videos, logo and bottle images (`docs/inputs/`, `sourse of Kada and Miloud/`) are gitignored and must never be published. The optimized product images in `public/images/` and the logo files in `public/` ARE committed (the site needs them), which is one more reason this repository must stay private; never make it public or deploy a public preview without the owners' written permission.

## Config flags (`src/config.js`)

- `DEMO_MODE` — see above.
- `SMOOTH_SCROLL` — Lenis smooth scrolling, loaded after first paint, off under `prefers-reduced-motion`.

## Images

Masters (`docs/inputs/*.jpeg|png|jpg`) are gitignored. `npm run images` creates the optimized set. The logo is derived from `public/logo.jpg` (150×150 — request a vector/large PNG), see `docs/ASSET_REPORT.md`.

## Forms: `src/lib/submit.js`

The wholesale request form on `/distributors` sends through ONE function, `submitWholesaleRequest()`:

- `DEMO_MODE = true` (current): waits ~0.9 s and shows a normal success state. **No network request is made and the entered data is not stored** (no localStorage, cookies or logging); it is dropped from memory after success. Tests fail if `fetch`, `XMLHttpRequest` or `sendBeacon` is called.
- `DEMO_MODE = false` and `FORM_ENDPOINT = null` (`src/config.js`): the form shows a visible "Not available yet" state — it never fakes success.
- `DEMO_MODE = false` with `FORM_ENDPOINT` set: POSTs JSON to the endpoint.
- A hidden honeypot field (`website`) makes bot submissions resolve silently without sending anything.

**Before any public launch, DEMO_MODE must be replaced by a real backend (or consciously kept).**
