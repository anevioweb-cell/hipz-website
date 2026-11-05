# Creator photos (Phase 5 Part 6, used from Phase 6)

Collected for the upcoming `/our-story` page (Phase 6), at the owner's explicit request. **Private pitch use only**: the photos come from Kada & Miloud's own public accounts and the official channel, are kept out of git (masters in `docs/inputs/creators/`, derivatives in `public/images/creators/`, both gitignored), are shown only on `/our-story` (Phase 6, see "Use on /our-story" below), and need the creators' **written permission before any public launch**.

## How they were obtained
- No login, no cookies or credentials, no browser extensions, no third-party downloader sites.
- `gallery-dl` (open source, no login) **failed**: Instagram answered "user could not be found" for logged-out requests.
- **Worked:** Playwright opening the public, logged-out profile and post pages, reading each post's own full-size image URL (largest `srcset` entry) and downloading it from the Instagram CDN. A login prompt overlays the carousel arrows; the "Next" button was clicked programmatically to see the other public slides (nothing was dismissed, no account used). Pacing: ~2.5 s between posts, 0.8 s between images, 5 posts in total.
- YouTube: `yt-dlp` (open source, no login) for the official channel avatar, banner and the 8 most recent video thumbnails.
- Logged-out Instagram only shows the most recent posts: Miloud's account exposed 4 photo posts + 1 reel, the duo's account 1 photo post + 3 reels.

## Identification (context only — no face recognition or face matching)
- **Miloud**: solo photos on his own account `@miloud.kwm` (display name "Bessaïh Miloud | بسايح ميلود", bio links `@kadawmiloud`).
- **Both**: the duo's own posts/channel. In standing photos of both, the owner's rule applies: **Kada = the shorter, Miloud = the taller**.
- **Kada**: his own account **`@kada.kwm`** (owner-supplied, official; display name "Kada 🇩🇿", bio "Créateur de contenu youtube @kadawmiloud") is a valid source — identity by account context. See the Phase 6 Part A section below: it currently holds **no usable solo photo**. No solo Kada image was taken from anywhere else (no fan pages, news, wallpapers or reposts).
- Useful public fact found on the way: the duo's Instagram bio says **"Owners of @hipzdrink 🍋🍑"** (also recorded in BRAND_BRIEF).

## Images

| File | Who (left → right) | Source / post | Date | Original size | Why / issues | Status | Confidence |
|---|---|---|---|---|---|---|---|
| `miloud-01.jpg` | Miloud | @miloud.kwm — https://www.instagram.com/miloud.kwm/p/CWREPJUMns9/ | 2021-11-14 | 1228×1228 | Sharp close-up, good light, plain hoodie, no text. Issue: a small framed photo on the shelf in the background (crop it out) | **selected** | high (own account, solo) |
| `miloud-02.jpg` | Miloud | @miloud.kwm — https://www.instagram.com/miloud.kwm/p/CY61-G_N8qj/ (slide 1) | posted 2022-01-19 (page shows 2026-05-22 edit) | 1440×1800 | Half body, warm golden-hour light, outdoor | **selected** | high |
| `miloud-03.jpg` | Miloud | @miloud.kwm — https://www.instagram.com/miloud.kwm/p/CpdREVbt96a/ (slide 2) | 2023-03-06 | 1440×1441 | Studio portrait, suit, clean grey background | **selected** | high |
| `miloud-04.jpg` | Miloud | same post (slide 3) | 2023-03-06 | 1440×1441 | Studio close-up, suit, lilac background (cool grade) | **selected** | high |
| `candidates/miloud-CY61-G_N8qj-2.jpg` | Miloud | same post as miloud-02 (slide 2) | — | 1440×1799 | Near-duplicate of miloud-02 | candidate | high |
| `candidates/miloud-CpdREVbt96a-1.jpg` | Miloud | same post as miloud-03 (slide 1) | 2023-03-06 | 1440×1441 | Holds a YouTube play-button award: **another brand's logo** | rejected | high |
| `candidates/miloud-C5Ygv3uNCTq-1.jpg` | Miloud | https://www.instagram.com/miloud.kwm/p/C5Ygv3uNCTq/ | 2024-04-05 | 1593×1593 | Night photo, small face, low light | rejected | high |
| `both-01.jpg` | Kada, Miloud | @kadawmiloud — https://www.instagram.com/kadawmiloud/p/De9mIQDDAyc/ (slide 2) | 2026-10-26 | 3072×4096 | Both in the bottling plant with Hipz Lemon bottles; very sharp. Issues: "Golden Coast" hoodie print, machine plate text | **selected** | medium (left/right by height rule) |
| `both-02.jpg` | Kada, Miloud | same post (slide 1) — **identical to the supplied `source-photo.jpg`** | 2026-10-26 | 3024×4032 | Same scene, Kada holds a bottle toward the camera | **selected** | medium |
| `candidates/duo-De9mIQDDAyc-3.jpg`, `-4.jpg` | Kada, Miloud | same post (slides 3–4) | 2026-10-26 | 3024×4032 | Same scene, small pose changes | candidate | medium |
| `both-03.jpg` | both (who is left/right: **unverified**, seated) | YouTube channel avatar, https://www.youtube.com/@kadaWmiloud | — | 2048×2048 | Official channel art, both smiling, plain background | **selected** | high that it is both; per-person unverified |
| `candidates/yt-channel-banner.jpg` | both, small figures | YouTube channel banner | — | 2048×1152 | Faces small; good as a wide landscape | candidate | — |
| `candidates/yt-thumbnails/*.jpg` (8) | various | latest 8 video thumbnails | — | 1280×720 | Big Arabic text overlays, other people, football-club and kit-brand logos, one with fake-blood make-up | rejected | — |

Contact sheet of the selected images: `docs/shots/creators-sheet.png`.

**Final selection:** Miloud 4, both 3, **Kada 0** (the brief asked for 4–6 per person). Missing: solo photos of Kada.

## Phase 6 Part A — Kada (`@kada.kwm`), checked 2026-11-04

What the public, logged-out account shows (Playwright, one profile visit, no login, nothing dismissed):
- **1 post** in total (the profile header says "1 Posts"): a reel that is a **collaboration post owned by another account** (a third party; not linked here). It is a video frame from another brand's show, the cover is 361×640, and it is a video, not a photo → **rejected** (other brand, low resolution, video frame).
- **Profile picture**: a mirror selfie in a tiled room, phone in hand. Logged out it is served at **150×150 px only** → too small; also a bathroom mirror selfie is weak for a brand page → **not taken**.
- One story highlight ("ذكر", a calligraphy image, not a photo of Kada) → not relevant.

Methods tried, in the required order:
1. Playwright on the public profile: worked, but there is nothing usable to save (above).
2. `gallery-dl` (logged out) on the profile/avatar: **failed**, "Requested user could not be found" (same as Phase 5).
3. A public downloader website: **not used**. It could only fetch the same single collab reel or a larger copy of the mirror-selfie avatar; neither meets the criteria, so visiting ad-heavy third-party sites was not justified.

Result: **Kada solo photos: 0.** The contact sheet is unchanged. `src/data/creators.js` and the `/our-story` page pick up any `kada-*` entry automatically once it exists (see "Adding photos later").

## What the owner could add manually (for Kada)
- Kada's account `@kada.kwm` has only one public post (a collab reel); 3–5 good solo photos sent by Kada himself (or from older posts he archived) are the best route. The HD version of his profile picture can be saved from the app if he wants it used.
- Older duo posts are hidden from logged-out visitors; https://www.instagram.com/kadawmiloud/ logged in may show solo photos of Kada in the duo's own feed.
- The second official channel linked in the duo bio: https://www.youtube.com/@kadawmiloud_plus
Please save any picks as `docs/inputs/creators/kada-01.jpg …` and tell me which post each came from.

## Data
Only entries with `selected: true` (= actually shown on a page) are kept in the production build: `vite.config.js` prunes the rest from `dist/images/creators/`, and `npm run check` runs `scripts/build/check-dist.mjs`, which fails if an unused creator image is in `dist/`.

`src/data/creators.js` lists every selected image with who is shown, confidence and a hand-set focal point; `npm run images` builds AVIF/WebP/JPG at 480/768/1080/1440/2048 w into `public/images/creators/` with exact sizes in `src/data/images.generated.js`.

## Adding photos later
Save the master as `docs/inputs/creators/kada-01.jpg` (etc.), add an entry to `src/data/creators.js` (`id: 'kada-01'`, `image: 'creators/kada-01'`, `people: ['kada']`, a focal point, `selected: true`), then run `npm run images` (the image list is read from that file). The story page reads solo photos per person from that file, so no page code changes are needed.

## Use on /our-story (Phase 7: duo photos only)

The owner decided (BRAND_BRIEF row 51) to use ONLY photos of Kada and Miloud together; sourcing is closed.

| File | `selected` | Where (crop) | Caption shown |
|---|---|---|---|
| `both-03.jpg` | yes | hero (whole square: right 62 % of the frame on landscape, top half on portrait) | "Kada & Miloud" (no left/right: seated, unverified) |
| `both-02.jpg` | yes | gallery (full frame, 4:5) **and** duo collage (wide 16:11 crop, zoom 1.3, both upper bodies) | gallery: "Kada holds up a Hipz Lemon; Miloud stands on the right."; collage: "Kada (left) & Miloud (right)" (owner height rule) |
| `both-01.jpg` | yes | gallery (full frame, 4:5) **and** duo collage (zoom 2.3 on the pallet of bottles, no faces) | gallery: "Kada (left) and Miloud (right) at the bottling line…"; collage: "Hipz Lemon, stacked at the bottling line" |
| `miloud-01/02/03/04.jpg` | **no** | not used; pruned from `dist/` | — |

The collage's third tile is designed (lime, «هايبز» and the smile arc), not a photo. No crop is used twice; crops are data in `src/data/creators.js` (`crops`). Alt texts describe only what is visible and contain no names.
