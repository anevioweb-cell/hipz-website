# Reference Analysis — structure, proportions and motion

Reference: `https://joybliss.framer.website/` (a Framer template). **We study measurements only.** We rewrite all code, copy and images; no file, font file, image, icon or text is reused, and the template's name is never used.

How measured: opened in the in-app browser, read computed styles / bounding boxes via script at 1440, 1024, 768 and 390 px viewport widths (scrollbar ≈15 px at desktop, so usable width 1425). Flavour page `/flavors/ruby-orange` read through a text fetch (structure only).

**Method update (Phase 1, Part 3).** Motion was measured with Playwright (Chromium, headless) by `scripts/research/measure-reference.mjs` at 1440×900 and 390×844: computed transforms/opacity sampled every frame or every 60–250 ms. Raw numbers: `docs/design/reference-measurements.json`; screenshots: `docs/reference-shots/` (gitignored). Each motion entry below is labelled **MEASURED** or **PROPOSAL**.

**Honest limits.**
- Easing is not read directly; "ease-out" below is inferred from the decay curve of sampled values (exponential-looking deceleration). Treat the exact cubic-bezier as approximate.
- Reveal trigger offsets come from 20 px scroll steps (±3% of viewport); settle times include ~50 ms sampling granularity.
- The hero button's hover could **not** be captured (the node my selector matched did not change); marked PROPOSAL.
- Mobile (390) marquee speed measurement was **inconclusive** (the sampled item wrapped between samples); desktop value is used.
- Page layout/section tables in sections 1–5 and 7 were measured in Phase 0.

## 1. Section order (verified by Y positions at 1440)

| # | Section | y | height | Background | Notes |
|---|---|---|---|---|---|
| 0 | Navbar (overlay on hero) | – | 112 | transparent | logo, Account, Cart; loads with `translateY(-24px)` (animates down) |
| 1 | Hero | 14 | 872 (=100vh − 28) | plum, photo + 22% dark tint | inset rounded card, **radius 32** (24 mobile) |
| 2 | Yellow marquee ticker | 900 | 68 | lemon-yellow | items + star glyphs |
| 3 | Flavors | 968 | ~1070 | cream | header, prev/next arrows, horizontal card list |
| 4 | Moments | 2037 | 914 | plum | 4 cards (Slow & Easy / Gather / Celebrate / Outside) |
| 5 | Ingredients ("stage") | 2951 | 1122 | cream | floating cans on a "cloud", callouts |
| 6 | Ritual / why | 4073 | 767 | plum | intro + 3 numbered pillars |
| 7 | Reviews | 4840 | 1140 | yellow | 2 rows of review cards |
| 8 | Pack card | 5994 | 636 | lilac, **radius 32** | inset card, "build your pack" |
| 9 | Footer | 6645 | 592 | plum | brand, newsletter, 3 link columns, bottom bar |

Total document height: 7237 (1440) · 8137 (1024) · 7517 (768) · 7887 (390).

Flavour page: badge chips → H1 + price + pack-size selector + Add to cart (two-column with can) → description → "Tastes like / Feels like / Best with" → "More to sip" 4-up grid → footer.

## 2. Layout grid & spacing

- Page uses **full-bleed sections with inset rounded cards** for hero and pack: outer padding ≈ 12–14 px desktop, 10 px mobile.
- Horizontal padding: hero 48 (1440) / 32 (1024) / 20 (≤768); flavour list 32; moments 20 / 24 inner; ritual 32 (20 mobile); footer 32.
- Vertical rhythm: section paddings ≈ 80–120 px desktop (ritual 120/32, reviews 110/0, footer 96/32/36, ingredients 82 top, moments 82/78), ≈ 64–72 mobile. Gaps: 20 (card lists), 28, 46, 56, 64, 72.
- No fixed max-width container was found; content is fluid with side padding. **Proposal:** use `max-width: 1320px` + same side paddings (identical look to 1440, saner on ultrawide).
- **Spacing scale to adopt (px):** 4, 8, 12, 16, 20, 24, 28, 32, 48, 56, 64, 72, 80, 96, 120.

## 3. Type

| Role | Family (name only) | Size / line-height / tracking |
|---|---|---|
| H1 hero | DM Serif Display 400 | 112/102 (1440) · 80/72.8 (1024) · 50/48 (≤768); −1.4 px |
| H2 | DM Serif Display 400 | 60/60 (1024); 42/43.7 (≤768); −1.4 px; 1440 not captured (likely ~60) |
| H3 | Inter 600 | 24/24; −0.84 px |
| Body | Inter 400 | 16/20 (lead copy) |
| Labels / tags | DM Mono 400/500, Chivo Mono 600 (loaded) | uppercase small, not individually measured |

Licences: Inter, DM Serif Display, DM Mono, Chivo Mono are all distributed through Google Fonts under the SIL Open Font License (**to re-verify per family on the Google Fonts page in Phase 1**). We will *not* use these; Hipz gets its own pairing (see INSPIRATION.md).

## 4. Colour (hex from computed values)

plum `#2F1948` · cream `#FBF6ED` · lemon-yellow `#FDFF6D` · lilac `#CA9FFF` · white `#FFFFFF` · text on plum = cream. Hero overlay `rgba(0,0,0,.22)`.
Pattern worth keeping: **alternating dark/light/accent bands** (plum → cream → plum → cream → plum → yellow → lilac card → plum).

## 5. Shapes & components

- Radii: hero/pack card 32 (24 mobile), flavour/review cards 28, **pills 100 px**.
- Flavour card: 319 × 618 (desktop & mobile), white, padding 36/0/32, can ≈154 × 347 over a soft "blob" ≈277 × 297, name, "Quick add" pill.
- Review card: 451 × 273 desktop / 356 × 297 mobile, white, radius 28, padding 28, stars + meta.
- Moment card: 343 × 306 at 390, cream, padding 32.
- **Button:** pill, radius 100, padding `6px 6px 6px 22px`, label + circular arrow chip (lilac) on the right; primary white-on-plum-hero, secondary plum. Hover state **not observed** — *proposed:* label slides/nudges, arrow chip rotates 45° and background flips, 250 ms `cubic-bezier(.22,1,.36,1)`.

## 6. Animations (MEASURED unless marked PROPOSAL)

> **Superseded in Phase 6 by `docs/design/MOTION_SPEC.md`** (frame-by-frame re-measurement). Notably the hero headline and every section heading now pop character by character on the reference, and the ticker runs at 60 px/s. The table below is kept for history.

All values at 1440 wide unless stated. `motion` = `motion/react`; "ease-out" ≈ `[0.22, 1, 0.36, 1]`.

| Animation | Status | What was measured | Trigger | Implementation with `motion` / CSS |
|---|---|---|---|---|
| Navbar entrance | MEASURED | `translateY(-24px)`, opacity 0 → `translateY(0)`, opacity 1; holds ~300 ms, then ≈ 0.9 s decelerating (opacity .33 @392 ms, .68 @500, .94 @689, 1.0 @1190 ms) | page load | `initial={{y:-24,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.9, ease, delay:.3}}` (built in Phase 1 with 0.7 s / 0.2 s; tune in Phase 2) |
| Hero background photo | MEASURED | scale 1.35 → 1.0 over ≈ 1.2 s decelerating (1.30 @188 ms, 1.22 @288, 1.16 @392, 1.11 @500, 1.05 @689) | page load | `motion.div initial={{scale:1.35}} animate={{scale:1}} transition={{duration:1.2, ease}}` |
| Hero photo parallax | MEASURED | photo box top shifts −0.3 px per px scrolled (0 → −45 @150, −226 @800); the hero wrapper is `position: sticky; top: 0`, so following sections slide over it | scroll | `position: sticky` on hero wrap + `useScroll`/`useTransform(scrollY,[0,800],[0,-240])` on photo |
| Hero headline / lead / button | MEASURED | present from first frames (no transform/opacity animation on h1, lead, pill; the headline box widens 869 → 959 px at ~500 ms, i.e. a font/text layout settle). Pill rests at y=820 then settles to 784 by the end (~36 px rise) | load | PROPOSAL for Hipz: line-mask slide-up on headline (the reference does not do it) |
| Star badge | MEASURED | rests at `scale(0)`, opacity 0 until revealed | scroll/in view | `whileInView={{scale:1}}` spring (PROPOSAL for spring values) |
| Yellow ticker (marquee) | MEASURED | continuous leftward translation, **−71.9 px/s** (desktop), band height 68 px, 8 items, item width 292 px, items overlap in DOM (loop track) | continuous | CSS `@keyframes` on a duplicated track, duration = trackWidth / 72 (our `Marquee` has a `speed` prop; default tune 72). Pause on hover is PROPOSAL (not observed) |
| Review rows | MEASURED | two rows: row 1 leftward **−53.9 px/s**, row 2 rightward **+53.9 px/s** | continuous | two `Marquee`, `reverse` on the second, speed 54 |
| Flavor carousel | MEASURED | horizontal `overflow-x: auto`, no scroll-snap, `scroll-behavior: auto`; 15 cards = 5 flavors × 3 repeated sets; scrollWidth 4379 / viewport 1200; **Next click scrolls ≈ 289 px (one card 269 + gap 20)** with ≈ 0.4 s decelerating smooth scroll (1446 → 1660 @162 ms → 1727 @322 → 1734 @482) | arrow click / drag / wheel | `el.scrollBy({left: cardWidth+gap, behavior:'smooth'})`; optional scroll-snap is PROPOSAL |
| Flavor card idle tilt | MEASURED | the soft blob behind each can is statically rotated (≈ ±13°, a different angle per card); no idle float animation (rotation constant over 9 s) | — | static CSS `rotate` per card (data driven) |
| Card hover | MEASURED | card has no shadow/scale/background change on hover; the can only shows a ~1 px / 0.5° micro-settle (back to rest in ≈ 280 ms) | hover | effectively none. For Hipz: PROPOSAL `whileHover={{y:-12, rotate:-4}}` spring |
| Scroll reveals | MEASURED | initial states: Moment cards `y +80`, op 0; Cloud (ingredients) `scale .85, y +120`, op 0; Pillars `y +50`, op 0; Review rows `y +60`, op 0; Footer brand/links `y +40`, op 0. Trigger when the element's top reaches ≈ **73–89 % of viewport height** (Moment cards 82, Cloud 73, Pillar 89, Review rows 76, Footer brand 89); settle ≈ **0.8–1.1 s**, decelerating | in view, once | `whileInView`, `viewport={{once:true, amount:...}}`, `transition={{duration:.9..1, ease}}` (our `Reveal` defaults y=50, 0.7 s, margin −10 %: adjust in Phase 2) |
| Ingredients stage | MEASURED | not sticky/pinned (`position: relative`); cans/cloud are plain reveal (scale .85 → 1, y +120 → 0) as the stage enters (element top ≈ 73 % vh) | scroll | `Reveal`-style; no scroll-linked rotation exists in the reference |
| Sticky elements | MEASURED | only the hero wrapper is sticky (`top: 0`) | scroll | CSS `sticky` |
| Page transition | MEASURED | client-side route change is **instant**: URL changes within ~180 ms, scroll position resets to 0, no opacity fade on the content root | link click | Phase 1 `PageTransition` uses a 0.3 s opacity cross-fade — a deliberate PROPOSAL beyond the reference |
| Mobile menu | MEASURED | at 390 the navbar only has Logo + Account + Cart icons; **there is no hamburger/menu**. The Cart button opens a cart panel (cart panel, items, subtotal, close) | tap | Not copied (we have no cart). Our Navbar's full-screen menu with staggered links is our own PROPOSAL |
| Hero button hover | NOT MEASURED | selector matched a non-reactive node; no change seen | hover | PROPOSAL: arrow chip rotates 45° (as built), 200 ms |

**Reduced motion:** every item degrades to opacity-only or static (`useReducedMotion()`, `@media (prefers-reduced-motion: reduce)`); the reference was not tested for this.

## 7. Responsive behaviour (measured)

| Width | Hero | H1 / H2 | Notes |
|---|---|---|---|
| 1440 | 1397 × 872, pad 120/48/52, r32 | 112 / ~60 | Pillars side-by-side (x 770, 618 wide) beside the intro |
| 1024 | 981 × 872, pad 120/32/40, r32 | 80 / 60 | Pack card taller (1002) – content stacks |
| 768 | 734 × 872, inset 10, r24 | 50 / 42 | Pillars full width (706) |
| 390 | 371 × 872, inset 10, r24, pad 110/20/28 | 50 / 42 | Moments stacked (343 cards); pack 713 tall; footer 803 tall |

Takeaways: breakpoints ≈ 810 and ≈ 1200; hero is always full viewport height; type steps are large jumps, not fluid. *Proposed:* use `clamp()` for smoother scaling with the same endpoints.

## 8. Hero frame (re-measured in Phase 4, `scripts/research/measure-frame.mjs` → `docs/design/reference-frame.json`)

| Viewport | Frame margin (left/right/top) | Radius | Frame height | Logo offset in frame (left, top) | Nav cluster offset (right, top) |
|---|---|---|---|---|---|
| 1440×900 | 14 / 14 / 14 | 32 px | 871 (viewport − 29) | 38, 29 | 38, 46 |
| 1366×768 | 14 / 14 / 14 | 32 px | 741 (viewport − 27) | 36, 27 | 36, 43 |
| 1024×768 | 12 / 12 / 12 | 32 px | 720 | 32, 24 | 32, 38 |
| 768×1024 | 8 / 8 / 8 | 24 px | 620 | 16, 14 | 14, 19 |
| 390×844 | 8 / 8 / 8 | 24 px | 620 | 16, 14 | 14, 19 |

The wrapper is `position: sticky`, the frame has `overflow: clip`; page background `#FBF6ED` shows in the margin. The reference's flavor-detail page also uses rounded inset blocks (14 px margin, 32 px radius) — but as two side-by-side cards with the navbar above them, not a framed full hero.
Implemented: margins 8 / 12 / 14 px, radius 24 / 32 px, frame height 620 px (< 1024), 720 px (1024–1199), viewport − 28 px (≥ 1200); navbar offsets = margin + measured offsets.
