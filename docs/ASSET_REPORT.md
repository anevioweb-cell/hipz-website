# Asset report (Phase 2, Part 0)

Reviewed 2026-11-03. Masters are in `docs/inputs/` (gitignored). Real references: `screenshot-1.png`, `screenshot-2.png`, `source-photo.jpg`, video frames.

## Files received
| File | What it is | Size | Verdict |
|---|---|---|---|
| `lemon.jpeg` | Styled hero scene: lemon bottle on ice with lemons/leaves, yellow-green background | 1856×2304 JPEG | **ACCEPTED** |
| `Peach.jpeg` | Styled hero scene: peach bottle on ice with peach slices, orange background | 1856×2304 JPEG | **ACCEPTED ONLY CROPPED** (see below); full image REJECTED |
| `lemonNoBg.png` | Lemon bottle cutout (transparent) | 448×557 RGBA | **ACCEPTED, low resolution** |
| `PeachNoBg.png` | Peach bottle cutout (transparent) | 448×557 RGBA | **ACCEPTED ONLY CROPPED** (same reason); low resolution |
| `public/logo.jpg` | Hipz round logo: white wordmark + smile on lime circle, black corners | **150×150** JPEG | Accepted as source; low resolution |

Note: the brief mentioned four images (white-background + hero scene per flavor). What arrived are two hero scenes and two ready-made cutouts; no white-background originals. The cutouts are only 448 px wide.

## Fidelity check against the real product
| Element | Lemon scene | Peach scene |
|---|---|---|
| "Hipz" logo lettering and smile | Matches the real logo closely (bold H-i-p-z, slanted z, smile) | Matches closely |
| ® mark | Present, top right of logo | Not visible |
| Label text | "Lemon" on green strip — matches real | "Peach" with the small-cap-looking "h" — **matches the real label** (the real bottle shows the same lettering in screenshot-2) |
| Fruit illustration | Lemon slice + whole lemon, leaves — plausible | Peach slice + peach — plausible |
| Cap | Yellow — matches | Orange — matches |
| Bottle shape | PET bottle with ribbed lower body — matches | Matches |
| Creator faces on lower label | Not shown (real packs show faces) — **difference, not a distortion** | Illustrated faces at the sides |
| Extra text | none | **Invented small print** ("Pett feda, gdr us foz fuderjo jonson pdif toffre") and **"330ML"** and a small stamp: gibberish / an unconfirmed volume. The owner states the volume is UNKNOWN and must never be displayed. |

Result:
- **Peach scene: full image REJECTED** (gibberish text + invented volume). It is used **only as a crop** that ends just under the "Peach" label (`top 0 … 1668 px` of the master, a pure crop, nothing repainted). The cropped version contains only the logo, label, fruit and cap. Same crop (402 px) for the cutout.
- **Lemon scene: ACCEPTED.** Its small difference from the real pack (no faces) is noted; nothing in it is invented text.
- Nothing was repainted, re-lettered or edited by me.

## Logo
- `public/logo.jpg` is untouched. Derived by `scripts/make-logo.mjs`:
  - `public/logo-white.png`: white wordmark + smile on transparent (398×279, built from a 4× upscale with whiteness → alpha). Edges are slightly soft and the ® mark is too faint to survive. Fine at navbar size (≈ 90–110 px wide, downscaled); **would look soft above ~200 px**. It is used in the Navbar and Footer.
  - `public/logo-badge.png`: round version in original colors (for icons).
- **Better file to request:** the vector logo (SVG/AI/PDF) or a PNG ≥ 1000 px with transparent background, including the ® mark.

## Cutout quality (checked on dark `#16130E`, lime `#9BBD24`, white)
- Edges clean on all three; no white halos; logo text and droplets intact; small splash droplets kept for lemon.
- Limit: only 448 px wide → fine for cards ≤ 224 CSS px (2×) but soft if larger. Pipeline never upscales. To get larger cutouts I could run `rembg` locally on the 1856-px scenes (needs a ≈ 170 MB model download — not done; your OK is needed).

## Pipeline
`npm run images` (`scripts/images.mjs`, config `scripts/images.config.mjs`) → AVIF + WebP + JPG/PNG fallback at 480/768/1280/1856 (scenes) or native width (cutouts) in `public/images/`, plus `src/data/images.generated.js` (exact width/height). Raw masters are not committed.
