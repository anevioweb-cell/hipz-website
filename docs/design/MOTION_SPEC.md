# Motion spec (Phase 6 Part C)

Measured on the reference home page and a flavor detail page with `scripts/research/measure-motion.mjs` (Playwright, 1440×900 and 390×844, device scale factor 1, requestAnimationFrame sampling of computed transform / opacity / filter / clip-path on every frame) under three scroll styles: slow wheel (40 px every 60 ms), normal wheel (100 px notches, ~8/s) and instant jumps (0.6 viewport). Raw frame dumps and videos: `docs/shots/motion/` (gitignored). Summary numbers: `docs/design/motion-measurements.json` (no reference text in it). Only behavior was measured — no code, assets or text were taken.

Implementation: `src/motion.js` (tokens), `src/components/motion/PopText.jsx`, `src/components/motion/PopBlock.jsx`, `src/components/motion/Parallax.jsx`. Verification: `scripts/research/compare-motion.mjs` → `docs/shots/motion-compare/` (curve plots, frame strips, `report.json`).

## General findings

- **Unit of the text "pop": the character.** Headings are split into single characters (inline-block, transform-origin at the glyph centre, **no overflow mask**, opacity stays 1).
- **Progress is time-based**, not scroll-linked: durations are identical in slow, wheel and instant scrolling. Only the sticky hero wrapper (−0.25 px per px) and the hero photo parallax are scroll-linked.
- **Plays once**: of 637 animated elements on the home page, none reset or replay when scrolling back up and down; there is **no exit animation**. Only scroll-linked/continuous elements (13) change on the way up.
- **No blur / filter / clip-path** animations were found anywhere: transform + opacity only.
- **Scrolling is native**: a 100 px wheel step lands within one frame (≈ 70 ms after the event, no easing, no inertia) → our Lenis smooth scroll is switched off (`SMOOTH_SCROLL = false`).
- **Header**: the navbar is not fixed and has no hide/show/shrink on scroll; it scrolls away with the hero. Only the hero wrapper is `position: sticky`.

## Per element type

| Element | Trigger | Unit | Stagger | Duration | Curve | Initial → final | Replay |
|---|---|---|---|---|---|---|---|
| Hero headline (h1, home) | on load, +0.42 s after the photo starts | character | 30 ms (median sample 33 ms = 2 frames) | 420 ms (lands at ≈ 400 ms) | cubic-bezier(0.35, 1.7, 0.6, 1) — overshoot **+14.3 %** (peak 1.143 at ≈ 217 ms), no undershoot | scale 0 → 1, opacity 1 | once |
| Section heading (h2) | top enters the viewport (≈ 96–105 % vh) | character | 30 ms | 420 ms | same as h1 | scale 0 → 1 | once |
| Paragraph / lead | top enters the viewport | character, **all at once** (no stagger) | 0 | 420 ms | cubic-bezier(0.45, 0, 0.5, 1) | y +20 px, rotate 5°, opacity 0 → 0, 0°, 1 | once |
| Label / chip / badge | top ≈ 82 % vh (block rule) | block | — | ≈ 600 ms | spring stiffness 250, damping 17, mass 1 (ζ 0.54, overshoot ≈ 12.8 %, then a small undershoot) | scale 0, opacity 0 → 1, 1 | once |
| Content block (heading + text + button group) | top ≈ 82 % vh | block | — | 703 ms | cubic-bezier(0.25, 0.9, 0.35, 1) | y +30, opacity 0 | once |
| Cards (flavor cards) | ≈ 82 % vh | block, 100 ms apart | 100 ms | 785 ms | cubic-bezier(0.25, 0.9, 0.35, 1) | y +70, opacity 0 | once |
| Pillars / rows | ≈ 82 % vh | block | sequential | 760 ms | cubic-bezier(0.25, 0.8, 0.3, 1) | y +50, opacity 0 | once |
| Card grid (moments) | ≈ 82 % vh | block | — | 868 ms | cubic-bezier(0.25, 0.9, 0.35, 1) | y +80, opacity 0 | once |
| Stage (cloud) | ≈ 82 % vh | block | — | 971 ms | cubic-bezier(0.25, 0.9, 0.35, 1) | y +120, scale .85, opacity 0 | once |
| Footer brand / links | ≈ 82 % vh | block, links +0.12 s | 120 ms | 703 ms | cubic-bezier(0.25, 0.9, 0.35, 1) | y +40, opacity 0 | once |
| Button (hero) | on load, +1.55 s | block | — | 355 ms | cubic-bezier(0.25, 0.2, 0.25, 1) | y +10, opacity 0 | once |
| Hero content group (home) | on load, +0.70 s | block | — | 703 ms | as content block | y +30, opacity 0 | once |
| Detail-page hero (flavor) | on load: heading +0.16 s, text blocks +0.26 / 0.32 / 0.41 / 0.47 s, tags +0.63 s (+0.15 s each) | block cascade (heading is **not** split) | ≈ 60–90 ms | as content block | as content block | heading y +40, text y +30, tags = badge | once |
| Hero photo | on load | block | — | 1.85 s | cubic-bezier(0.25, 1, 0.3, 1) | scale 1.35 → 1 | once |
| Navbar | on load, +0.23 s after the photo | block | — | 592 ms | cubic-bezier(0.15, 0.4, 0.15, 1) | y −24, opacity 0 | once |
| Hero wrapper | scroll | — | — | scroll-linked | linear | sticky, translateY −0.25 px/px | continuous |
| Ticker (marquee) | appears ≈ 0.6 s after load, no fade, no ease-in | track | — | continuous | linear | **60 px/s** (re-measured; Phase 1 had 72) | continuous |
| Card hover | — | — | — | — | — | no measurable hover transform on cards or pills (the blob behind a can grows ≈ 7 % and turns ≈ 6° on a slow ≈ 3 s curve, only when the pointer rests on a card — not copied: our cards have no blob) | — |

Trigger notes: measured with the slow wheel. Text pieces start as soon as their glyph centre enters the viewport (getBoundingClientRect top / innerHeight ≈ 0.92–1.05); blocks when their *transformed* top is at 0.78–0.92 of the viewport, i.e. ≈ 82 % — the same rule as before (`revealMargin = '0px 0px -18% 0px'`).

## Our implementation

- `PopText` — `variant="pop"` (characters, 30 ms, 420 ms, overshoot curve) and `variant="soft"` (characters together, y 20 / rotate 5° / opacity). Driven by the **Web Animations API** (compositor-friendly, exact cubic-bezier incl. the overshoot, no JS animation engine in the bundle — the first version with motion's `useAnimate` added 7 kB gzip and was reverted). `trigger="load"` for heroes.
- `PopBlock` — `variant="rise"` (offset-dependent duration on the measured curve) and `variant="badge"` (spring 250/17).
- Applied on every page: home (hero, section headers, flavor cards, moments, pillars, both-flavors band, community), `/flavors` (bands, closing), `/flavors/:slug` (detail cascade, basics, more), `/distributors` (hero, contact band, ways rows, form/finder headers, closing band), the footer, and `/our-story` (Part 2).
- Arabic words are never split into letters (letters must join): an Arabic word pops as one unit.
- Eyebrow labels in section headers use the badge pop; rich (non-string) intro paragraphs rise as one block (y 20) because they contain `<Ar>` markup.

## Accessibility and fail-safes

- One accessible name: headings get `aria-label` with the full text, the split characters are `aria-hidden`; on other tags (where `aria-label` is not allowed) a visually hidden, non-selectable copy carries the text. Visible text stays selectable; copy-paste gives it once.
- **prefers-reduced-motion**: no split, no stagger, no transforms, no scroll-linked motion — everything static and visible from the first frame (checked in the browser: 0 split pieces, 0 hidden elements apart from the inactive hero crossfade layer).
- Never invisible: without IntersectionObserver everything shows at once; anything still hidden 1.5 s after being in view is shown; **keyboard focus** entering a still-animating block or the navbar shows it immediately (checked: tabbing right after load never lands on an invisible link).
- Only transform and opacity animate (no layout shift: CLS 0 on every page). Hidden tabs pause WAAPI/rAF work; scroll-linked effects only run while scrolling.

## Comparison (scripts/research/compare-motion.mjs, 1440×900)

| Type | Initial (ref / ours) | Duration ref / ours | Stagger ref / ours | Overshoot ref / ours | Max curve deviation | Max timing offset |
|---|---|---|---|---|---|---|
| Hero headline | scale 0 / scale 0 | 383 / 400 ms (4.4 %) | 33 / 33 ms | 14.26 / 14.25 % | 0.060 | 19 ms |
| Section heading | scale 0 / scale 0 | 383 / 400 ms (4.4 %) | 33 / 33 ms | 14.26 / 14.25 % | 0.027 | 1 ms |
| Paragraph | y 1.25 em, 5° / y 1 em, 5° | 360 / 383 ms (6.4 %) | 0 / 0 | 0 / 0 | 0.076 | 23 ms |
| Label / chip | scale 0, op 0 / same | 617 / 584 ms (5.3 %) | — | 12.6 / 13.4 % | 0.074 | 17 ms |
| Button | y 10 / y 10 | 317 / 317 ms (0 %) | — | 0 / 0 | 0.038 | 16 ms |
| Card | y 70 / y 70 | 633 / 617 ms (2.5 %) | — | 0 / 0 | 0.021 | 1 ms |
| Content block | y 30 / y 30 | 566 / 567 ms (0.2 %) | — | 0 / 0 | 0.062 | 18 ms |
| Hero photo | scale 1.35 / 1.343 | 1267 / 1201 ms (5.2 %) | — | 0 / 0 | 0.145 | 115 ms |

"Duration" here is the time until the value is within 0.5 % of its final value; "deviation" is the largest difference in normalised progress at equal time; "timing offset" is the largest difference in the time at which each curve reaches 25 / 50 / 90 %.

Remaining differences, honestly:
- Paragraph start offset is 20 px on a 16 px font in the reference (1.25 em) vs 20 px on our 20 px lead (1 em): the offset is the same in pixels by design.
- Hero photo: our first animation frames land inside the JavaScript start-up task (≈ 100 ms), so the first sampled frame already shows ≈ 15 % progress; after that the curves run parallel. It is a start-up jank difference, not a curve difference.
- Durations of 383 vs 400 ms for characters are the same 420 ms curve; the 0.5 % threshold is crossed one frame apart.
- Sample timing resolution is one frame (≈ 16.7 ms); offsets of 16–23 ms are one frame.
- Marquee: ours starts at first paint; the reference shows its track at ≈ 0.6 s (after its own layout measurement). Not replicated (it would only delay content).
