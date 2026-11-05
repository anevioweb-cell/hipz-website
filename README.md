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
npm run copy:review  # docs/COPY_REVIEW.md: all copy by page/section, draft list, banned-claims scan
node scripts/measure-motion.mjs   # frame-by-frame motion measurement of the reference (docs/MOTION_SPEC.md)
node scripts/compare-motion.mjs   # our curves vs the reference (needs a served build on :4174)
```

## Copy review

All copy lives in `src/data/copy.js`; story facts in `src/data/story.js`. Run `npm run copy:review` and send `docs/COPY_REVIEW.md` to the owner before the site is shown to Kada and Miloud: it lists every string (English, Arabic accents, status, length), everything still `draft: true`, and the banned-claims scan. The banned list (`src/data/bannedClaims.js`) is also a unit test, so `npm run check` fails on a forbidden claim or an unapproved number.

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
- `SMOOTH_SCROLL` — Lenis smooth scrolling. **Off** since Phase 6 (the reference scrolls natively); when on, loaded after first paint and never under `prefers-reduced-motion`.

## Images

Masters (`docs/inputs/*.jpeg|png|jpg`) are gitignored. `npm run images` creates the optimized set. The logo is derived from `public/logo.jpg` (150×150 — request a vector/large PNG), see `docs/ASSET_REPORT.md`.

## Forms: `src/lib/submit.js`

The wholesale request form on `/distributors` sends through ONE function, `submitWholesaleRequest()`:

- `DEMO_MODE = true` (current): waits ~0.9 s and shows a normal success state. **No network request is made and the entered data is not stored** (no localStorage, cookies or logging); it is dropped from memory after success. Tests fail if `fetch`, `XMLHttpRequest` or `sendBeacon` is called.
- `DEMO_MODE = false` and `FORM_ENDPOINT = null` (`src/config.js`): the form shows a visible "Not available yet" state — it never fakes success.
- `DEMO_MODE = false` with `FORM_ENDPOINT` set: POSTs JSON to the endpoint.
- A hidden honeypot field (`website`) makes bot submissions resolve silently without sending anything.

**Before any public launch, DEMO_MODE must be replaced by a real backend (or consciously kept).**

## Creator photos (private)

`docs/inputs/creators/` (masters) and `public/images/creators/` (derivatives, `npm run images`) hold photos of Kada and Miloud taken from **their own public accounts and official channel** (see `docs/CREATOR_PHOTOS.md`). They are used **privately for the pitch only**, are gitignored, are not shown on any page yet, and **need the creators' written permission before any public launch**.

## Link previews and hosting (Phase 7)

- **Link previews.** Every route has its own `<title>`, meta description and Open Graph / Twitter tags (text in `copy.meta`, draft), written into static HTML at build time (`dist/<route>/index.html`), because WhatsApp and Instagram read the HTML without running JavaScript. The preview image is `public/og.jpg` (1200×630), generated by `npm run images` (`scripts/make-share.mjs`) from the approved lemon hero scene and the logo badge at its native size — no new text. Icons: `favicon-16/32/48.png` and `apple-touch-icon.png` from the same badge.
- **Set `SITE_URL` before sharing.** Chat apps need ABSOLUTE `og:image` / `og:url`. Put the deployment URL in `SITE_URL` (`src/config.js`, TODO) and rebuild, or build once with `SITE_URL=https://… npm run build`.
- **noindex stays, and previews still work.** `<meta name="robots" content="noindex, nofollow">`, `public/robots.txt` (`Disallow: /`) and an `X-Robots-Tag: noindex, nofollow` header (`vercel.json`) keep the site out of search engines. They do not stop link previews: a chat app fetches the page on behalf of the person who shares it and does not index it. (Some preview bots respect robots.txt; WhatsApp and Instagram fetch the shared URL regardless — check once on the real deployment.)
- **`vercel.json`.** Rewrites for every route and an SPA fallback for any other path (deep links and refresh work; unknown paths show the 404 page), immutable caching for hashed `/assets/*`, one week for `/images/*`, revalidation for HTML, and `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. No Content-Security-Policy (not needed for a static pitch; would need full testing). To check the rules locally: `npm run build` then `node scripts/serve-vercel.mjs dist 4190`.
