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

## Deploy a PRIVATE preview (Vercel)

The repo and the deployment contain creator photos and the logo: keep both private.

1. Create a Vercel project from this folder **on this machine** (the creator photos are gitignored, so a Git-connected build would not have them):
   ```bash
   npm i -g vercel
   vercel login
   vercel link              # new private project
   vercel build             # runs npm run build and applies vercel.json
   vercel deploy --prebuilt # uploads the local build → a preview URL
   ```
   Never `vercel deploy --prod` to a public domain without the owner's approval.
2. In the Vercel dashboard → Project → Settings → **Deployment Protection**: turn on Vercel Authentication for previews (only logged-in team members can open it), or Password Protection if the plan includes it. To let Kada & Miloud in without an account, use the deployment's **Share** link (a bypass link) rather than removing protection.
3. Set `SITE_URL` in `src/config.js` to the preview URL (or `SITE_URL=https://… vercel build`), rebuild and redeploy, so link previews get an absolute image.
4. **Trade-off:** a protected deployment also blocks the WhatsApp / Instagram preview bots, so the card may show without image or title. Test by sending the link to yourself first. If the card matters more than the extra lock, the owner can choose an unprotected preview URL (still `noindex`, `robots.txt` Disallow, `X-Robots-Tag`, unlisted random URL) — that is the owner's call.
5. Check after deploying: deep links (`/flavors/lemon`, refresh), an unknown path (404 page), `curl -I <url>` shows `X-Robots-Tag: noindex, nofollow`.

## Before any public launch

See the pre-launch checklist in `docs/ROADMAP.md` §5 (permissions, AI concept-art disclosure, copy approval, backend, noindex removal only with approval, logo vector).
