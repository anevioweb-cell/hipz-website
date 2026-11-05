# Hipz — Brand Website

A fast, mobile-first, bilingual-accent brand website for **Hipz**, the soda brand owned by the Algerian creators **Kada & Miloud** — two flavors, **Lemon** and **Peach**.

> **Status:** pitch build (`pitch-v1`), live as an unlisted, `noindex` preview at **https://hipz-website-snowy.vercel.app**. It is an independent project, not yet approved for public launch (see [Rights and permissions](#rights-and-permissions)).

---

## At a glance

|                   |                                                                                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **What**          | A complete brand site: home, flavors, a page per flavor, a distributor / wholesale page with a request form and store finder, and the founders' story |
| **Who it is for** | Fans on their phones, shops and distributors who want to stock Hipz, and the brand team                                                               |
| **Languages**     | English, with Arabic accent words set right-to-left in proper Arabic display and text fonts                                                           |
| **Built with**    | React 19, Vite, Tailwind CSS v4, `motion`, React Router — static site, no backend required                                                            |
| **Quality**       | Lighthouse mobile 95–99 performance on every page, 100 accessibility, 100 best practices, zero layout shift, zero third-party requests                |

---

## For the brand and clients

**What the site does**

- **Home** — a framed hero that switches between Lemon and Peach, a moving ticker, the flavor carousel, moments, "Why Hipz", both flavors together and a community strip.
- **Flavors** — a band per flavor and a dedicated page for each one with its confirmed basics.
- **Distributors** — a clear invitation for shops, wholesalers, cafés and events: the commercial-service numbers, ways to work together, a wholesale request form with friendly validation and an all-69-wilayas store finder.
- **Our story** — Kada & Miloud and the brand, told only with confirmed facts and their own photos.

**What visitors get**

- Designed for phones first (iPhone and Android), perfect on tablets and desktops.
- Opens fast, even on mobile networks: the first screen is painted before any JavaScript runs.
- A rich link preview (title, description, image) when the link is shared on WhatsApp or Instagram.
- Smooth, playful motion — and a calm, static version for people who prefer reduced motion.
- Accessible to everyone: keyboard, screen readers, large touch targets, readable contrast.
- No tracking, no cookies, no third-party scripts.

**Content is easy to change** — all text, flavors, story facts, links and photos live in small data files; see [`docs/HANDOVER.md`](docs/HANDOVER.md).

---

## Quality report

| Page                   | Performance | Accessibility | Best practices | LCP   | CLS |
| ---------------------- | ----------- | ------------- | -------------- | ----- | --- |
| Home                   | 95–97       | 100           | 100            | 2.4 s | 0   |
| Flavors                | 96          | 100           | 100            | 2.8 s | 0   |
| Flavor (Lemon / Peach) | 97–98       | 100           | 100            | 2.4 s | 0   |
| Distributors           | 96          | 100           | 100            | 2.7 s | 0   |
| Our story              | 99          | 100           | 100            | 2.3 s | 0   |

_Lighthouse mobile, 3 runs each, local production build. Live numbers: [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md)._

- **Cross-browser:** Chromium, Firefox and WebKit × 7 routes × 4 widths — 84/84 pass; emulated iPhone SE, iPhone 15 Pro Max, Pixel 7 and iPad ([`docs/QA_MATRIX.md`](docs/QA_MATRIX.md)).
- **Accessibility:** axe-core, 0 violations on 15 routes and UI states (WCAG 2.2 AA + best practices), plus manual checks (headings, landmarks, focus, contrast over images, reduced motion).
- **End-to-end:** 9 user flows pass on Chromium, Firefox and WebKit (`npm run e2e`).
- **Unit tests:** 163 (Vitest + Testing Library), including content rules (no unconfirmed claims, numbers or names).
- **Security:** no secrets in the code or history (gitleaks), `npm audit` clean, `noindex` + `X-Robots-Tag`, security headers.

---

## For developers and hiring teams

**Engineering highlights**

- **Motion system measured, not guessed.** The reference design's animations were sampled frame by frame (requestAnimationFrame, 1440 / 390 px) and rebuilt as two primitives: `PopText` (per-character pop on the Web Animations API, exact overshooting cubic-bezier) and `PopBlock` (fitted rise curves and springs). Fail-safes guarantee text is never left invisible; reduced motion renders everything static.
- **Static first frame before JavaScript.** Each page's hero is painted from static HTML (the `/flavors` band is server-rendered at build time with `react-dom/server`) and handed over to React without a flash — this keeps LCP low and CLS at 0.
- **Link previews in a single-page app.** The build writes a static HTML file per route with its own title, description and Open Graph / Twitter tags, so chat apps that do not run JavaScript still get the right preview.
- **Data-driven content with guard rails.** Copy, flavors, story facts and photos are plain data files; tests enforce the content rules (a banned-claims list, no phone numbers outside one page, photos only when selected, story facts only with a source and verification).
- **Image pipeline.** `sharp` generates AVIF / WebP / JPG (or palette PNG) sets with art-directed crops and focal points; explicit sizes everywhere, nothing shifts.
- **Robust by default.** Error boundary with a designed fallback, lazy-route chunk retry, failed-image handling, `<noscript>` message, simulated forms that never send data (`DEMO_MODE`).
- **Verified, repeatable QA.** Scripts for the browser/device matrix, axe audits, contrast sampling by worst pixel, network audits, motion comparison and Lighthouse runs.

**Tech stack**

React 19 · Vite · Tailwind CSS v4 (design tokens in `@theme`) · `motion` (LazyMotion) · React Router 7 · Vitest + Testing Library · Playwright · axe-core · sharp · ESLint (0 warnings) + Prettier.

**Project structure**

```
src/
  pages/        Home, Flavors, FlavorDetail, Distributors, OurStory, NotFound
  components/   PopText, PopBlock, Picture, FlavorScene, Marquee, ErrorBoundary, …
  layout/       Navbar (+ accessible mobile menu), Footer, PageTransition
  data/         copy.js, flavors.js, story.js, creators.js, site.js, wilayas.js, stores.js
  lib/          form submit (DEMO_MODE), validation, phone formats, page meta, chunk retry
  ssr/          build-time render of the /flavors first frame
  config.js     DEMO_MODE, FORM_ENDPOINT, SITE_URL, SMOOTH_SCROLL
  index.css     all design tokens
scripts/        images, link-preview image, QA matrix, a11y, e2e, motion measurement, notices
docs/           handover, roadmap, QA matrix, motion spec, copy review, release notes
```

---

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # lint (0 warnings) + format + build + unit tests — must stay green
npm run build        # static site in dist/
npm run e2e          # build + 9 end-to-end flows in a real browser (~15 s)
```

More scripts:

```bash
npm run images       # rebuild optimized images, og.jpg and icons from the masters (masters are not in git)
npm run copy:review  # docs/COPY_REVIEW.md — every string, its status and the banned-claims scan
npm run notices      # THIRD_PARTY_NOTICES.md from the production dependency tree
node scripts/qa-matrix.mjs && node scripts/qa-devices.mjs && node scripts/qa-report.mjs   # browser/device matrix (served build on :4174)
node scripts/a11y-audit.mjs       # axe-core on every route and key state (served build on :4174)
node scripts/serve-vercel.mjs dist 4190   # serve a build with the vercel.json rules
```

Editing content, approving copy and deploying: **[`docs/HANDOVER.md`](docs/HANDOVER.md)**.

---

## Developer guide

**Configuration (`src/config.js`)**

- `DEMO_MODE` (`true`) — the wholesale form validates and shows success, but **nothing is sent or stored** (no request, storage or cookies; tests enforce it). Replace with a real backend (`FORM_ENDPOINT`) or keep it deliberately before any public launch. With `DEMO_MODE = false` and no endpoint the form shows "not available yet".
- `FORM_ENDPOINT` — where the form POSTs JSON when `DEMO_MODE` is off.
- `SITE_URL` — public origin of the deployment; needed for absolute link-preview URLs (or build with `SITE_URL=https://… npm run build`).
- `SMOOTH_SCROLL` — Lenis smooth scrolling, off (the reference scrolls natively).

**Design tokens** — colors, type, spacing, radii and motion values live only in `src/index.css` (`@theme`) and `src/motion.js`; per-flavor colors flow through `--flavor-accent`.

**Images** — masters are kept out of git; `npm run images` builds `public/images/*` and `src/data/images.generated.js`. The logo source is `brand/logo.jpg` (150 px; never displayed taller than 52 px). Creator photos (`docs/inputs/creators/`, `public/images/creators/`) are gitignored; only photos marked `selected` in `src/data/creators.js` ship (the build prunes the rest and `npm run check` fails otherwise).

**Forms** — everything goes through `submitWholesaleRequest()` in `src/lib/submit.js` (honeypot field included).

**Copy** — all text in `src/data/copy.js`, each entry flagged `draft` / `approved`; the banned-claims list (`src/data/bannedClaims.js`) runs as a unit test.

**Hosting** — deploy **only from a local build**: `npm run check` → `vercel build --prod` → `vercel deploy --prebuilt --prod`. Never connect Git auto-deploys: the creator photos are not in the repository, so a Git build would ship the site without them. `vercel.json`: route rewrites + SPA fallback (deep links and refresh work), `X-Robots-Tag: noindex, nofollow`, immutable caching for hashed assets, revalidation for HTML, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.

**Link previews and noindex** — `noindex` (robots meta, `robots.txt`, `X-Robots-Tag`) keeps the site out of search engines; it does not stop link previews, because chat apps fetch a shared page on behalf of the person sharing it.

---

## Rights and permissions

This is an independent project. The Hipz name, logo and product images belong to their owners, and so do the names and likeness of Kada & Miloud. **Photos of people are not included in this repository**; the live preview gets them from a local build. Written permission is required before any public launch.

- The hero and flavor scenes are **AI-generated concept art** made from real bottle photos; real photography can replace them at any time.
- The visual language follows a measured reference design; all code, copy and images here are original — no reference files, text, images or fonts were reused.
- Fonts: SIL Open Font License 1.1; dependencies: see [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

**Copyright © anevioweb-cell. All rights reserved.** No open-source license is granted: you may read the code, but not copy, modify or redistribute it without permission.

---

## Documentation

| Document                                         | What it covers                                            |
| ------------------------------------------------ | --------------------------------------------------------- |
| [`docs/HANDOVER.md`](docs/HANDOVER.md)           | Where content lives, approving copy, DEMO_MODE, deploying |
| [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md) | Live preview, version, numbers, known limitations         |
| [`docs/ROADMAP.md`](docs/ROADMAP.md)             | Phases, decisions and the pre-launch checklist            |
| [`docs/QA_MATRIX.md`](docs/QA_MATRIX.md)         | Browser × width × device results                          |
| [`docs/MOTION_SPEC.md`](docs/MOTION_SPEC.md)     | Measured motion and how it was rebuilt                    |
| [`docs/COPY_REVIEW.md`](docs/COPY_REVIEW.md)     | Every string, its status, the banned-claims scan          |
| [`docs/BRAND_BRIEF.md`](docs/BRAND_BRIEF.md)     | Confirmed facts and owner decisions, with sources         |
| [`docs/FONT_LICENSES.md`](docs/FONT_LICENSES.md) | Fonts and licenses                                        |

---

**Design & development:** [anevioweb-cell](https://github.com/anevioweb-cell).
