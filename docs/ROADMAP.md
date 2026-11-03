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
- Flavors: `FlavorCard`, `FlavorCarousel` (scroll-snap + arrows), `FlavorHero`, `FlavorAttributes`, `MoreToSip`, `Can` (image + blob + hover), `PackBuilder` card
- Home: `Hero`, `Ticker`, `Moments`, `WhyHipz` (pillars), `IngredientsStage` (only if ingredients confirmed), `Community`, `PackCard`
- Distributors: `WaysToWork`, `WholesaleForm` (validation, DEMO_MODE), `StoreFinderEmpty`
- Data/config: `src/config.js` (`DEMO_MODE = true`), `src/data/flavors.js`, `src/data/wilayas.js`, `src/data/site.js`
- Head: `<meta name="robots" content="noindex, nofollow">`, `public/robots.txt` (`Disallow: /`)

`DEMO_MODE` rule: when true, nothing is sent anywhere; forms and "quick add" show a normal-looking success message. README must state that it must be replaced by a real backend (or the flag kept) before any public launch.

## 3. Phases

Global acceptance for **every** phase: `npm run check` (lint + typecheck/build + tests, defined in Phase 1) passes with no errors or warnings; `prefers-reduced-motion` respected; one commit per part; no push.

| Phase | Deliverables | Acceptance checks |
|---|---|---|
| **1 Scaffold + design system** | Vite+React+Tailwind+motion, ESLint/Prettier, `npm run check`, tokens (colour, type, spacing, radii), fonts self-hosted, `Button`, `Ar`, `Section`, `Marquee`, layout shell, `config.js`, noindex meta + robots.txt, README (DEMO_MODE) | check passes; tokens match chosen palette; Lighthouse mobile ≥90 on shell |
| **2 Hero + motion** | Navbar, Hero with entrance + parallax, ticker, SplitLines, Reveal, page transitions | 60 fps scroll in dev-tools profile; reduced-motion static; no layout shift on entrance; a11y 100 |
| **3 Flavors** | Carousel on home, `/flavors`, `/flavors/:slug`, per-flavour colours, quick-add (simulated) | all flavours come from `flavors.js` (only confirmed ones); keyboard-operable carousel; images lazy + sized |
| **4 Moments / why / community / pack** | Moments cards, pillars, community strip with empty state, pack card | no fabricated reviews/numbers; empty states look intentional; responsive at 390/768/1024/1440 |
| **5 Distributors** | Ways-to-work, wholesale form, 69-wilaya select, store-finder empty state | wilaya list verified from two sources and cross-checked count = 69; form validates, success message under DEMO_MODE, no network call (verified in devtools) |
| **6 Our story** | `/our-story` with approved copy and media | every statement traceable to BRAND_BRIEF "confirmed" |
| **7 Performance + a11y** | image optimisation (AVIF/WebP), code-split routes, font subsetting, contrast pass, focus states, RTL checks for `<Ar>` | Lighthouse mobile ≥90 (perf), a11y 100, best-practices ≥95; reduced-motion verified; keyboard-only tour |
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
- [ ] Replace `DEMO_MODE` with a real backend (or deliberately keep the flag)
- [ ] Remove noindex / robots disallow **only** with owner approval
- [ ] Confirm every product fact (flavours, ingredients, sizes, claims) with the brand
- [ ] Confirm contact details and distributor names allowed to be public
- [ ] Algerian legal items: company details, any labelling/advertising rules for beverages (check with the brand's counsel)
- [ ] Licences for fonts and any third-party assets recorded
- [ ] Repo stays private; no secrets committed

## 6. Deviations after Phase 1 inputs

- Product is sold in **PET bottles**, not cans (BRAND_BRIEF rows 15–16). Wherever this roadmap/reference say "can", read "bottle": `Can` component → `Bottle`, carousel cards show bottles.
- Exactly two flavors (lemon, peach) → "variety pack" and flavor grid copy must not imply more. Pack content (what a "pack" is) is unconfirmed.
- Reference motion is now measured (REFERENCE_ANALYSIS §6): the reference has **no** idle float, no pinned/rotating cans and no page-transition fade; our Phase 2 additions beyond it are proposals.
- Reviews: no real reviews exist → community/empty state only.
