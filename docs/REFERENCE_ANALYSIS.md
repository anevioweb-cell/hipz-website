# Reference Analysis — structure, proportions and motion

Reference: `https://joybliss.framer.website/` (a Framer template). **We study measurements only.** We rewrite all code, copy and images; no file, font file, image, icon or text is reused, and the template's name is never used.

How measured: opened in the in-app browser, read computed styles / bounding boxes via script at 1440, 1024, 768 and 390 px viewport widths (scrollbar ≈15 px at desktop, so usable width 1425). Flavour page `/flavors/ruby-orange` read through a text fetch (structure only).

**Honest limits.**
- The pane did not run the marquee/carousel animations (positions stayed constant over 2 s samples), so **speed, direction and easing are NOT measured**. Items marked *proposed* are my recommendation, not a measurement.
- Hover states, page transitions, cursor effects and mobile-menu behaviour were **not observed**. Playwright is not installed here; I did not install it in Phase 0.
- Initial (pre-reveal) states were captured, which hints at reveal animations (below).

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

## 6. Animations

Measured facts first; everything else is a *proposal* in the `motion` (motion.dev, `motion/react`) idiom.

| Animation | Evidence | Trigger | Properties | Duration / easing | Implementation |
|---|---|---|---|---|---|
| Navbar entrance | initial `translateY(-24px)` seen | page load | y −24→0, opacity | *proposed* 0.6 s, `[.22,1,.36,1]`, delay 0.2 | `motion.nav initial={{y:-24,opacity:0}} animate={{y:0,opacity:1}}` |
| Hero entrance | H1 split into lines in DOM ("A sparkling ritual / for better days"); photo rendered larger than card (parallax/scale) | load | line-by-line y 100%→0 with mask, photo scale 1.15→1 | *proposed* 0.9 s stagger 0.08 | wrap lines in `overflow:hidden`, `motion.span` y `110%→0`; photo `scale` via `animate` |
| Hero photo parallax | photo box taller than hero (≈837 vs 620 at mobile; top −100) | scroll | translateY ±(~100px) | linear, scroll-linked | `useScroll({target})` + `useTransform(y,[0,1],[0,-100])` |
| Star badge pop | `scale(0)` initial state | in view | scale 0→1, rotate | *proposed* spring stiffness 260, damping 18 | `whileInView` |
| Yellow marquee | ticker translated −27 px, items + stars | continuous | translateX | **speed/direction not measured.** *Proposed* 30–40 s per loop, right-to-left, pause on hover | CSS `@keyframes marquee {to{transform:translateX(-50%)}}` on duplicated track; `animation-play-state` on hover; off under reduced-motion |
| Flavour carousel | `overflow-x:auto`, scrollWidth 4379 vs 1200 visible, prev/next arrows, 3 repeated sets in DOM | arrows / drag / wheel | scrollLeft, scroll-snap | *proposed* `scrollBy({left:339, behavior:'smooth'})` | CSS scroll-snap + arrow buttons; optional drag with `motion` |
| Card hover | can over blob | hover | can translateY −12, rotate −4°, blob scale 1.05 | *proposed* 400 ms spring | `whileHover` |
| Scroll reveals | pillars have `translateY(50px)` initial | in view | y 50→0, opacity | *proposed* 0.7 s, stagger 0.1, once | `whileInView`, `viewport={{once:true, margin:"-10%"}}` |
| Ingredients stage | cans "floating" on a cloud with callouts | scroll/idle | float y ±10, rotate ±3 | *proposed* 5–7 s infinite alternate | `animate={{y:[0,-10,0]}}` per can, different delays; sticky stage with `useScroll` for can rotation |
| Review rows | 2 rows, 20 px gap, cards wider than viewport (x −24) | continuous | translateX, opposite directions | **not measured**; *proposed* row 1 left 60 s, row 2 right 70 s | same CSS marquee, `animation-direction: reverse` |
| Pack card | big inset lilac card | in view | scale .96→1, radius preserved | *proposed* | `whileInView` |
| Page transitions / cursor / mobile menu | **not observed** | – | – | – | *proposed:* route cross-fade 300 ms (`AnimatePresence`), no custom cursor, full-screen menu with staggered links |

**Reduced motion:** every item above must degrade to opacity-only or static (`useReducedMotion()`, `@media (prefers-reduced-motion: reduce)`).

## 7. Responsive behaviour (measured)

| Width | Hero | H1 / H2 | Notes |
|---|---|---|---|
| 1440 | 1397 × 872, pad 120/48/52, r32 | 112 / ~60 | Pillars side-by-side (x 770, 618 wide) beside the intro |
| 1024 | 981 × 872, pad 120/32/40, r32 | 80 / 60 | Pack card taller (1002) – content stacks |
| 768 | 734 × 872, inset 10, r24 | 50 / 42 | Pillars full width (706) |
| 390 | 371 × 872, inset 10, r24, pad 110/20/28 | 50 / 42 | Moments stacked (343 cards); pack 713 tall; footer 803 tall |

Takeaways: breakpoints ≈ 810 and ≈ 1200; hero is always full viewport height; type steps are large jumps, not fluid. *Proposed:* use `clamp()` for smoother scaling with the same endpoints.
