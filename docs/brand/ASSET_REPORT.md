# Asset report (Phase 2, Part 0)

Reviewed 2026-11-03. Masters are in `docs/inputs/` (gitignored). Real references: `screenshot-1.png`, `screenshot-2.png`, `source-photo.jpg`, video frames.

## Files received
| File | What it is | Size | Verdict |
|---|---|---|---|
| `lemon.jpeg` | Styled hero scene: lemon bottle on ice with lemons/leaves, yellow-green background | 1856×2304 JPEG | **ACCEPTED** |
| `Peach.jpeg` | Styled hero scene: peach bottle on ice with peach slices, orange background | 1856×2304 JPEG | **ACCEPTED ONLY CROPPED** (see below); full image REJECTED |
| `lemonNoBg.png` | Lemon bottle cutout (transparent) | 448×557 RGBA | **ACCEPTED, low resolution** |
| `PeachNoBg.png` | Peach bottle cutout (transparent) | 448×557 RGBA | **ACCEPTED ONLY CROPPED** (same reason); low resolution |
| `brand/logo.jpg` (moved out of `public/` in Phase 8 so it is not deployed) | Hipz round logo: white wordmark + smile on lime circle, black corners | **150×150** JPEG | Accepted as source; low resolution |

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
- `brand/logo.jpg` (moved out of `public/` in Phase 8 so it is not deployed) is untouched. Derived by `scripts/build/make-logo.mjs`:
  - `public/logo-white.png`: white wordmark + smile on transparent (398×279, built from a 4× upscale with whiteness → alpha). Edges are slightly soft and the ® mark is too faint to survive. Fine at navbar size (≈ 90–110 px wide, downscaled); **would look soft above ~200 px**. It is used in the Navbar and Footer.
  - `public/logo-badge.png`: round version in original colors (for icons).
- **Better file to request:** the vector logo (SVG/AI/PDF) or a PNG ≥ 1000 px with transparent background, including the ® mark.

## Cutout quality (checked on dark `#16130E`, lime `#9BBD24`, white)
- Edges clean on all three; no white halos; logo text and droplets intact; small splash droplets kept for lemon.
- Limit: only 448 px wide → fine for cards ≤ 224 CSS px (2×) but soft if larger. Pipeline never upscales. To get larger cutouts I could run `rembg` locally on the 1856-px scenes (needs a ≈ 170 MB model download — not done; your OK is needed).

## Pipeline
`npm run images` (`scripts/build/images.mjs`, config `scripts/build/images.config.mjs`) → AVIF + WebP + JPG/PNG fallback at 480/768/1280/1856 (scenes) or native width (cutouts) in `public/images/`, plus `src/data/images.generated.js` (exact width/height). Raw masters are not committed.

---

# Phase 3 additions

## New wide hero scenes (`LemonBg.jpeg`, `PeachBg.jpeg`, 2752×1536 JPEG, 16:9)
| Check | LemonBg | PeachBg |
|---|---|---|
| Logo "Hipz" + smile | matches the real logo; **® mark present** | matches; **® mark not visible** (minor, it is faint on the real bottle too) |
| Flavor label | "Lemon" on green strip: correct | "Peach" with the small-cap "h" lettering: correct (same as the real bottle) |
| Cap / bottle shape | yellow cap, PET bottle: correct | orange cap, PET bottle: correct |
| Invented small print, "ml", extra words | none found (lower label zoomed) | none found (lower label zoomed; area is a smooth mist, the creator illustration appears only partially) |
| Bottle cut off? | no: whole bottle inside the frame | no: whole bottle inside the frame (base is covered by ice/mist) |
| **Verdict** | **ACCEPTED** | **ACCEPTED** |

Composition (fractions of the 2752×1536 master; hand-measured on a 2000 px preview, ±1 %):
| | bottle box (left, top, right, bottom) | bottle center / focal | calm zone |
|---|---|---|---|
| Lemon | 0.588, 0.036, 0.780, 0.972 (body; splash/fruit extend wider) | x 0.685, y 0.50 | left ≈ 0–35 %, smooth green-yellow gradient |
| Peach | 0.598, 0.036, 0.750, 0.950 | x 0.674, y 0.50 | left ≈ 0–38 %, smooth orange gradient |

The bottle sits at ≈ 67–69 % from the left (the brief asked for ≈ 62 %): close enough, the left third stays calm.

Calm-zone text contrast (zone x 4–34 %, y 25–90 %, relative luminance of pixels):
| | luminance p5 / mean / p95 | white text vs mean (worst) | ink `#16130E` text vs mean (worst) |
|---|---|---|---|
| Lemon | 0.37 / 0.48 / 0.63 | 1.98 (1.55) → **fails AA** | 9.33 (**7.39**) → passes AA/AAA |
| Peach | 0.26 / 0.38 / 0.51 | 2.43 (1.89) → **fails AA** | 7.62 (**5.50**) → passes AA |

Decision: on wide (landscape) viewports the headline and secondary text use **dark ink text**, and the navbar uses the dark logo/text. On portrait (phones) the portrait crop gets a dark bottom scrim with light text.

## Volume check on REAL photos only
Looked at: `screenshot-1.png` (lemon bottle close-up, lower body), `source-photo.jpg` (two bottles held by the men; shrink-wrapped pallet labels), `frames/f_011.jpg` (video close-up).
- A small block of printed text (Arabic-looking lines) and tiny icons / a QR-like square sit under the flavor label on the real bottle, and a small flavor word near the base.
- **No volume text (ml / cl / "330") is legible in any real photo** at the available resolution (best file: `source-photo.jpg`, bottle at left, region ≈ x 560–800, y 1580–2030; and the pallet packs at x 1080–1780, y 2300–2900). I cannot read the small print, so I have not put any volume anywhere. Please confirm the number with the owner/producer or send a sharp close-up of the label's small print.
- The "330ML" visible in the earlier `Peach.jpeg` scene is AI-generated and is never used.

## Reference
`https://joybliss.framer.website/flavors` returns **404**: the reference has no flavors listing page (only `/#flavors` and `/flavors/<slug>`), so our `/flavors` is a showcase page.

---

# Phase 4 additions — high-resolution full bottles

## Case that applied
**New files arrived**: `lemon-white.jpeg`, `peach-white.jpeg` (1856×2304 JPEG, full bottle on white).

| Check | lemon-white | peach-white |
|---|---|---|
| "Hipz" logo + smile | matches | matches |
| ® mark | present | present |
| Label text | "Lemon" (green strip) — correct | "Peach" (same lettering as the real bottle) — correct |
| Cap / shape | yellow cap, PET bottle — correct | orange cap, PET bottle — correct |
| Invented small print / volume text | none | none (lower body shows only the creator illustrations and leaves) |
| Whole bottle in frame | yes | yes |
| **Verdict** | **ACCEPTED** | **ACCEPTED** |

## Cutouts (`scripts/build/cutout.py`, run in an isolated venv)
- Tool: `rembg` 2.0.86 with the **`isnet-general-use`** model (171 MB ONNX). It was **already on disk** in `~/.rembg/models/` (dated 2026-10-20, before this phase), so no new download happened. onnxruntime 1.31 (CPU), installed in a throwaway venv in the session scratchpad.
- **Problem found and fixed:** plain rembg treated the white logo and the white label panels as background and punched holes through the brand mark (visible as the page color through "Hipz"). The mask is therefore post-processed: small edge gaps closed, every enclosed region filled, the liquid-filled body made fully opaque, and the clear neck keeps rembg's soft alpha. Then a white de-fringe (un-premultiply against white) removes light halos. The ORIGINAL pixels are kept — nothing repainted or re-lettered.
- Checked on ink `#16130E`, lime `#9BBD24` and white: logo, ® and label text intact, no holes. Remaining minor artifact: a faint light rim on the top edge of the lemon cap (it is the render's own rim light) and a slightly milky clear neck on peach (the clear plastic was rendered over white).
- Masters (lossless PNG, gitignored): `docs/inputs/cutouts/lemon-bottle.png` 815×2129, `peach-bottle.png` 636×2121. The bottles are tall and narrow, so "≥ 1400 px" applies to the height (2129 / 2121 px); widths are the full native widths.
- Pipeline outputs: `bottle-lemon` 160/240/360/480/640/815 w, `bottle-peach` 160/240/360/480/636 w — AVIF + WebP + palette-quantized PNG fallback. They replace the old 448 px cutouts (and the peach crop/fade workaround).
