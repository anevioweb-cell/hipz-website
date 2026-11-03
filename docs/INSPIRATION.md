# Inspiration — beverage / DTC sites with strong motion

Verification note: I could **not** open and scroll these live in Phase 0 (no visual review). "Excellent" notes come from Awwwards/search descriptions or from general knowledge of the brand and are marked accordingly. Ideas are concepts to adapt, never to copy. Please open each yourself before we commit to an idea.

| # | Site | Basis of note | What is excellent | One idea to adapt |
|---|---|---|---|---|
| 1 | Johnny's Dirty Soda — https://www.awwwards.com/sites/johnny-dirty-soda (brand site johnnysdirtysoda.com) | Awwwards page read: Nominee, built with Framer, tags Colorful/Animation/3D; highlights "Hero Section Animation" and "Drink Scroll Down" | Colour-saturated, playful soda identity; a drink that travels as you scroll | A can/bottle that **descends and settles into the flavour section** as the hero scrolls away |
| 2 | Faygo "Make the World Pop" — https://webmarketingassociation.org/iac/winner/19094/tmv-group-wins-2025-iac-award-for-make-the-world-pop-website.html | Award page snippet only (2025 IAC, Best Beverage Website) | Each scroll "unlocks colour, movement and energy" | **Page background colour shifts per flavour** as you scroll through the lineup |
| 3 | Obrigado Coconut Water — https://www.awwwards.com/sites/obrigado-coconut-water | Listed on Awwwards; page not read | Product-forward, clean, tactile | Small **ingredient/fruit elements floating around the can** with different parallax speeds |
| 4 | Bunta Beer — https://www.awwwards.com/inspiration/3d-product-scroll-animation-bunta-beer | Awwwards inspiration title: "3D product scroll animation" | Scroll-driven product rotation | **Can rotation tied to scroll progress** (pre-rendered image sequence or CSS 3D tilt, not WebGL, for performance) |
| 5 | Angle Brewery — https://www.awwwards.com/inspiration/homepage-scroll-angle-brewery (also product-page and horizontal-scroll entries) | Awwwards inspiration titles only | Horizontal product-collection scroll, strong product pages | **Pinned horizontal scroll** for the flavour lineup on desktop |
| 6 | 7UP — https://www.awwwards.com/sites/7up | Listed on Awwwards; not read | Big-brand soda treated with motion and bold colour | Bubbles / fizz as a **subtle, cursor-reactive particle layer** (CSS only, off for reduced-motion) |
| 7 | Liquid Death — https://liquiddeath.com | General knowledge, not opened | Brand voice IS the design: humour in every micro-copy and hover | **Playful micro-copy on hover/empty states** in Hipz voice (once the voice is approved) |
| 8 | Olipop — https://drinkolipop.com | General knowledge, not opened | Clear flavour system with colour per flavour, clean product pages | **Per-flavour colour token** driving page accents, card blobs and buttons |

## Adapting the reference to a youthful Algerian soda brand with creator energy

Keep the reference's **skeleton** (inset rounded hero, ticker, horizontal flavour cards, alternating bands, review rows, big inset pack card, footer) and change the **personality**:

1. **Colour — bolder, flavour-led.** Replace muted plum/cream with a high-contrast base and saturated accents. Until the real logo/cans are supplied, use *placeholder tokens*: ink `#140F24`, warm paper `#FFF3DC`, lemon `#FFE600`, peach `#FF7A5A`, with one electric accent (`#5B3DF5`). Each flavour gets its own colour that tints its card, blob and button. Lemon + peach come from a **low-confidence** hint — do not hard-code until confirmed.
2. **Type — playful, heavy, bilingual.** Latin display: a characterful heavy grotesk (candidate **Bricolage Grotesque**) in place of the refined serif; body **Inter** or **DM Sans**; mono labels **DM Mono**. Arabic accents: **Lalezar** (display) / **Cairo** (body) through the `<Ar>` component. All are Google Fonts; verify OFL licence in Phase 1.
3. **Creator presence.** A dedicated "Kada & Miloud" strip (hero secondary image, a "moments" card series, a community section of **real** posts/embeds supplied by them) — only with their approval and supplied media. Where media is missing: tasteful empty states, no stock faces.
4. **Motion with attitude.** Slightly springier easing than the reference (overshoot on can hovers, tilt on cards), bigger ticker type, Arabic words in the marquee, can "pop" interaction — always with reduced-motion fallbacks.
5. **Voice.** Short, cheeky, Algerian-street friendly; copy to be written after the brand confirms tone. No health claims.
6. **Reviews → Community.** We have no real reviews, so the review rows become a "community" marquee of real creator/fan posts supplied by the brand, or stay an empty state. No fabricated testimonials.
