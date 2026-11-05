# Handover — Hipz pitch site

A private pitch for Kada & Miloud (Hipz). Not a public product: `noindex` everywhere, simulated forms, private repo.

## Run and build

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # lint + format + build + unit tests (must stay green)
npm run build      # → dist/ (static site)
npm run e2e        # build + 9 browser flows (~15 s), optional
npm run images     # rebuild images + og.jpg + icons from the masters in docs/inputs (needs the masters)
npm run copy:review  # → docs/COPY_REVIEW.md for the owner
```

## Where content lives

| What | File | Notes |
|---|---|---|
| All visible text (EN + Arabic accents), page titles, link-preview text | `src/data/copy.js` | every entry is `draft(...)` until approved |
| Flavors (names, colours, attributes, 330 ml) | `src/data/flavors.js` | only confirmed facts |
| Story facts + optional fields (founded year, plant, quotes, milestones) | `src/data/story.js` | null/empty = section hidden |
| Social links / phone numbers | `src/data/site.js` → `SOCIAL_LINKS`, `PUBLIC_CONTACT` | phones appear only on `/distributors` |
| Creator photos (which, crops, captions, alt) | `src/data/creators.js` | only `selected: true` ships; duo photos only |
| Stockists | `src/data/stores.js` | empty → designed empty state |
| Wilayas | `src/data/wilayas.js` | 69, names shown only |
| Settings | `src/config.js` | `DEMO_MODE`, `FORM_ENDPOINT`, `SITE_URL`, `SMOOTH_SCROLL` |

**Swap an image:** put the new master in `docs/inputs/` with the same file name (see `scripts/images.config.mjs` for names and crops), run `npm run images`, check the page, commit the regenerated `public/images/*` and `src/data/images.generated.js`. Creator photos: master in `docs/inputs/creators/`, entry in `src/data/creators.js` (`selected`, `use`, `focal`, `alt`, `caption`), then `npm run images` (these files stay out of git).

## Approving copy

1. `npm run copy:review` and send `docs/COPY_REVIEW.md` to the owner.
2. For each approved entry, change `draft({...})` to `approved({...})` in `src/data/copy.js`.
3. `npm run check` (the banned-claims test fails on health/sugar/"best"/numbers etc.).

## Story entries from the launch video

Proposals are in `docs/STORY_PROPOSALS.md`. Only after the owner confirms one: add it to `src/data/story.js` with its `source` (`kind: 'launch-video'`) and **`verified: true`**. Entries without `verified: true` never render. Quotes need the exact original text + the English translation. The slogan «مع هايبز، ديما صحاب» / "HIPZ, Always Friends" goes into `copy.js` only if the owner confirms it.

## DEMO_MODE

`DEMO_MODE = true` (`src/config.js`): the wholesale form validates and shows a success message, but **nothing is sent or stored** (no network request, no storage, no cookies). Before any real use: set up a backend, set `FORM_ENDPOINT`, and set `DEMO_MODE = false` (or keep it on deliberately). With `DEMO_MODE = false` and no endpoint the form shows "not available yet".

## Deploy (Vercel) — ALWAYS from this machine

The live site is the Vercel project **hipz-website** (team "anevio", Hobby), production domain **https://hipz-website-snowy.vercel.app** — unlisted, `noindex`, no password (see `docs/DEPLOY_NOTES.md` for why: protected pages cannot be read by WhatsApp / Instagram preview bots).

**Never connect the GitHub repository to Vercel (no Git auto-deploy).** The creator photos are gitignored, so a Git build ships the site without them (this happened once on the first import). Deploy only a build made on this machine, which has the photos:

```bash
npm run check                    # must be green; also proves dist/ has only the selected creator photos
vercel build --prod              # local build into .vercel/output (needs the masters/derivatives on this machine)
vercel deploy --prebuilt --prod  # upload that build to the production domain
```

First time on a new machine: `npm i -g vercel@latest`, `vercel login`, `vercel link` (existing project: **yes**, scope **anevio**, project **hipz-website**), `vercel pull --yes --environment=production`. `SITE_URL` in `src/config.js` must stay the production domain (link previews need absolute URLs).

After deploying: open the site on a phone, check `/our-story` (hero photo, collage, gallery), and send yourself the link on WhatsApp to see the preview card.

## Before any public launch

See the pre-launch checklist in `docs/ROADMAP.md` §5 (permissions, AI concept-art disclosure, copy approval, backend, noindex removal only with approval, logo vector).
