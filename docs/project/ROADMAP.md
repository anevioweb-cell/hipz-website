# Hipz — Roadmap, Sitemap, Components, Risks

Stack: React + Vite + Tailwind CSS + `motion` (motion.dev), frontend only. Nothing is scaffolded in Phase 0.

## 1. Sitemap

- `/` Home — hero · marquee · flavors · moments · why Hipz · community · variety pack · footer
- `/flavors` — all flavours
- `/flavors/:slug` — flavour detail
- `/distributors` — ways to work with Hipz · wholesale request form (simulated) · empty-state store finder
- `/our-story`
- 404 page. **No `/credits` page.**

Wholesale form fields include a wilaya `<select>` fed from `src/data/wilayas.js` (all 69 wilayas, each verified against **two independent sources** before the file is committed; list the sources in a comment). Note: this assumes the current 69-wilaya administrative division — to be re-verified at that time.

UI language: English with Arabic accent words through a small `<Ar>` component (sets `lang="ar"`, `dir="rtl"`, Arabic font). **Awaiting your confirmation.**

## 2. Component list

- Layout: `Navbar` (overlay, mobile menu), `Footer`, `PageTransition`, `SmoothScroll` (optional), `Section`, `InsetCard`
- UI: `Button` (pill + arrow chip), `Chip`, `Ar`, `SectionHeader`, `Marquee`, `Reveal`, `SplitLines`, `Parallax`, `Toast` (simulated success), `EmptyState`
- Flavors: `FlavorCard`, `FlavorCarousel` (scroll-snap + arrows), `FlavorHero`, `FlavorAttributes`, `MoreToSip`, `Bottle` (image + blob + hover), `BothFlavorsCard`
- Home: `Hero`, `Ticker`, `FlavorsSection`, `Moments`, `WhyHipz` (pillars), `IngredientsStage` (only if ingredients confirmed), `Community`, `BothFlavorsCard`
- Distributors: `WaysToWork`, `WholesaleForm` (validation, DEMO_MODE), `StoreFinderEmpty`
- Data/config: `src/config.js` (`DEMO_MODE = true`), `src/data/flavors.js`, `src/data/wilayas.js`, `src/data/site.js`
- Head: `<meta name="robots" content="noindex, nofollow">`, `public/robots.txt` (`Disallow: /`)

`DEMO_MODE` rule: when true, nothing is sent anywhere; forms and "quick add" show a normal-looking success message. README must state that it must be replaced by a real backend (or the flag kept) before any public launch.

## 3. Phases


**Status (2026-11-05):** Phases 1–7 done and committed locally (not pushed). Phase 8 (release) not started.

Global acceptance for **every** phase: `npm run check` (lint + typecheck/build + tests, defined in Phase 1) passes with no errors or warnings; `prefers-reduced-motion` respected; one commit per part; no push.

| Phase | Deliverables | Acceptance checks |
|---|---|---|
| **1 Scaffold + design system** | Vite+React+Tailwind+motion, ESLint/Prettier, `npm run check`, tokens (colour, type, spacing, radii), fonts self-hosted, `Button`, `Ar`, `Section`, `Marquee`, layout shell, `config.js`, noindex meta + robots.txt, README (DEMO_MODE) | check passes; tokens match chosen palette; Lighthouse mobile ≥90 on shell |
| **2 Hero + motion** | Navbar, Hero with entrance + parallax, ticker, SplitLines, Reveal, page transitions | 60 fps scroll in dev-tools profile; reduced-motion static; no layout shift on entrance; a11y 100 |
| **3 Flavors** | Carousel on home, `/flavors`, `/flavors/:slug`, per-flavour colours, quick-add (simulated) | all flavours come from `flavors.js` (only confirmed ones); keyboard-operable carousel; images lazy + sized |
| **4 Moments / why / community / both flavors** | Moments cards, pillars, community strip with empty state, the "Both flavors" card (replaces the pack builder; no pack/quantity/price claim) | no fabricated reviews/numbers; empty states look intentional; responsive at 390/768/1024/1440 |
| **5 Distributors** | Ways-to-work, wholesale form, 69-wilaya select, store-finder empty state | wilaya list verified from two sources and cross-checked count = 69; form validates, success message under DEMO_MODE, no network call (verified in devtools) |
| **6 Our story** | `/our-story` with approved copy and media | every statement traceable to BRAND_BRIEF "confirmed" |
| **7 QA, a11y, performance, previews** ✅ | duo-only story page, cross-browser/device matrix (`docs/qa/QA_MATRIX.md`), axe + manual a11y pass, link previews (per-route static HTML + `og.jpg`), `vercel.json`, error boundary / chunk retry / noscript / image safety, logo audit, `npm run e2e` | Lighthouse mobile ≥ 90 everywhere (home 95–97), a11y 100, best practices 100, CLS 0; axe 0 violations; zero third-party requests; e2e 9/9 on three engines |
| **8 Release** | final QA, pre-launch checklist review, build, private-repo handover | check passes; checklist below walked through with you |

## 4. Risks

1. **Brand & personality rights.** Kada, Miloud and Hipz names, faces and logo are protected. Written permission is needed before any public or commercial use. Until then the site stays private (noindex, robots disallow, private repo).
2. **Images out of public repos.** Can/logo/creator images only in a **private** GitHub repo; never publish a public repo or deploy preview publicly.
3. **Unverified claims.** Today almost nothing is verified (see BRAND_BRIEF). No flavours, ingredients, calories, health claims, prices, stores or reviews until confirmed; unknown = empty state.
4. **Image sourcing.** Only images we generate or you supply. No scraping from Instagram/TikTok, no stock photos of people, no assets from the reference template.
5. **Reference template.** Match structure/proportion/motion feel only; code, copy, imagery, icons, fonts files are our own; template name never appears.
6. **Contact data.** Phone numbers found on Instagram are not to be published without approval.
7. **Wilaya data accuracy.** Needs two-source verification; administrative divisions can change.
8. **Pitch realism vs. honesty.** The site looks official by design; the protections are invisible only. Make sure the owners know it's a pitch before sharing the link.
9. **Motion performance.** Heavy parallax/rotation can hurt Lighthouse ≥90 on mobile; prefer transform/opacity, pre-rendered sequences over WebGL.

## 5. Pre-launch checklist (not shown on the site)

- [ ] Written permission from Kada and Miloud (names, likeness, content) and from Hipz owners
- [ ] Written permission from Kada and Miloud for every creator photo taken from their public accounts/channel (`docs/content/CREATOR_PHOTOS.md`) before it is shown publicly
- [ ] Replace `DEMO_MODE` with a real backend (or deliberately keep the flag)
- [ ] Remove noindex / robots disallow **only** with owner approval
- [ ] Confirm every product fact (flavours, ingredients, sizes, claims) with the brand
- [ ] Confirm contact details and distributor names allowed to be public
- [ ] Algerian legal items: company details, any labelling/advertising rules for beverages (check with the brand's counsel)
- [ ] Licences for fonts and any third-party assets recorded
- [ ] Repo stays private; no secrets committed
- [ ] **(Phase 7)** The hero and flavor scene images are AI-generated concept art based on real bottle photos: the owner must tell the brand this; real photography should replace them if the brand wants (BRAND_BRIEF row 55)
- [ ] **(Phase 7)** Written permission from Kada, Miloud and the brand for names, likeness and the creator photos (duo photos only on `/our-story`)
- [ ] **(Phase 7)** Every draft copy entry approved (`npm run copy:review` → `docs/content/COPY_REVIEW.md`; flip `draft` to approved in `src/data/copy.js`)
- [ ] **(Phase 7)** A real backend for the forms (replace `DEMO_MODE` / set `FORM_ENDPOINT`)
- [ ] **(Phase 7)** Remove noindex (robots meta, `public/robots.txt`, `X-Robots-Tag` in `vercel.json`) only with owner approval
- [ ] **(Phase 7)** The logo is a small 150 px file: get a vector or high-resolution version before any public launch (it is never shown larger than 52 px tall today)
- [ ] Set `SITE_URL` (`src/config.js`) to the deployment URL before sending the link, so previews get an absolute image

## 6. Deviations after Phase 1 inputs

- Product is sold in **PET bottles**, not cans (BRAND_BRIEF rows 15–16). Wherever this roadmap/reference say "can", read "bottle": `Bottle` component (was `Can` in the first draft), carousel cards show bottles.
- Exactly two flavors (lemon, peach) → "variety pack" and flavor grid copy must not imply more. Pack content (what a "pack" is) is unconfirmed.
- Reference motion is now measured (REFERENCE_ANALYSIS §6): the reference has **no** idle float, no pinned/rotating cans and no page-transition fade; our Phase 2 additions beyond it are proposals.
- Reviews: no real reviews exist → community/empty state only.

## 7. Phase 2 notes and later-phase notes

- Mobile navigation: the reference has no hamburger (measured: only Logo, Account, Cart), but we need /flavors and /distributors on mobile, so our hamburger is a **deliberate documented deviation**: full-screen dialog overlay, focus trap, ESC closes, scroll lock, reduced-motion safe.
- Page transitions: the reference changes pages instantly (measured). We use a ≤120 ms fade-in only (no exit wait).
- **/distributors (Phase 5, not built yet):** "Become a distributor" with the public contact numbers from `PUBLIC_CONTACT` (`src/data/site.js`), the simulated wholesale form (DEMO_MODE), and the empty-state store finder, because distribution areas are unknown. No areas are listed.
- Phase 2 shipped: navbar, two-state hero (lemon/peach, auto-advance 6 s, pause on hover/focus/button, none under reduced motion), ticker at 72 px/s, `SplitLines`, `Reveal` (measured 82 % trigger, 0.9 s), `Parallax`, `Picture`/`Bottle`, optional Lenis (`SMOOTH_SCROLL`), `LazyMotion` (domAnimation). Home sections below the ticker are empty placeholders.

## 8. Phase 3 decisions and notes

- "Quick add" → **"Find it"** (→ `/distributors`). No cart, price, stock or add-to-cart interaction anywhere.
- "Variety Pack" tile → **"Both flavors"** tile (Lemon + Peach bottles). The Phase 4 "pack builder" deliverable is now the "Both flavors" card.
- Social links live only in `SOCIAL_LINKS` (`src/data/site.js`); no TikTok anywhere.
- The reference's `/flavors` URL is a 404 (no listing page exists), so our `/flavors` is a showcase page (two alternating flavor bands, the "Both flavors" tile, a closing "Find it" call to action).
- Hero is now full-bleed (no dark card) with the owner's wide scenes; thirst effects are transform/opacity only and fully off under reduced motion.
- Performance lessons (details in the Phase 3 report): Chrome ignores a full-viewport hero image as an LCP candidate, so the home LCP is the headline text; the hero image request is started right after the headline's first paint; flavor pages preload their route's hero image via a tiny inline script in `index.html`.

## 9. Phase 4 decisions

- Hero approved as built; only the measured rounded inset frame was restored (see REFERENCE_ANALYSIS §8). Headline + Arabic chip are approved copy.
- Volume 330 ml (owner) — text-only attribute in "The basics"; images never carry it.
- No people imagery: Moments, Community and "Both flavors" use bottles, flavor colors, logo and our own SVG icons only; data slots are ready for real photos/posts later.
- The reference's ingredients section (rotating cans + ingredient callouts) is **skipped on purpose**: no confirmed ingredients.
- Home order: hero, ticker, flavors, moments, why Hipz, both flavors, community, footer.

## 10. Phase 5 decisions

- `/distributors`: framed hero, commercial-service band (the two bio numbers, from `PUBLIC_CONTACT` only), "Ways to work with Hipz" rows, simulated wholesale form (`src/lib/submit.js`, DEMO_MODE), store finder with an intentional empty state (`src/data/stores.js` is empty), closing band. No areas, distributors, stores, prices, margins, minimums, delivery or reply-time promises.
- Phone numbers appear nowhere else on the site (not in the footer).
- Wilayas: 69, verified against the official JO n° 25/2026 (French + Arabic) and Wikipedia.

## 11. Phase 6 decisions

- Part 0: wilaya selects (form, store finder) show **names only**, never code numbers; codes stay internal with a `codeVerified` flag. Codes 59–69 were verified on 2026-11-04 against presidential decree n° 26-206 (JO n° 40 of 3 June 2026, French + Arabic), which also fixes the spellings أفلو and "Bou Saâda" now used.
- Part 0: only creator photos with `selected: true` in `src/data/creators.js` are kept in `dist/` (pruned at build; `npm run check` fails otherwise).
- Part C (motion parity, owner priority): text now pops **character by character** like the reference (scale 0 → 1, 30 ms stagger, overshoot curve), paragraphs rise per character, blocks rise on the measured curve, badges pop on a spring; everything plays once, no exit. Lenis smooth scrolling is off (the reference scrolls natively). Specs and comparison numbers: `docs/design/MOTION_SPEC.md`.
- Owner decisions for the story page (BRAND_BRIEF rows 43–48): only four confirmed facts; everything optional lives in `src/data/story.js` as null/empty with sources and is not rendered while empty; launch-video facts need `verified: true`; photos only when selected, names only where verified.
- `/our-story` (Part 2): the reference has no About/Story page, so it is designed from its measured language. Sections: framed duo hero (pre-JS first frame), duo band (social links + collage), "At the bottling line" gallery, "Two flavors, one smile" band, optional blocks (hidden while `story.js` is empty), closing band. No phone numbers, no volume, no numbers.
- Part 3: `npm run copy:review` → `docs/content/COPY_REVIEW.md`; banned-claims list (`src/data/bannedClaims.js`) runs as a test.

## 12. Phase 7 decisions

- `/our-story` uses only duo photos (BRAND_BRIEF row 51), art-directed: hero = avatar; duo collage = two zoomed crops of the factory photos + a designed tile; gallery = the factory photos in full. A solo block renders only when both creators have a solo photo.
- Ticker re-measured per frame at 1440 and 390: the reference runs at 60.0 px/s (ours 60.3–60.5). Phase 1 recorded 72 px/s from item positions sampled every 250 ms; the current reference no longer runs at that speed (not scroll-dependent) — kept at the current measurement.
- Hero photo "lag" (Phase 6 comparison) is start-up timing: every sample sits on the measured curve (implied start times within 22 ms); no change needed.
- Part 1: Chromium / Firefox / WebKit (WebKit ≈ Safari engine, not Safari) × 7 routes × 4 widths and five emulated devices, all pass (`docs/qa/QA_MATRIX.md`). Fixed: WebKit drops the focus ring on native selects (selects are now drawn by us), safe areas (`viewport-fit=cover` + `env()` insets), `text-size-adjust`, phone-landscape hero frames sized to the screen.
- Part 2: axe-core 0 violations on 15 route/state combinations; fixed duplicate id, link names not containing their visible text, a keyboard-unreachable scroller, story navbar contrast over the photo; pause buttons for the moving bands (WCAG 2.2.2); every target ≥ 44 px; a global reduced-motion safety net for CSS transitions.
- Part 3: link previews per route (static HTML written at build time), `public/og.jpg`, favicons, `SITE_URL`, `vercel.json` (rewrites, `X-Robots-Tag`, caching, security headers). Zero third-party requests on every page.
- Part 4: error boundary (page-level + root), lazy chunk retry → friendly reload page, `<noscript>`, failed images hide without layout shift.
- Part 5: `npm run e2e` (not in `npm run check`).
- Part 6: logo never taller than 52 px (≈ 74 CSS px wide).
- Known, by design: the measured entrances move content (navbar 24 px during the first ~0.8 s, blocks rising for ~0.7 s after they appear); a tap aimed at a control in that moment can land just next to it.

## 13. Latest Lighthouse (mobile, 3 runs each, local static server)

| Route | Performance | Accessibility | Best practices | LCP | CLS |
|---|---|---|---|---|---|
| `/` | 95–97 | 100 | 100 | 2.4–2.6 s | 0 |
| `/flavors` | 93 | 100 | 100 | 3.2 s | 0 |
| `/flavors/lemon` | 98 | 100 | 100 | 2.4 s | 0 |
| `/flavors/peach` | 97–98 | 100 | 100 | 2.4 s | 0 |
| `/distributors` | 96 | 100 | 100 | 2.7 s | 0 |
| `/our-story` | 99 | 100 | 100 | 2.3 s | 0 |
| unknown route (404) | 99 | 100 | 100 | 2.3 s | 0 |

